package com.paintingstore.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.paintingstore.entity.Painting;

public interface PaintingRepository extends JpaRepository<Painting, Long> {

    @Query("""
            SELECT p FROM Painting p
            WHERE (:search IS NULL OR LOWER(p.title) LIKE LOWER(CONCAT('%', :search, '%')))
              AND (:category IS NULL OR p.category = :category)
            """)
    List<Painting> filter(@Param("search") String search,
                          @Param("category") String category);
}