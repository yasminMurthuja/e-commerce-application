package com.yash.QuickCart.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

/**
 * DTO returned when fetching cart contents
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartResponse {
     private Long cartId;
     private List<CartItemResponse> items;
     private BigDecimal subtotal;
     private BigDecimal shippingCharge;
     private BigDecimal totalAmount;
     private Integer totalItems;

}

