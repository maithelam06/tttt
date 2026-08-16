package com.example.bewebsslock.dto.response;

public class LoginResponse {
	private final Long id;
	private final String username, fullName, role, token;
	public LoginResponse(Long id, String username, String fullName, String role, String token) {
		this.id = id;
		this.username = username;
		this.fullName = fullName;
		this.role = role;
		this.token = token;
	}
	public Long getId() {
		return id;
	}
	public String getUsername() {
		return username;
	}
	public String getFullName() {
		return fullName;
	}
	public String getRole() {
		return role;
	}
	public String getToken() {
		return token;
	}
}
