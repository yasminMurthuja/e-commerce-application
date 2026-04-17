package com.yash.QuickCart.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Product Entity - Represents a product in the catalog
 */
@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @NotBlank
        @Column(nullable = false)
        private String name;

        @Column(columnDefinition = "TEXT")
        private String description;

        @NotNull
        @DecimalMin(value = "0.0", inclusive = false)
        @Column(nullable = false, precision = 10, scale = 2)
        private BigDecimal price;

        @Column(name = "original_price", precision = 10, scale = 2)
        private BigDecimal originalPrice;  // For showing discount

        @NotNull
        @Min(0)
        @Column(name = "stock_quantity", nullable = false)
        private Integer stockQuantity;

        @NotBlank
        @Column(nullable = false)
        private String category;

        @Column(name = "image_url")
        private String imageUrl;

        @Column
        private String brand;

        @Column
        private Double rating;

        @Column(name = "review_count")
        private Integer reviewCount;

        @Column(name = "is_active")
        private Boolean isActive = true;

        @Column(name = "created_at", updatable = false)
        private LocalDateTime createdAt;

        @Column(name = "updated_at")
        private LocalDateTime updatedAt;

        // One product can be in many order items
        @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
        private List<OrderItem> orderItems;

        // One product can be in many cart items
        @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
        private List<CartItem> cartItems;

        @PrePersist
        protected void onCreate() {
            createdAt = LocalDateTime.now();
            updatedAt = LocalDateTime.now();
            if (isActive == null) isActive = true;
            if (rating == null) rating = 0.0;
            if (reviewCount == null) reviewCount = 0;
        }

        @PreUpdate
        protected void onUpdate() {
            updatedAt = LocalDateTime.now();
        }

}
