package com.example.bewebsslock.controller;
import com.example.bewebsslock.entity.Brand;
import com.example.bewebsslock.service.BrandService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/brands")
public class BrandController {
	private final BrandService s;
	public BrandController(BrandService s) {
		this.s = s;
	}
	@GetMapping
	public List<Brand> all() {
		return s.all();
	}
	@GetMapping("/{id}")
	public Brand one(@PathVariable Long id) {
		return s.one(id);
	}
	@PostMapping
	public Brand add(@RequestBody Brand x) {
		return s.save(x);
	}
	@PutMapping("/{id}")
	public Brand edit(@PathVariable Long id, @RequestBody Brand x) {
		return s.update(id, x);
	}
	@DeleteMapping("/{id}")
	public void delete(@PathVariable Long id) {
		s.delete(id);
	}
}
