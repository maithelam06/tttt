package com.example.bewebsslock.controller;

import com.example.bewebsslock.dto.request.CategoryRequest;
import com.example.bewebsslock.entity.Category;
import com.example.bewebsslock.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {
	private final CategoryService service;
	public CategoryController(CategoryService service) {
		this.service = service;
	}
	@GetMapping
	public List<Category> findAll() {
		return service.findAll();
	}
	@GetMapping("/{id}")
	public Category findOne(@PathVariable Long id) {
		return service.findOne(id);
	}
	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public Category create(@Valid @RequestBody CategoryRequest r) {
		return service.create(r);
	}
	@PutMapping("/{id}")
	public Category update(@PathVariable Long id, @Valid @RequestBody CategoryRequest r) {
		return service.update(id, r);
	}
	@DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void delete(@PathVariable Long id) {
		service.delete(id);
	}
}
