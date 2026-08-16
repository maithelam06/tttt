package com.example.bewebsslock.service;

import com.example.bewebsslock.dto.request.CategoryRequest;
import com.example.bewebsslock.entity.Category;
import com.example.bewebsslock.exception.NotFoundException;
import com.example.bewebsslock.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CategoryService {
	private final CategoryRepository repository;
	public CategoryService(CategoryRepository repository) {
		this.repository = repository;
	}
	public List<Category> findAll() {
		return repository.findAll();
	}
	public Category findOne(Long id) {
		return get(id);
	}
	public Category create(CategoryRequest r) {
		return repository.save(map(new Category(), r));
	}
	public Category update(Long id, CategoryRequest r) {
		return repository.save(map(get(id), r));
	}
	public void delete(Long id) {
		repository.delete(get(id));
	}
	private Category get(Long id) {
		return repository.findById(id).orElseThrow(() -> new NotFoundException("Không tìm thấy danh mục"));
	}
	private Category map(Category c, CategoryRequest r) {
		c.setCode(r.getCode());
		c.setName(r.getName());
		c.setDescription(r.getDescription());
		c.setActive(r.isActive());
		return c;
	}
}
