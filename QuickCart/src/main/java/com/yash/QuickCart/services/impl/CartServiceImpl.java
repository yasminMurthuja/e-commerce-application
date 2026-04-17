package com.yash.QuickCart.services.impl;

import com.yash.QuickCart.dto.request.CartItemRequest;
import com.yash.QuickCart.dto.response.CartItemResponse;
import com.yash.QuickCart.dto.response.CartResponse;
import com.yash.QuickCart.exception.BusinessException;
import com.yash.QuickCart.exception.ResourceNotFoundException;
import com.yash.QuickCart.models.Cart;
import com.yash.QuickCart.models.CartItem;
import com.yash.QuickCart.models.Product;
import com.yash.QuickCart.models.User;
import com.yash.QuickCart.repository.CartItemRepository;
import com.yash.QuickCart.repository.CartRepository;
import com.yash.QuickCart.repository.ProductRepository;
import com.yash.QuickCart.repository.UserRepository;
import com.yash.QuickCart.services.CartService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * CartServiceImpl - Handles all cart operations
 */
@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private static final BigDecimal FREE_SHIPPING_THRESHOLD = new BigDecimal("499");
    private static final BigDecimal SHIPPING_CHARGE = new BigDecimal("49");

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Override
    public CartResponse getCart(String userEmail) {
        Cart cart = getOrCreateCart(userEmail);
        return buildCartResponse(cart);
    }

    @Override
    @Transactional
    public CartResponse addToCart(String userEmail, CartItemRequest request) {
        Cart cart = getOrCreateCart(userEmail);
        Product product = findProduct(request.getProductId());

        // Validate stock
        if (product.getStockQuantity() < request.getQuantity()) {
            throw new BusinessException("Insufficient stock. Available: " + product.getStockQuantity());
        }

        // Check if product already in cart → update quantity
        Optional<CartItem> existingItem =
                cartItemRepository.findByCartIdAndProductId(cart.getId(), product.getId());

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            int newQty = item.getQuantity() + request.getQuantity();
            if (newQty > product.getStockQuantity()) {
                throw new BusinessException("Cannot add more than available stock: " + product.getStockQuantity());
            }
            item.setQuantity(newQty);
            cartItemRepository.save(item);
        } else {
            // Add new cart item
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(request.getQuantity())
                    .unitPrice(product.getPrice())
                    .build();
            cart.getCartItems().add(newItem);
            cartItemRepository.save(newItem);
        }

        return buildCartResponse(cart);
    }

    @Override
    @Transactional
    public CartResponse updateCartItem(String userEmail, Long cartItemId, Integer quantity) {
        Cart cart = getOrCreateCart(userEmail);
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item", cartItemId));

        // Validate ownership
        if (!item.getCart().getId().equals(cart.getId())) {
            throw new BusinessException("Cart item does not belong to this user");
        }

        if (quantity <= 0) {
            cartItemRepository.delete(item);
        } else {
            if (quantity > item.getProduct().getStockQuantity()) {
                throw new BusinessException("Requested quantity exceeds available stock");
            }
            item.setQuantity(quantity);
            cartItemRepository.save(item);
        }

        // Reload cart
        Cart refreshed = cartRepository.findById(cart.getId()).orElse(cart);
        return buildCartResponse(refreshed);
    }

    @Override
    @Transactional
    public CartResponse removeFromCart(String userEmail, Long cartItemId) {
        Cart cart = getOrCreateCart(userEmail);
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item", cartItemId));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new BusinessException("Cart item does not belong to this user");
        }

        cart.getCartItems().remove(item);
        cartItemRepository.delete(item);

        Cart refreshed = cartRepository.findById(cart.getId()).orElse(cart);
        return buildCartResponse(refreshed);
    }

    @Override
    @Transactional
    public void clearCart(String userEmail) {
        Cart cart = getOrCreateCart(userEmail);
        cart.getCartItems().clear();
        cartItemRepository.deleteByCartId(cart.getId());
    }

    // ---- Private Helpers ----

    private Cart getOrCreateCart(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));

        return cartRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    Cart newCart = Cart.builder().user(user).build();
                    return cartRepository.save(newCart);
                });
    }

    private Product findProduct(Long productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", productId));
    }

    private CartResponse buildCartResponse(Cart cart) {
        List<CartItemResponse> items = cart.getCartItems().stream()
                .map(item -> CartItemResponse.builder()
                        .cartItemId(item.getId())
                        .productId(item.getProduct().getId())
                        .productName(item.getProduct().getName())
                        .productImage(item.getProduct().getImageUrl())
                        .brand(item.getProduct().getBrand())
                        .unitPrice(item.getUnitPrice())
                        .quantity(item.getQuantity())
                        .totalPrice(item.getTotalPrice())
                        .stockQuantity(item.getProduct().getStockQuantity())
                        .build())
                .collect(Collectors.toList());

        BigDecimal subtotal = items.stream()
                .map(CartItemResponse::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal shipping = subtotal.compareTo(FREE_SHIPPING_THRESHOLD) >= 0
                ? BigDecimal.ZERO : SHIPPING_CHARGE;

        return CartResponse.builder()
                .cartId(cart.getId())
                .items(items)
                .subtotal(subtotal)
                .shippingCharge(shipping)
                .totalAmount(subtotal.add(shipping))
                .totalItems(items.stream().mapToInt(CartItemResponse::getQuantity).sum())
                .build();
    }
    
}
