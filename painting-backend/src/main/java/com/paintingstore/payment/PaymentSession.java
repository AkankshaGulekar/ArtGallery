package com.paintingstore.payment;

import java.math.BigDecimal;

public record PaymentSession(
        PaymentType type,
        Long orderId,
        String providerOrderId,
        String publicKey,
        BigDecimal amount,
        String currency) {
}