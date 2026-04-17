package com.yash.QuickCart.repository;

import com.yash.QuickCart.models.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    // Get all orders for a specific user
    List<Order> findByUserIdOrderByPlacedAtDesc(Long userId);

    // Get paginated orders for admin
    Page<Order> findAllByOrderByPlacedAtDesc(Pageable pageable);

    // Find by order number
    Optional<Order> findByOrderNumber(String orderNumber);

    // Find by Razorpay order ID
    Optional<Order> findByRazorpayOrderId(String razorpayOrderId);

    // Admin: Count total orders
    long count();

    // Admin: Sum total revenue from PAID orders
    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.paymentStatus = 'PAID'")
    BigDecimal getTotalRevenue();

    // Admin: Count orders by status
    @Query("SELECT o.orderStatus, COUNT(o) FROM Order o GROUP BY o.orderStatus")
    List<Object[]> countByStatus();
}
