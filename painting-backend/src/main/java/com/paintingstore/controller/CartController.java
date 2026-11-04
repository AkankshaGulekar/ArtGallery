package com.paintingstore.controller;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.paintingstore.dto.CartItemResponse;
import com.paintingstore.service.CartService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    public record QuantityRequest(int quantity) {
    }

    private final CartService cartService;

    @GetMapping
    public List<CartItemResponse> getCart(Authentication authentication) {
        return cartService.getCart(authentication.getName());
    }

    @PostMapping("/{paintingId}")
    public List<CartItemResponse> add(@PathVariable Long paintingId,
                                      Authentication authentication) {
        return cartService.add(authentication.getName(), paintingId);
    }

    @PutMapping("/{paintingId}")
    public List<CartItemResponse> updateQuantity(@PathVariable Long paintingId,
                                                 @RequestBody QuantityRequest request,
                                                 Authentication authentication) {
        return cartService.updateQuantity(
                authentication.getName(), paintingId, request.quantity());
    }

    @DeleteMapping("/{paintingId}")
    public List<CartItemResponse> remove(@PathVariable Long paintingId,
                                         Authentication authentication) {
        return cartService.remove(authentication.getName(), paintingId);
    }
}