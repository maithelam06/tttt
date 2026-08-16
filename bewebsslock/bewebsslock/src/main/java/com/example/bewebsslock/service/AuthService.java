package com.example.bewebsslock.service;

import com.example.bewebsslock.dto.request.LoginRequest;
import com.example.bewebsslock.dto.response.LoginResponse;
import com.example.bewebsslock.entity.AppUser;
import com.example.bewebsslock.repository.AppUserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.example.bewebsslock.security.SessionService;

@Service
public class AuthService {
	private final AppUserRepository users;
	private final PasswordEncoder encoder;
	private final SessionService sessions;
	public AuthService(AppUserRepository users, PasswordEncoder encoder, SessionService sessions) {
		this.users = users;
		this.encoder = encoder;
		this.sessions = sessions;
	}
	public LoginResponse login(LoginRequest request) {
		AppUser user = users.findByUsername(request.getUsername())
				.filter(x -> encoder.matches(request.getPassword(), x.getPassword()))
				.orElseThrow(() -> new IllegalArgumentException("Tài khoản hoặc mật khẩu không đúng"));
		return sessions.create(user.getId(), user.getUsername(), user.getFullName(), user.getRole().name());
	}
	public void logout(String token) {
		sessions.remove(token);
	}
}
