package com.yash.QuickCart.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Map;

/**
 * DTO for admin dashboard statistics
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Dashboardstatsresponse {
      private Long totalUsers;
      private Long totalProducts;
      private Long totalOrders;
      private BigDecimal totalRevenue;
      private Map<String, Long> ordersByStatus;
      private Map<String, Long> productsByCategory;
      private Long pendingOrders;
}
