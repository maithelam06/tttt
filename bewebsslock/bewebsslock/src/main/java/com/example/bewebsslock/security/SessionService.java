package com.example.bewebsslock.security;
import com.example.bewebsslock.dto.response.LoginResponse;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
@Service
public class SessionService {
	private final Map<String, LoginResponse> sessions = new ConcurrentHashMap<>();
	public LoginResponse create(Long id, String username, String fullName, String role) {
		String token = UUID.randomUUID().toString();
		LoginResponse user = new LoginResponse(id, username, fullName, role, token);
		sessions.put(token, user);
		return user;
	}
	public LoginResponse find(String token) {
		return token == null ? null : sessions.get(token);
	}
	public void remove(String token) {
		sessions.remove(token);
	}
}
