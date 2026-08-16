package com.example.bewebsslock.controller;
import com.example.bewebsslock.dto.request.QuoteRequest;
import com.example.bewebsslock.entity.Quote;
import com.example.bewebsslock.service.QuoteService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/quotes")
public class QuoteController {
	private final QuoteService s;
	public QuoteController(QuoteService s) {
		this.s = s;
	}
	@GetMapping
	public List<Quote> all() {
		return s.all();
	}
	@GetMapping("/{id}")
	public Quote one(@PathVariable Long id) {
		return s.one(id);
	}
	@PostMapping
	public Quote add(@Valid @RequestBody QuoteRequest x) {
		return s.create(x);
	}
	@PatchMapping("/{id}/status")
	public Quote status(@PathVariable Long id, @RequestParam String value) {
		return s.status(id, value);
	}
	@PutMapping("/{id}")
	public Quote update(@PathVariable Long id, @Valid @RequestBody QuoteRequest x) {
		return s.update(id, x);
	}
	@DeleteMapping("/{id}")
	public void delete(@PathVariable Long id) {
		s.delete(id);
	}
}
