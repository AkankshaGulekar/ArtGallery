package com.paintingstore.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.paintingstore.entity.Order;
import com.paintingstore.entity.OrderItem;
import com.paintingstore.entity.OrderStatus;

public record OrderResponse(
        Long id,
        BigDecimal total,
        OrderStatus status,
        String shippingAddress,
        String phone,
        LocalDateTime createdAt,
        List<Item> items) {

    public record Item(Long paintingId, String title, BigDecimal price, int quantity) {

        static Item from(OrderItem item) {
            return new Item(
                    item.getPainting().getId(),
                    item.getPainting().getTitle(),
                    item.getPrice(),
                    item.getQuantity());
        }
    }

    public static OrderResponse from(Order order) {
        return new OrderResponse(
                order.getId(),
                order.getTotal(),
                order.getStatus(),
                order.getShippingAddress(),
                order.getPhone(),
                order.getCreatedAt(),
                order.getItems().stream().map(Item::from).toList());
    }
}