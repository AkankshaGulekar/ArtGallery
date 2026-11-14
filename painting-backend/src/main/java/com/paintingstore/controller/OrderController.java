package com.paintingstore.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.paintingstore.dto.OrderResponse;
import com.paintingstore.dto.PlaceOrderRequest;
import com.paintingstore.service.OrderService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponse placeOrder(@Valid @RequestBody PlaceOrderRequest request,
                                    Authentication authentication) {
        return orderService.placeOrder(authentication.getName(), request);
    }

    @GetMapping
    public List<OrderResponse> getOrders(Authentication authentication) {
        return orderService.getOrders(authentication.getName());
    }
}