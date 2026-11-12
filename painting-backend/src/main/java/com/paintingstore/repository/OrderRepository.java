package com.paintingstore.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.paintingstore.entity.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);
}