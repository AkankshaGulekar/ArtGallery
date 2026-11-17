package com.paintingstore.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record PlaceOrderRequest(
        @NotBlank @Size(max = 300) String addressLine,
        @NotBlank @Size(max = 100) String city,
        @NotBlank @Size(max = 100) String state,
        @NotBlank @Pattern(regexp = "[1-9]\\d{5}", message = "Pincode must be 6 digits") String pincode,
        @NotBlank @Pattern(regexp = "\\d{10}", message = "Phone must be 10 digits") String phone) {
}