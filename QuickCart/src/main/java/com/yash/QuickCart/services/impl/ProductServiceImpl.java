package com.yash.QuickCart.services.impl;

import com.yash.QuickCart.dto.request.ProductRequest;
import com.yash.QuickCart.dto.response.ProductResponse;
import com.yash.QuickCart.exception.ResourceNotFoundException;
import com.yash.QuickCart.models.Product;
import com.yash.QuickCart.repository.ProductRepository;
import com.yash.QuickCart.services.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

/**
 * ProductServiceImpl - Business logic for product catalog management
 */
@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    @Override
    public ProductResponse createProduct(ProductRequest request) {
        Product product = buildProductFromRequest(new Product(), request);
        Product saved = productRepository.save(product);
        return mapToResponse(saved);
    }

    @Override
    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = findProductById(id);
        buildProductFromRequest(product, request);
        Product updated = productRepository.save(product);
        return mapToResponse(updated);
    }

    @Override
    public ProductResponse getProductById(Long id) {
        return mapToResponse(findProductById(id));
    }

    @Override
    public Page<ProductResponse> getAllProducts(Pageable pageable) {
        return productRepository.findByIsActiveTrue(pageable).map(this::mapToResponse);
    }

    @Override
    public Page<ProductResponse> getProductsByCategory(String category, Pageable pageable) {
        return productRepository.findByCategoryAndIsActiveTrue(category, pageable).map(this::mapToResponse);
    }

    @Override
    public Page<ProductResponse> searchProducts(String keyword, Pageable pageable) {
        return productRepository.searchProducts(keyword, pageable).map(this::mapToResponse);
    }

    @Override
    public Page<ProductResponse> filterByPriceRange(BigDecimal min, BigDecimal max, Pageable pageable) {
        return productRepository.findByPriceBetween(min, max, pageable).map(this::mapToResponse);
    }

    @Override
    public List<String> getAllCategories() {
        return productRepository.findAllCategories();
    }

    @Override
    public void deleteProduct(Long id) {
        Product product = findProductById(id);
        // Soft delete - just mark as inactive
        product.setIsActive(false);
        productRepository.save(product);
    }

    // ---- Private Helper Methods ----
    private Product findProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", id));
    }

    private Product buildProductFromRequest(Product product, ProductRequest request) {
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setOriginalPrice(request.getOriginalPrice());
        product.setStockQuantity(request.getStockQuantity());
        product.setCategory(request.getCategory());
        product.setImageUrl(request.getImageUrl());
        product.setBrand(request.getBrand());
        return product;
    }

    /**
     * Map Product entity to ProductResponse DTO
     */
    public ProductResponse mapToResponse(Product product) {
        Integer discountPercent = null;
        if (product.getOriginalPrice() != null && product.getOriginalPrice().compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal discount = product.getOriginalPrice().subtract(product.getPrice());
            discountPercent = discount.divide(product.getOriginalPrice(), 2, java.math.RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100)).intValue();
        }

        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .originalPrice(product.getOriginalPrice())
                .stockQuantity(product.getStockQuantity())
                .category(product.getCategory())
                .imageUrl(product.getImageUrl())
                .brand(product.getBrand())
                .rating(product.getRating())
                .reviewCount(product.getReviewCount())
                .isActive(product.getIsActive())
                .discountPercent(discountPercent)
                .createdAt(product.getCreatedAt())
                .build();
        }
}
