package com.yash.QuickCart.services;

import com.yash.QuickCart.dto.request.ProductRequest;
import com.yash.QuickCart.dto.response.ProductResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;

public interface ProductService {
    ProductResponse createProduct(ProductRequest request);
    ProductResponse updateProduct(Long id, ProductRequest request);
    ProductResponse getProductById(Long id);
    Page<ProductResponse> getAllProducts(Pageable pageable);
    Page<ProductResponse> getProductsByCategory(String category, Pageable pageable);
    Page<ProductResponse> searchProducts(String keyword, Pageable pageable);
    Page<ProductResponse> filterByPriceRange(BigDecimal min, BigDecimal max, Pageable pageable);
    List<String> getAllCategories();
    void deleteProduct(Long id);

}
