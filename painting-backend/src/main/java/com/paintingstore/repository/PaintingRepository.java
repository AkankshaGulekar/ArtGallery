package com.paintingstore.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.paintingstore.entity.Painting;

import jakarta.persistence.LockModeType;

public interface PaintingRepository extends JpaRepository<Painting, Long> {

    @Query("""
            SELECT p FROM Painting p
            WHERE (:search IS NULL OR LOWER(p.title) LIKE LOWER(CONCAT('%', :search, '%')))
              AND (:category IS NULL OR p.category = :category)
            """)
    List<Painting> filter(@Param("search") String search,
                          @Param("category") String category);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT p FROM Painting p WHERE p.id = :id")
    Optional<Painting> findByIdForUpdate(@Param("id") Long id);
}