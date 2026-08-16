package com.example.bewebsslock.controller;
import com.example.bewebsslock.service.DashboardService;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
	private final DashboardService s;
	public DashboardController(DashboardService s) {
		this.s = s;
	}
	@GetMapping
	public Map<String, Object> summary() {
		return s.summary();
	}
}
