package com.paintingstore.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record PlaceOrderRequest(
        @NotBlank @Size(max = 300) String addressLine,
        @NotBlank @Size(max = 100) String city,
        @Size(max = 100) String state,
        @NotBlank @Pattern(regexp = "[A-Za-z0-9][A-Za-z0-9 \\-]{2,10}",
                message = "Enter a valid postal code") String postalCode,
        @NotBlank @Size(max = 100) String country,
        @NotBlank @Pattern(regexp = "\\+[1-9]\\d{6,14}",
                message = "Phone must include the country code, like +14155552671") String phone) {
}