package com.yash.QuickCart.controllers;

import com.yash.QuickCart.dto.request.OrderRequest;
import com.yash.QuickCart.dto.request.PaymentVerifyRequest;
import com.yash.QuickCart.dto.response.ApiResponse;
import com.yash.QuickCart.dto.response.OrderResponse;
import com.yash.QuickCart.services.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * OrderController - Order placement and tracking for authenticated users
 * Base URL: /orders
 */
@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    /**
     * POST /orders/create
     * Step 1: Create a Razorpay order — returns razorpayOrderId + amount for frontend checkout
     */
    @PostMapping("/create")
    public ResponseEntity<ApiResponse<Map<String, Object>>> createOrder(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody OrderRequest request) {
            Map<String, Object> data = orderService.createRazorpayOrder(userDetails.getUsername(), request);
            return ResponseEntity.ok(ApiResponse.success("Order created. Proceed to payment.", data));
    }

    /**
     * POST /orders/verify-payment
     * Step 2: Verify Razorpay payment signature and finalize the order
     */
    @PostMapping("/verify-payment")
    public ResponseEntity<ApiResponse<OrderResponse>> verifyPayment(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody PaymentVerifyRequest request) {
        OrderResponse order = orderService.verifyPaymentAndPlaceOrder(
                userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success("Payment verified. Order placed!", order));
    }

    /**
     * GET /orders/my-orders
     * Get all orders for the logged-in user
     */
    @GetMapping("/my-orders")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getMyOrders(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                ApiResponse.success(orderService.getMyOrders(userDetails.getUsername())));
    }

    /**
     * GET /orders/{id}
     * Get a specific order by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderById(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        return ResponseEntity.ok(
                ApiResponse.success(orderService.getOrderById(id, userDetails.getUsername())));

    }
}
