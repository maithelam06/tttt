package com.example.bewebsslock.controller;

import com.example.bewebsslock.entity.Technician;
import com.example.bewebsslock.service.TechnicianService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/technicians")
public class TechnicianController {

	private final TechnicianService s;

	public TechnicianController(TechnicianService s) {
		this.s = s;
	}

	@GetMapping
	public List<Technician> all() {
		return s.all();
	}

	@GetMapping("/{id}")
	public Technician one(@PathVariable Long id) {
		return s.get(id);
	}

	@PostMapping
	public Technician add(@RequestBody Technician x) {
		return s.save(x);
	}

	@PutMapping("/{id}")
	public Technician edit(@PathVariable Long id, @RequestBody Technician x) {
		return s.update(id, x);
	}

	/** Cập nhật trạng thái bận/sẵn sàng của Kỹ thuật viên */
	@PatchMapping("/{id}/status")
	public Technician status(@PathVariable Long id, @RequestParam String value) {
		return s.updateStatus(id, value);
	}

	@DeleteMapping("/{id}")
	public void delete(@PathVariable Long id) {
		s.delete(id);
	}
}
