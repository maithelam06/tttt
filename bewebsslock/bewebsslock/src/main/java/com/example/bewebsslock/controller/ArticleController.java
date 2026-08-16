package com.example.bewebsslock.controller;

import com.example.bewebsslock.dto.request.ArticleRequest;
import com.example.bewebsslock.entity.Article;
import com.example.bewebsslock.enums.ArticleType;
import com.example.bewebsslock.service.ArticleService;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/articles")
public class ArticleController {
	private final ArticleService service;
	public ArticleController(ArticleService service) {
		this.service = service;
	}
	@GetMapping
	public List<Article> findAll(@RequestParam(required = false) ArticleType type) {
		return service.findAll(type);
	}
	@GetMapping("/{id}")
	public Article findOne(@PathVariable Long id) {
		return service.findOne(id);
	}
	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public Article create(@Valid @RequestBody ArticleRequest r) {
		return service.create(r);
	}
	@PutMapping("/{id}")
	public Article update(@PathVariable Long id, @Valid @RequestBody ArticleRequest r) {
		return service.update(id, r);
	}
	@DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void delete(@PathVariable Long id) {
		service.delete(id);
	}
}
