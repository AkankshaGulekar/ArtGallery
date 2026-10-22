package com.paintingstore.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.paintingstore.entity.Painting;
import com.paintingstore.service.PaintingService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/paintings")
@RequiredArgsConstructor
public class PaintingController {

    private final PaintingService paintingService;

    @GetMapping
    public List<Painting> getAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category) {
        return paintingService.getAll(search, category);
    }

    @GetMapping("/{id}")
    public Painting getById(@PathVariable Long id) {
        return paintingService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Painting create(@RequestBody Painting painting) {
        return paintingService.create(painting);
    }

    @PutMapping("/{id}")
    public Painting update(@PathVariable Long id, @RequestBody Painting painting) {
        return paintingService.update(id, painting);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        paintingService.delete(id);
    }
}