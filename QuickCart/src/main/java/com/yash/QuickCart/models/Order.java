package com.yash.QuickCart.models;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Order Entity - Represents a placed order
 */
@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        // Unique order reference number (e.g., SN-20240101-001)
        @Column(name = "order_number", unique = true, nullable = false)
        private String orderNumber;

        // User who placed the order
        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "user_id", nullable = false)
        private User user;

        // Items in this order
        @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
        @Builder.Default
        private List<OrderItem> orderItems = new ArrayList<>();

        @Enumerated(EnumType.STRING)
        @Column(name = "order_status", nullable = false)
        private OrderStatus orderStatus;

        @Enumerated(EnumType.STRING)
        @Column(name = "payment_status", nullable = false)
        private PaymentStatus paymentStatus;

        // Razorpay order and payment IDs
        @Column(name = "razorpay_order_id")
        private String razorpayOrderId;

        @Column(name = "razorpay_payment_id")
        private String razorpayPaymentId;

        @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
        private BigDecimal totalAmount;

        @Column(name = "discount_amount", precision = 10, scale = 2)
        private BigDecimal discountAmount;

        @Column(name = "shipping_amount", precision = 10, scale = 2)
        private BigDecimal shippingAmount;

        // Shipping address (stored as JSON string for simplicity)
        @Column(name = "shipping_address", columnDefinition = "TEXT")
        private String shippingAddress;

        @Column(name = "placed_at")
        private LocalDateTime placedAt;

        @Column(name = "delivered_at")
        private LocalDateTime deliveredAt;

        @Column(name = "updated_at")
        private LocalDateTime updatedAt;

        @PrePersist
        protected void onCreate() {
            placedAt = LocalDateTime.now();
            updatedAt = LocalDateTime.now();
        }

        @PreUpdate
        protected void onUpdate() {
            updatedAt = LocalDateTime.now();
        }

        // ---- Enums ----

        public enum OrderStatus {
            PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED
        }

        public enum PaymentStatus {
            PENDING, PAID, FAILED, REFUNDED
        }

}
