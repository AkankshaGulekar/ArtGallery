package com.paintingstore.payment;

import java.util.EnumMap;
import java.util.Map;

import org.springframework.beans.factory.ObjectProvider;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.paintingstore.entity.Order;

@Service
public class PaymentService {

    private static final String INDIA = "India";

    private final Map<PaymentType, PaymentMethod> methods = new EnumMap<>(PaymentType.class);

    public PaymentService(ObjectProvider<PaymentMethod> paymentMethods) {
        for (PaymentMethod method : paymentMethods) {
            methods.put(method.type(), method);
        }
    }

    public PaymentMethod methodFor(Order order) {
        PaymentType type = INDIA.equalsIgnoreCase(order.getCountry())
                ? PaymentType.UPI
                : PaymentType.PAYPAL;

        PaymentMethod method = methods.get(type);
        if (method == null) {
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE, "This payment method is not available yet");
        }
        return method;
    }
}