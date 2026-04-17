package com.yash.QuickCart.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartItemResponse {
      private Long cartItemId;
      private Long productId;
      private String productName;
      private String productImage;
      private String brand;
      private BigDecimal unitPrice;
      private Integer quantity;
      private BigDecimal totalPrice;
      private Integer stockQuantity;

}
