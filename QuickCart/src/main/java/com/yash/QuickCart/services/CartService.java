package com.yash.QuickCart.services;

import com.yash.QuickCart.dto.request.CartItemRequest;
import com.yash.QuickCart.dto.response.CartResponse;

public interface CartService {
    CartResponse getCart(String userEmail);
    CartResponse addToCart(String userEmail, CartItemRequest request);
    CartResponse updateCartItem(String userEmail, Long cartItemId, Integer quantity);
    CartResponse removeFromCart(String userEmail, Long cartItemId);
    void clearCart(String userEmail);

}
