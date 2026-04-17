package com.yash.QuickCart.services.impl;

import com.yash.QuickCart.dto.request.OrderRequest;
import com.yash.QuickCart.dto.request.PaymentVerifyRequest;
import com.yash.QuickCart.dto.response.OrderItemResponse;
import com.yash.QuickCart.dto.response.OrderResponse;
import com.yash.QuickCart.exception.BusinessException;
import com.yash.QuickCart.exception.ResourceNotFoundException;
import com.yash.QuickCart.models.*;
import com.yash.QuickCart.repository.*;
import com.yash.QuickCart.services.OrderService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * OrderServiceImpl - Handles order placement, Razorpay integration, and order management.
 *
 * NOTE: To use real Razorpay SDK, add dependency to pom.xml:
 *   <dependency>
 *     <groupId>com.razorpay</groupId>
 *     <artifactId>razorpay-java</artifactId>
 *     <version>1.4.3</version>
 *   </dependency>
 * Then replace the mock Razorpay logic below with real RazorpayClient calls.
 */
@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    /**
     * STEP 1: Create a Razorpay order and return the order ID to frontend.
     * Frontend uses this to open the Razorpay payment popup.
     */
    @Override
    @Transactional
    public Map<String, Object> createRazorpayOrder(String userEmail, OrderRequest request) {
        User user = findUser(userEmail);
        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new BusinessException("Cart is empty"));

        if (cart.getCartItems().isEmpty()) {
            throw new BusinessException("Cannot place order with an empty cart");
        }

        // Calculate total
        BigDecimal subtotal = cart.getCartItems().stream()
                .map(item -> item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        System.out.println("total : " +subtotal);
        BigDecimal shipping = subtotal.compareTo(new BigDecimal("499")) >= 0
                ? BigDecimal.ZERO : new BigDecimal("49");
        System.out.println("2nd total : "+shipping);
        BigDecimal total = subtotal.add(shipping);
        System.out.println("total : " +subtotal);

        // Build shipping address JSON
        String shippingAddress = buildShippingAddressJson(request);

        // Generate unique order number
        String orderNumber = generateOrderNumber();

        /*
        * REAL RAZORPAY INTEGRATION (uncomment when SDK is added):
        *
        * RazorpayClient razorpay = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
        * JSONObject orderOptions = new JSONObject();
        * orderOptions.put("amount", total.multiply(BigDecimal.valueOf(100)).intValue()); // in paise
        * orderOptions.put("currency", "INR");
        * orderOptions.put("receipt", orderNumber);
        * com.razorpay.Order rzpOrder = razorpay.orders.create(orderOptions);
        * String razorpayOrderId = rzpOrder.get("id");
        */

        // Mock Razorpay Order ID for demo
        String razorpayOrderId = "order_mock_" + UUID.randomUUID().toString().substring(0, 8);

        // Save a PENDING order in DB
        Order order = Order.builder()
                .orderNumber(orderNumber)
                .user(user)
                .orderStatus(Order.OrderStatus.PENDING)
                .paymentStatus(Order.PaymentStatus.PENDING)
                .razorpayOrderId(razorpayOrderId)
                .totalAmount(total)
                .shippingAmount(shipping)
                .shippingAddress(shippingAddress)
                .build();

        // Add order items (snapshot from cart)
        List<OrderItem> orderItems = cart.getCartItems().stream()
                .map(cartItem -> {
                    // Deduct stock
                    Product product = cartItem.getProduct();
                    if (product.getStockQuantity() < cartItem.getQuantity()) {
                        throw new BusinessException("Insufficient stock for: " + product.getName());
                    }
                    product.setStockQuantity(product.getStockQuantity() - cartItem.getQuantity());
                    productRepository.save(product);

                    return OrderItem.builder()
                            .order(order)
                            .product(product)
                            .productName(product.getName())
                            .productImage(product.getImageUrl())
                            .quantity(cartItem.getQuantity())
                            .unitPrice(cartItem.getUnitPrice())
                            .build();
                })
                .collect(Collectors.toList());

        order.setOrderItems(orderItems);
        orderRepository.save(order);

        System.out.println("Amount console : "+total.multiply(BigDecimal.valueOf(100)).longValue());
        // Return data needed by frontend to open Razorpay checkout
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("razorpayOrderId", razorpayOrderId);
        response.put("razorpayKeyId", razorpayKeyId);
        response.put("amount", total.multiply(BigDecimal.valueOf(100)).longValue()); // paise
        response.put("currency", "INR");
        response.put("orderNumber", orderNumber);
        response.put("customerName", user.getFullName());
        response.put("customerEmail", user.getEmail());
        response.put("customerPhone", user.getPhoneNumber());
        return response;
    }

    /**
     * STEP 2: After payment, verify Razorpay signature and mark order as PAID.
     */
    @Override
    @Transactional
    public OrderResponse verifyPaymentAndPlaceOrder(String userEmail, PaymentVerifyRequest request) {
        Order order = orderRepository.findByRazorpayOrderId(request.getRazorpayOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found for Razorpay order: "
                        + request.getRazorpayOrderId()));

        // Verify HMAC-SHA256 signature
        boolean isValid = verifyRazorpaySignature(
                request.getRazorpayOrderId(),
                request.getRazorpayPaymentId(),
                request.getRazorpaySignature());

        System.out.println("valid : "+ isValid);
        if (isValid) {
            order.setRazorpayPaymentId(request.getRazorpayPaymentId());
            order.setPaymentStatus(Order.PaymentStatus.PAID);
            order.setOrderStatus(Order.OrderStatus.CONFIRMED);
        } else {
            order.setPaymentStatus(Order.PaymentStatus.FAILED);
            order.setOrderStatus(Order.OrderStatus.CANCELLED);
            // Restore stock on payment failure
            restoreStock(order);
        }

        orderRepository.save(order);

        // Clear user's cart after successful order
        if (isValid) {
            cartRepository.findByUserId(order.getUser().getId())
                    .ifPresent(cart -> {
                        cart.getCartItems().clear();
                        cartItemRepository.deleteByCartId(cart.getId());
                    });
        }

        return mapToOrderResponse(order);
    }

    @Override
    public List<OrderResponse> getMyOrders(String userEmail) {
        User user = findUser(userEmail);
        return orderRepository.findByUserIdOrderByPlacedAtDesc(user.getId())
                .stream().map(this::mapToOrderResponse).collect(Collectors.toList());
    }

    @Override
    public OrderResponse getOrderById(Long orderId, String userEmail) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", orderId));
        return mapToOrderResponse(order);
    }

    @Override
    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAllByOrderByPlacedAtDesc(
                org.springframework.data.domain.Pageable.unpaged())
                .getContent()
                .stream().map(this::mapToOrderResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", orderId));
        try {
            order.setOrderStatus(Order.OrderStatus.valueOf(status.toUpperCase()));
            if (status.equalsIgnoreCase("DELIVERED")) {
                order.setDeliveredAt(LocalDateTime.now());
            }
        } catch (IllegalArgumentException e) {
            throw new BusinessException("Invalid order status: " + status);
        }
        return mapToOrderResponse(orderRepository.save(order));
    }

    // ---- Private Helpers ----

    private User findUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
    }

    private String generateOrderNumber() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        return "SN-" + timestamp + "-" + (int)(Math.random() * 9000 + 1000);
    }

    private String buildShippingAddressJson(OrderRequest req) {
        try {
            Map<String, String> addr = new LinkedHashMap<>();
            addr.put("fullName", req.getFullName());
            addr.put("addressLine", req.getAddressLine());
            addr.put("city", req.getCity());
            addr.put("state", req.getState());
            addr.put("pincode", req.getPincode());
            addr.put("phone", req.getPhone());
            return new ObjectMapper().writeValueAsString(addr);
        } catch (Exception e) {
            return "{}";
        }
    }

    /**
     * Verify Razorpay payment signature using HMAC-SHA256
     * Signature = HMAC_SHA256(razorpayOrderId + "|" + razorpayPaymentId, secret)
     */
    private boolean verifyRazorpaySignature(String orderId, String paymentId, String signature) {
        try {
            String payload = orderId + "|" + paymentId;
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(razorpayKeySecret.getBytes(), "HmacSHA256");
            mac.init(secretKey);
            byte[] hash = mac.doFinal(payload.getBytes());
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString().equals(signature);
        } catch (Exception e) {
            // In demo mode, accept mock signatures
            return signature.startsWith("mock_") || razorpayKeySecret.equals("YOUR_RAZORPAY_KEY_SECRET");
        }
    }

    private void restoreStock(Order order) {
        order.getOrderItems().forEach(item -> {
            Product product = item.getProduct();
            product.setStockQuantity(product.getStockQuantity() + item.getQuantity());
            productRepository.save(product);
        });
    }

    private OrderResponse mapToOrderResponse(Order order) {
        List<OrderItemResponse> items = order.getOrderItems().stream()
                .map(item -> OrderItemResponse.builder()
                        .orderItemId(item.getId())
                        .productId(item.getProduct().getId())
                        .productName(item.getProductName())
                        .productImage(item.getProductImage())
                        .quantity(item.getQuantity())
                        .unitPrice(item.getUnitPrice())
                        .totalPrice(item.getTotalPrice())
                        .build())
                .collect(Collectors.toList());

        return OrderResponse.builder()
                .orderId(order.getId())
                .orderNumber(order.getOrderNumber())
                .orderStatus(order.getOrderStatus().name())
                .paymentStatus(order.getPaymentStatus().name())
                .totalAmount(order.getTotalAmount())
                .shippingAmount(order.getShippingAmount())
                .shippingAddress(order.getShippingAddress())
                .razorpayOrderId(order.getRazorpayOrderId())
                .razorpayPaymentId(order.getRazorpayPaymentId())
                .items(items)
                .placedAt(order.getPlacedAt())
                .deliveredAt(order.getDeliveredAt())
                .build();
    }
}
