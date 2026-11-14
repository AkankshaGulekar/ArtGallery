package com.paintingstore.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.paintingstore.dto.OrderResponse;
import com.paintingstore.dto.PlaceOrderRequest;
import com.paintingstore.entity.CartItem;
import com.paintingstore.entity.Order;
import com.paintingstore.entity.OrderItem;
import com.paintingstore.entity.Painting;
import com.paintingstore.entity.User;
import com.paintingstore.repository.CartItemRepository;
import com.paintingstore.repository.OrderRepository;
import com.paintingstore.repository.PaintingRepository;
import com.paintingstore.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderService {

    private static final String ORIGINALS = "Originals";

    private final OrderRepository orderRepository;
    private final CartItemRepository cartItemRepository;
    private final PaintingRepository paintingRepository;
    private final UserRepository userRepository;

    @Transactional
    public OrderResponse placeOrder(String email, PlaceOrderRequest request) {
        User user = findUser(email);
        List<CartItem> cartItems = cartItemRepository.findByUserId(user.getId());

        if (cartItems.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Your cart is empty");
        }

        Order order = new Order();
        order.setUser(user);
        order.setShippingAddress(request.shippingAddress());
        order.setPhone(request.phone());

        for (CartItem cartItem : cartItems) {
            Painting painting = paintingRepository
                    .findByIdForUpdate(cartItem.getPainting().getId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND, "Painting not found"));

            if (!painting.isAvailable()) {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT, painting.getTitle() + " is sold");
            }

            OrderItem item = new OrderItem();
            item.setPainting(painting);
            item.setQuantity(cartItem.getQuantity());
            item.setPrice(painting.getPrice());
            order.addItem(item);

            if (ORIGINALS.equals(painting.getCategory())) {
                painting.setAvailable(false);
            }
        }

        orderRepository.save(order);
        cartItemRepository.deleteAll(cartItems);
        return OrderResponse.from(order);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getOrders(String email) {
        User user = findUser(email);
        return orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(OrderResponse::from)
                .toList();
    }

    private User findUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "User not found"));
    }
}