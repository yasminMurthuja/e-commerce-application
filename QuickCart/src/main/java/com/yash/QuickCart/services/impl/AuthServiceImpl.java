package com.yash.QuickCart.services.impl;

import com.yash.QuickCart.dto.request.LoginRequest;
import com.yash.QuickCart.dto.request.RegisterRequest;
import com.yash.QuickCart.dto.response.AuthResponse;
import com.yash.QuickCart.exception.BusinessException;
import com.yash.QuickCart.models.User;
import com.yash.QuickCart.repository.UserRepository;
import com.yash.QuickCart.security.CustomUserDetailsService;
import com.yash.QuickCart.security.JwtUtil;
import com.yash.QuickCart.services.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * AuthServiceImpl - Business logic for registration and login
 */
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService customUserDetailsService;

    /**
     * Register a new customer
     */
    @Override
    public AuthResponse register(RegisterRequest request) {
        // Check if email is already taken
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("Email is already registered: " + request.getEmail());
        }

        User.Role role = User.Role.CUSTOMER;

        if (request.getRole() != null &&
                request.getRole().equalsIgnoreCase("ADMIN")) {

            // Optional: add extra security check here
            role = User.Role.ADMIN;
        }

        // Build and save new user
        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phoneNumber(request.getPhoneNumber())
                .role(role)
                .build();

        userRepository.save(user);

        // Generate JWT token
        UserDetails userDetails = customUserDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtUtil.generateToken(userDetails);

        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .userId(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }

    /**
     * Authenticate an existing user and return JWT
     */
    @Override
        public AuthResponse login(LoginRequest request) {
        // Spring Security validates credentials
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        // Fetch user from database
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BusinessException("User not found"));

        // Generate JWT token
        UserDetails userDetails = customUserDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtUtil.generateToken(userDetails);

        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .userId(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }

}
