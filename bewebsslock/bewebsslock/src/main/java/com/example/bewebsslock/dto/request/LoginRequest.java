package com.example.bewebsslock.dto.request;

import jakarta.validation.constraints.NotBlank;

public class LoginRequest {
	@NotBlank
	private String username;
	@NotBlank
	private String password;
	public LoginRequest() {
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String v) {
		username = v;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String v) {
		password = v;
	}
}
