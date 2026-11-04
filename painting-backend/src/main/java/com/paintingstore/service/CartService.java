package com.paintingstore.service;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.paintingstore.dto.CartItemResponse;
import com.paintingstore.entity.CartItem;
import com.paintingstore.entity.Painting;
import com.paintingstore.entity.User;
import com.paintingstore.repository.CartItemRepository;
import com.paintingstore.repository.PaintingRepository;
import com.paintingstore.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CartService {

    private static final String ORIGINALS = "Originals";

    private final CartItemRepository cartItemRepository;
    private final PaintingRepository paintingRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<CartItemResponse> getCart(String email) {
        return toResponses(findUser(email));
    }

    @Transactional
    public List<CartItemResponse> add(String email, Long paintingId) {
        User user = findUser(email);
        Painting painting = paintingRepository.findById(paintingId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Painting not found"));

        if (!painting.isAvailable()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Painting is sold");
        }

        Optional<CartItem> existing =
                cartItemRepository.findByUserIdAndPaintingId(user.getId(), paintingId);

        if (existing.isPresent()) {
            if (isOriginal(painting)) {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT, "Already in your cart");
            }
            CartItem item = existing.get();
            item.setQuantity(item.getQuantity() + 1);
        } else {
            CartItem item = new CartItem();
            item.setUser(user);
            item.setPainting(painting);
            item.setQuantity(1);
            cartItemRepository.save(item);
        }
        return toResponses(user);
    }

    @Transactional
    public List<CartItemResponse> updateQuantity(String email, Long paintingId, int quantity) {
        User user = findUser(email);
        CartItem item = findItem(user, paintingId);

        if (isOriginal(item.getPainting())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Originals can only be bought once");
        }
        if (quantity < 1) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Quantity must be at least 1");
        }
        item.setQuantity(quantity);
        return toResponses(user);
    }

    @Transactional
    public List<CartItemResponse> remove(String email, Long paintingId) {
        User user = findUser(email);
        cartItemRepository.delete(findItem(user, paintingId));
        return toResponses(user);
    }

    private User findUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "User not found"));
    }

    private CartItem findItem(User user, Long paintingId) {
        return cartItemRepository.findByUserIdAndPaintingId(user.getId(), paintingId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Not in your cart"));
    }

    private boolean isOriginal(Painting painting) {
        return ORIGINALS.equals(painting.getCategory());
    }

    private List<CartItemResponse> toResponses(User user) {
        return cartItemRepository.findByUserId(user.getId()).stream()
                .map(CartItemResponse::from)
                .toList();
    }
}