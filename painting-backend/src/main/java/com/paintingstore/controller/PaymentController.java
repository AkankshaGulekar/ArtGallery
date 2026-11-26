package com.paintingstore.controller;

import java.util.Map;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.paintingstore.dto.OrderResponse;
import com.paintingstore.payment.PaymentService;
import com.paintingstore.payment.PaymentSession;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/{orderId}/start")
    public PaymentSession start(@PathVariable Long orderId, Authentication authentication) {
        return paymentService.start(authentication.getName(), orderId);
    }

    @PostMapping("/{orderId}/confirm")
    public OrderResponse confirm(@PathVariable Long orderId,
                                 @RequestBody Map<String, String> data,
                                 Authentication authentication) {
        return paymentService.confirm(authentication.getName(), orderId, data);
    }
}