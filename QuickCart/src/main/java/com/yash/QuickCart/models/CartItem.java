package com.yash.QuickCart.models;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

/**
 * CartItem Entity - Represents a single product entry in a cart
 */
@Entity
@Table(name = "cart_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItem {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        // Which cart this item belongs to
        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "cart_id", nullable = false)
        private Cart cart;

        // Which product this item represents
        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "product_id", nullable = false)
        private Product product;

        @Column(nullable = false)
        private Integer quantity;

        // Price captured at time of adding to cart
        @Column(name = "unit_price", nullable = false, precision = 10, scale = 2)
        private BigDecimal unitPrice;

        /**
         * Calculates total price for this item (unitPrice * quantity)
         */
        public BigDecimal getTotalPrice() {
            return unitPrice.multiply(BigDecimal.valueOf(quantity));
        }

}
