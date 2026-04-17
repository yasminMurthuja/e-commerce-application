package com.yash.QuickCart.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * DTO for placing an order
 */
@Data
public class OrderRequest {

    @NotBlank(message = "Shipping address is required")
    private String fullName;

    @NotBlank(message = "Address line is required")
    private String addressLine;

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "State is required")
    private String state;

    @NotBlank(message = "Pincode is required")
    private String pincode;

    @NotBlank(message = "Phone is required")
    private String phone;

}
