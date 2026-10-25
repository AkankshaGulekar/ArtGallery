package com.paintingstore.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.paintingstore.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
}