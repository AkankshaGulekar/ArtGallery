package com.paintingstore.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record PlaceOrderRequest(
        @NotBlank String shippingAddress,
        @NotBlank @Pattern(regexp = "\\d{10}", message = "Phone must be 10 digits") String phone) {
}