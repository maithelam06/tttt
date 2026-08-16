package com.example.bewebsslock.controller;
import com.example.bewebsslock.dto.request.InstallationRequest;
import com.example.bewebsslock.entity.Installation;
import com.example.bewebsslock.service.InstallationService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/installations")
public class InstallationController {
	private final InstallationService s;
	public InstallationController(InstallationService s) {
		this.s = s;
	}
	@GetMapping
	public List<Installation> all() {
		return s.all();
	}
	@GetMapping("/{id}")
	public Installation one(@PathVariable Long id) {
		return s.one(id);
	}
	@PostMapping
	public Installation add(@Valid @RequestBody InstallationRequest x) {
		return s.create(x);
	}
	@PatchMapping("/{id}/assign")
	public Installation assign(@PathVariable Long id, @RequestParam Long technicianId) {
		return s.assign(id, technicianId);
	}
	@PatchMapping("/{id}/status")
	public Installation status(@PathVariable Long id, @RequestParam String value) {
		return s.status(id, value);
	}
	@PutMapping("/{id}")
	public Installation update(@PathVariable Long id, @Valid @RequestBody InstallationRequest x) {
		return s.update(id, x);
	}
	@DeleteMapping("/{id}")
	public void delete(@PathVariable Long id) {
		s.delete(id);
	}
}
