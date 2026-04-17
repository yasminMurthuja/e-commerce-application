package com.yash.QuickCart.controllers;

import com.yash.QuickCart.dto.request.ProductRequest;
import com.yash.QuickCart.dto.response.ApiResponse;
import com.yash.QuickCart.dto.response.Dashboardstatsresponse;
import com.yash.QuickCart.dto.response.OrderResponse;
import com.yash.QuickCart.dto.response.ProductResponse;
import com.yash.QuickCart.services.AdminService;
import com.yash.QuickCart.services.OrderService;
import com.yash.QuickCart.services.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * AdminController - Admin-only endpoints for product & order management
 * Base URL: /admin
 * Access: ADMIN role only (enforced by SecurityConfig + @PreAuthorize)
 */
@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final ProductService productService;
    private final OrderService orderService;
    private final AdminService adminService;

    // ===================== DASHBOARD =====================

    /**
     * GET /admin/dashboard
     * Get summary stats: total users, orders, revenue, etc.
     */
    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<Dashboardstatsresponse>> getDashboard() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getDashboardStats()));
    }

    // ===================== PRODUCTS =====================

    /**
     * POST /admin/products
     * Create a new product
     */
    @PostMapping("/products")
    public ResponseEntity<ApiResponse<ProductResponse>> createProduct(
            @Valid @RequestBody ProductRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Product created", productService.createProduct(request)));
    }

    /**
     * PUT /admin/products/{id}
     * Update an existing product
     */
    @PutMapping("/products/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequest request) {
        return ResponseEntity.ok(
                ApiResponse.success("Product updated", productService.updateProduct(id, request)));
    }

    /**
     * DELETE /admin/products/{id}
     * Soft delete a product (marks isActive = false)
     */
    @DeleteMapping("/products/{id}")
    public ResponseEntity<ApiResponse<String>> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(ApiResponse.success("Product deleted", "OK"));
    }

    // ===================== ORDERS =====================

    /**
     * GET /admin/orders
     * Get all orders (paginated)
     */
    @GetMapping("/orders")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getAllOrders() {
        return ResponseEntity.ok(ApiResponse.success(orderService.getAllOrders()));
    }

    /**
     * PATCH /admin/orders/{id}/status?status=SHIPPED
     * Update order status (PENDING → CONFIRMED → SHIPPED → DELIVERED)
     */
    @PatchMapping("/orders/{id}/status")
    public ResponseEntity<ApiResponse<OrderResponse>> updateOrderStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        return ResponseEntity.ok(
                ApiResponse.success("Order status updated",
                        orderService.updateOrderStatus(id, status)));
    }

}
