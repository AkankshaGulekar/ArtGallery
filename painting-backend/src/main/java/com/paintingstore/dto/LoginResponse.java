package com.paintingstore.dto;

public record LoginResponse(String token, UserResponse user) {
}