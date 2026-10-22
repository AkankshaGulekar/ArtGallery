package com.paintingstore.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.paintingstore.entity.Painting;

public interface PaintingRepository extends JpaRepository<Painting, Long> {
}