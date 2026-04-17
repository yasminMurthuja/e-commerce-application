package com.yash.QuickCart.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {
    private Long orderId;
    private String orderNumber;
    private String orderStatus;
    private String paymentStatus;
    private BigDecimal totalAmount;
    private BigDecimal shippingAmount;
    private String shippingAddress;
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private List<OrderItemResponse> items;
    private LocalDateTime placedAt;
    private LocalDateTime deliveredAt;
}
