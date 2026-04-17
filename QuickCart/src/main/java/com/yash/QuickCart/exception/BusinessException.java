package com.yash.QuickCart.exception;

/**
 * BusinessException - Thrown for business rule violations (400)
 * e.g., insufficient stock, duplicate email, etc.
 */
public class BusinessException extends RuntimeException {
    public BusinessException(String message) {
        super(message);
    }
}
