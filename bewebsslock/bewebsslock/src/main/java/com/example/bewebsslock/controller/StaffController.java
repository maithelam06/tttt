package com.example.bewebsslock.controller;
import com.example.bewebsslock.dto.request.StaffRequest;
import com.example.bewebsslock.entity.AppUser;
import com.example.bewebsslock.service.StaffService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/staff")
public class StaffController {
	private final StaffService s;
	public StaffController(StaffService s) {
		this.s = s;
	}
	@GetMapping
	public List<AppUser> all() {
		return s.all();
	}
	@PostMapping
	public AppUser add(@Valid @RequestBody StaffRequest x) {
		return s.create(x);
	}
	@GetMapping("/{id}")
	public AppUser one(@PathVariable Long id) {
		return s.one(id);
	}
	@PutMapping("/{id}")
	public AppUser update(@PathVariable Long id, @Valid @RequestBody StaffRequest x) {
		return s.update(id, x);
	}
	@DeleteMapping("/{id}")
	public void delete(@PathVariable Long id) {
		s.delete(id);
	}
}
