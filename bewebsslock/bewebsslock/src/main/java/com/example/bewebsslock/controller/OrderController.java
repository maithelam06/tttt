package com.example.bewebsslock.controller;
import com.example.bewebsslock.dto.request.OrderRequest;
import com.example.bewebsslock.entity.OrderEntity;
import com.example.bewebsslock.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/orders")
public class OrderController {
	private final OrderService s;
	public OrderController(OrderService s) {
		this.s = s;
	}
	@GetMapping
	public List<OrderEntity> all() {
		return s.all();
	}
	@GetMapping("/{id}")
	public OrderEntity one(@PathVariable Long id) {
		return s.one(id);
	}
	@PostMapping
	public OrderEntity add(@Valid @RequestBody OrderRequest x) {
		return s.create(x);
	}
	@PatchMapping("/{id}/status")
	public OrderEntity status(@PathVariable Long id, @RequestParam String value) {
		return s.status(id, value);
	}
	@DeleteMapping("/{id}")
	public void delete(@PathVariable Long id) {
		s.delete(id);
	}
}
