package com.paintingstore.payment;

import java.math.BigDecimal;

public interface PaymentMethod {

    PaymentType type();

    PaymentResult pay(BigDecimal amount, String detail);
}