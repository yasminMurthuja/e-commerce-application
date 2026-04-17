package com.yash.QuickCart.services.impl;

import com.yash.QuickCart.dto.response.Dashboardstatsresponse;
import com.yash.QuickCart.repository.OrderRepository;
import com.yash.QuickCart.repository.ProductRepository;
import com.yash.QuickCart.repository.UserRepository;
import com.yash.QuickCart.services.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * AdminServiceImpl - Aggregates statistics for the admin dashboard
 */
@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    @Override
    public Dashboardstatsresponse getDashboardStats() {
        // Count totals
        long totalUsers    = userRepository.count();
        long totalProducts = productRepository.count();
        long totalOrders   = orderRepository.count();
        var  totalRevenue  = orderRepository.getTotalRevenue();

        // Orders grouped by status
        Map<String, Long> ordersByStatus = new HashMap<>();
        List<Object[]> statusRows = orderRepository.countByStatus();
        for (Object[] row : statusRows) {
            ordersByStatus.put(row[0].toString(), (Long) row[1]);
        }

        // Products grouped by category
        Map<String, Long> productsByCategory = new HashMap<>();
        List<Object[]> categoryRows = productRepository.countByCategory();
        for (Object[] row : categoryRows) {
            productsByCategory.put(row[0].toString(), (Long) row[1]);
        }

        long pendingOrders = ordersByStatus.getOrDefault("PENDING", 0L);

        return Dashboardstatsresponse.builder()
                .totalUsers(totalUsers)
                .totalProducts(totalProducts)
                .totalOrders(totalOrders)
                .totalRevenue(totalRevenue)
                .ordersByStatus(ordersByStatus)
                .productsByCategory(productsByCategory)
                .pendingOrders(pendingOrders)
                .build();
    }
}
