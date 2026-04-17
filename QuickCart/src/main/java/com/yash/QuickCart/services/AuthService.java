package com.yash.QuickCart.services;

import com.yash.QuickCart.dto.request.LoginRequest;
import com.yash.QuickCart.dto.request.RegisterRequest;
import com.yash.QuickCart.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);

}
