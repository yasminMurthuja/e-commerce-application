package com.yash.QuickCart.services;

import com.yash.QuickCart.dto.request.OrderRequest;
import com.yash.QuickCart.dto.request.PaymentVerifyRequest;
import com.yash.QuickCart.dto.response.OrderResponse;

import java.util.List;
import java.util.Map;

public interface OrderService {
    Map<String, Object> createRazorpayOrder(String userEmail, OrderRequest request);
    OrderResponse verifyPaymentAndPlaceOrder(String userEmail, PaymentVerifyRequest request);
    List<OrderResponse> getMyOrders(String userEmail);
    OrderResponse getOrderById(Long orderId, String userEmail);
    List<OrderResponse> getAllOrders();
    OrderResponse updateOrderStatus(Long orderId, String status);
}
