package com.example.bewebsslock.controller;

import com.example.bewebsslock.dto.request.ProductRequest;
import com.example.bewebsslock.dto.response.ProductResponse;
import com.example.bewebsslock.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {
	private final ProductService service;
	public ProductController(ProductService service) {
		this.service = service;
	}
	@GetMapping
	public List<ProductResponse> findAll(@RequestParam(required = false) String keyword) {
		return service.findAll(keyword);
	}
	@GetMapping("/{id}")
	public ProductResponse findOne(@PathVariable Long id) {
		return service.findById(id);
	}
	@GetMapping("/recommend")
	public List<ProductResponse> recommend(@RequestParam(required = false) String doorType,
			@RequestParam(required = false) String feature,
			@RequestParam(required = false) java.math.BigDecimal maxPrice) {
		return service.recommend(doorType, feature, maxPrice);
	}
	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public ProductResponse create(@Valid @RequestBody ProductRequest r) {
		return service.create(r);
	}
	@PutMapping("/{id}")
	public ProductResponse update(@PathVariable Long id, @Valid @RequestBody ProductRequest r) {
		return service.update(id, r);
	}
	@DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void delete(@PathVariable Long id) {
		service.delete(id);
	}
}
