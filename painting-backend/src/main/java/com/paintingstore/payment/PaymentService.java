package com.paintingstore.payment;

import java.util.EnumMap;
import java.util.Map;

import org.springframework.beans.factory.ObjectProvider;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.paintingstore.dto.OrderResponse;
import com.paintingstore.entity.Order;
import com.paintingstore.entity.OrderItem;
import com.paintingstore.entity.OrderStatus;
import com.paintingstore.repository.OrderRepository;
import com.paintingstore.service.OrderService;

@Service
public class PaymentService {

    private static final String INDIA = "India";

    private final Map<PaymentType, PaymentMethod> methods = new EnumMap<>(PaymentType.class);
    private final OrderRepository orderRepository;
    private final OrderService orderService;

    public PaymentService(ObjectProvider<PaymentMethod> paymentMethods,
                          OrderRepository orderRepository,
                          OrderService orderService) {
        for (PaymentMethod method : paymentMethods) {
            methods.put(method.type(), method);
        }
        this.orderRepository = orderRepository;
        this.orderService = orderService;
    }

    @Transactional
    public PaymentSession start(String email, Long orderId) {
        Order order = findOwnOrder(email, orderId);

        if (order.getStatus() != OrderStatus.PENDING_PAYMENT) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Order is already paid");
        }
        for (OrderItem item : order.getItems()) {
            if (!item.getPainting().isAvailable()) {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT, item.getPainting().getTitle() + " is sold");
            }
        }
        return methodFor(order).start(order);
    }

    @Transactional
    public OrderResponse confirm(String email, Long orderId, Map<String, String> data) {
        Order order = findOwnOrder(email, orderId);
        PaymentMethod method = methodFor(order);
        String reference = method.confirm(order, data);
        return orderService.confirmPayment(email, orderId, method.type(), reference);
    }

    private Order findOwnOrder(String email, Long orderId) {
        return orderRepository.findById(orderId)
                .filter(o -> o.getUser().getEmail().equals(email))
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Order not found"));
    }

    private PaymentMethod methodFor(Order order) {
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