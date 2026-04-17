package com.yash.QuickCart.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO returned when fetching product details
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {

    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private BigDecimal originalPrice;
    private Integer stockQuantity;
    private String category;
    private String imageUrl;
    private String brand;
    private Double rating;
    private Integer reviewCount;
    private Boolean isActive;
    private Integer discountPercent;
    private LocalDateTime createdAt;

}
