package com.yash.QuickCart.models;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

/**
 * OrderItem Entity - Represents a single product in an order (snapshot of product at order time)
 */
@Entity
@Table(name = "order_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "order_id", nullable = false)
        private Order order;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "product_id", nullable = false)
        private Product product;

        // Snapshot of product name at order time (in case product is later deleted)
        @Column(name = "product_name", nullable = false)
        private String productName;

        @Column(name = "product_image")
        private String productImage;

        @Column(nullable = false)
        private Integer quantity;

        @Column(name = "unit_price", nullable = false, precision = 10, scale = 2)
        private BigDecimal unitPrice;

        /**
         * Returns total price = unitPrice * quantity
         */
        public BigDecimal getTotalPrice() {
            return unitPrice.multiply(BigDecimal.valueOf(quantity));
        }

}
