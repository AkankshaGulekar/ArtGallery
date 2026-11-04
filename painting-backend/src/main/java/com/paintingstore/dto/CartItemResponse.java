package com.paintingstore.dto;

import java.math.BigDecimal;

import com.paintingstore.entity.CartItem;
import com.paintingstore.entity.Painting;

public record CartItemResponse(
        Long id,
        Long paintingId,
        String title,
        String imageUrl,
        BigDecimal price,
        String category,
        int quantity) {

    public static CartItemResponse from(CartItem item) {
        Painting painting = item.getPainting();
        return new CartItemResponse(
                item.getId(),
                painting.getId(),
                painting.getTitle(),
                painting.getImageUrl(),
                painting.getPrice(),
                painting.getCategory(),
                item.getQuantity());
    }
}