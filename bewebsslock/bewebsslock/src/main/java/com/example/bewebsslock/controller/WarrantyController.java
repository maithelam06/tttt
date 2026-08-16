package com.example.bewebsslock.controller;

import com.example.bewebsslock.dto.request.WarrantyRequest;
import com.example.bewebsslock.entity.Warranty;
import com.example.bewebsslock.service.WarrantyService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/warranties")
public class WarrantyController {

	private final WarrantyService s;

	public WarrantyController(WarrantyService s) {
		this.s = s;
	}

	@GetMapping
	public List<Warranty> all() {
		return s.all();
	}

	@GetMapping("/{id}")
	public Warranty one(@PathVariable Long id) {
		return s.one(id);
	}

	/** Tra cứu bảo hành công khai bằng Mã phiếu, Số Serial hoặc SĐT */
	@GetMapping("/verify/{code}")
	public List<Warranty> verify(@PathVariable String code) {
		return s.searchPublic(code);
	}

	@PostMapping
	public Warranty add(@Valid @RequestBody WarrantyRequest x) {
		return s.create(x);
	}

	@PatchMapping("/{id}/repair")
	public Warranty repair(@PathVariable Long id, @RequestParam String note) {
		return s.repair(id, note);
	}

	@PutMapping("/{id}")
	public Warranty update(@PathVariable Long id, @Valid @RequestBody WarrantyRequest x) {
		return s.update(id, x);
	}

	@PatchMapping("/{id}/status")
	public Warranty status(@PathVariable Long id, @RequestParam String value) {
		return s.status(id, value);
	}

	@DeleteMapping("/{id}")
	public void delete(@PathVariable Long id) {
		s.delete(id);
	}
}
