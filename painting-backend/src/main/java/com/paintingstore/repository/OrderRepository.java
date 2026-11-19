package com.paintingstore.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.paintingstore.entity.Order;
import com.paintingstore.entity.OrderStatus;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUserIdAndStatusNotOrderByCreatedAtDesc(Long userId, OrderStatus status);
}