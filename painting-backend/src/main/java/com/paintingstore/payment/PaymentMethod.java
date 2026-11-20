package com.paintingstore.payment;

import java.util.Map;

import com.paintingstore.entity.Order;

public interface PaymentMethod {

    PaymentType type();

    PaymentSession start(Order order);

    String confirm(Order order, Map<String, String> data);
}