package com.example.bewebsslock.controller;
import com.example.bewebsslock.dto.request.InventoryRequest;
import com.example.bewebsslock.entity.InventoryTransaction;
import com.example.bewebsslock.service.InventoryService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/inventory")
public class InventoryController {
	private final InventoryService s;
	public InventoryController(InventoryService s) {
		this.s = s;
	}
	@GetMapping
	public List<InventoryTransaction> all() {
		return s.all();
	}
	@GetMapping("/{id}")
	public InventoryTransaction one(@PathVariable Long id) {
		return s.one(id);
	}
	@PostMapping
	public InventoryTransaction add(@Valid @RequestBody InventoryRequest x) {
		return s.create(x);
	}
}
