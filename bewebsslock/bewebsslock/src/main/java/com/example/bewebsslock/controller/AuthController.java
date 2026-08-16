package com.example.bewebsslock.controller;

import com.example.bewebsslock.dto.request.LoginRequest;
import com.example.bewebsslock.dto.response.LoginResponse;
import com.example.bewebsslock.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
	private final AuthService service;
	public AuthController(AuthService service) {
		this.service = service;
	}
	@PostMapping("/login")
	public LoginResponse login(@Valid @RequestBody LoginRequest request) {
		return service.login(request);
	}
	@PostMapping("/logout")
	public void logout(@RequestHeader("X-Auth-Token") String token) {
		service.logout(token);
	}
}
