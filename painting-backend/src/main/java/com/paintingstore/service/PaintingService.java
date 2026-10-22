package com.paintingstore.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.paintingstore.entity.Painting;
import com.paintingstore.repository.PaintingRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaintingService {

    private final PaintingRepository paintingRepository;

    public List<Painting> getAll(String search, String category) {
        return paintingRepository.filter(blankToNull(search), blankToNull(category));
    }

    private String blankToNull(String value) {
        return (value == null || value.isBlank()) ? null : value.trim();
    }

    public Painting getById(Long id) {
        return paintingRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Painting not found"));
    }

    public Painting create(Painting painting) {
        return paintingRepository.save(painting);
    }

    public Painting update(Long id, Painting updated) {
        Painting existing = getById(id);
        existing.setTitle(updated.getTitle());
        existing.setDescription(updated.getDescription());
        existing.setPrice(updated.getPrice());
        existing.setCategory(updated.getCategory());
        existing.setImageUrl(updated.getImageUrl());
        existing.setAvailable(updated.isAvailable());
        return paintingRepository.save(existing);
    }
    
    
    public void delete(Long id) {
        getById(id);
        paintingRepository.deleteById(id);
    }
}