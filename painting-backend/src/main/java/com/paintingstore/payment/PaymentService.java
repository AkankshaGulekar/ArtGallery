package com.paintingstore.payment;

import java.math.BigDecimal;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class PaymentService {

    private final Map<PaymentType, PaymentMethod> methods = new EnumMap<>(PaymentType.class);

    public PaymentService(List<PaymentMethod> paymentMethods) {
        for (PaymentMethod method : paymentMethods) {
            methods.put(method.type(), method);
        }
    }

    public PaymentResult pay(PaymentType type, BigDecimal amount, String detail) {
        PaymentMethod method = methods.get(type);
        if (method == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Unsupported payment type");
        }

        PaymentResult result = method.pay(amount, detail);
        if (!result.success()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, result.message());
        }
        return result;
    }
}