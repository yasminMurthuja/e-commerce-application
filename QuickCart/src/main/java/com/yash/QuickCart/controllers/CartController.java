package com.yash.QuickCart.controllers;

import com.yash.QuickCart.dto.request.CartItemRequest;
import com.yash.QuickCart.dto.response.ApiResponse;
import com.yash.QuickCart.dto.response.CartResponse;
import com.yash.QuickCart.services.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

/**
 * CartController - Manage shopping cart for authenticated users
 * Base URL: /cart
 */
@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    /**
     * GET /cart
     * Get the current user's cart
     */
    @GetMapping
    public ResponseEntity<ApiResponse<CartResponse>> getCart(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                ApiResponse.success(cartService.getCart(userDetails.getUsername())));
    }

    /**
     * POST /cart/add
     * Add a product to cart
     */
    @PostMapping("/add")
    public ResponseEntity<ApiResponse<CartResponse>> addToCart(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CartItemRequest request) {
        return ResponseEntity.ok(
                ApiResponse.success("Item added to cart",
                        cartService.addToCart(userDetails.getUsername(), request)));
    }

    /**
     * PUT /cart/update/{cartItemId}?quantity=3
     * Update quantity of a cart item
     */
    @PutMapping("/update/{cartItemId}")
    public ResponseEntity<ApiResponse<CartResponse>> updateItem(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long cartItemId,
            @RequestParam Integer quantity) {
        return ResponseEntity.ok(
                ApiResponse.success("Cart updated",
                        cartService.updateCartItem(userDetails.getUsername(), cartItemId, quantity)));
    }

    /**
     * DELETE /cart/remove/{cartItemId}
     * Remove a specific item from cart
     */
    @DeleteMapping("/remove/{cartItemId}")
    public ResponseEntity<ApiResponse<CartResponse>> removeItem(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long cartItemId) {
        return ResponseEntity.ok(
                ApiResponse.success("Item removed",
                        cartService.removeFromCart(userDetails.getUsername(), cartItemId)));
    }

    /**
     * DELETE /cart/clear
     * Empty the entire cart
     */
    @DeleteMapping("/clear")
    public ResponseEntity<ApiResponse<String>> clearCart(
            @AuthenticationPrincipal UserDetails userDetails) {
        cartService.clearCart(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Cart cleared", "OK"));
    }
}
