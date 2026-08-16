package com.example.bewebsslock.service;

import com.example.bewebsslock.entity.AppUser;
import com.example.bewebsslock.entity.Technician;
import com.example.bewebsslock.enums.Role;
import com.example.bewebsslock.exception.NotFoundException;
import com.example.bewebsslock.repository.AppUserRepository;
import com.example.bewebsslock.repository.TechnicianRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TechnicianService {

	private final TechnicianRepository repo;
	private final AppUserRepository users;
	private final PasswordEncoder encoder;

	public TechnicianService(
			TechnicianRepository repo,
			AppUserRepository users,
			PasswordEncoder encoder) {
		this.repo = repo;
		this.users = users;
		this.encoder = encoder;
	}

	public List<Technician> all() {
		return repo.findAll();
	}

	public Technician save(Technician x) {
		syncAppUser(x);
		return repo.save(x);
	}

	public Technician update(Long id, Technician x) {
		get(id);
		x.setId(id);
		syncAppUser(x);
		return repo.save(x);
	}

	public Technician updateStatus(Long id, String status) {
		Technician t = get(id);
		t.setStatus(status.toUpperCase());
		return repo.save(t);
	}

	public void delete(Long id) {
		Technician t = get(id);
		if (t.getUsername() != null && !t.getUsername().isBlank()) {
			users.findByUsername(t.getUsername()).ifPresent(users::delete);
		}
		repo.delete(t);
	}

	public Technician get(Long id) {
		return repo.findById(id).orElseThrow(() -> new NotFoundException("Không tìm thấy kỹ thuật viên #" + id));
	}

	private void syncAppUser(Technician x) {
		if (x.getUsername() != null && !x.getUsername().isBlank()) {
			String uname = x.getUsername().trim();
			AppUser u = users.findByUsername(uname).orElseGet(() -> {
				AppUser newUser = new AppUser();
				newUser.setUsername(uname);
				return newUser;
			});
			u.setFullName(x.getFullName());
			u.setRole(Role.TECHNICIAN);
			if (x.getPassword() != null && !x.getPassword().isBlank()) {
				u.setPassword(encoder.encode(x.getPassword().trim()));
			} else if (u.getPassword() == null) {
				u.setPassword(encoder.encode("tech123")); // Mật khẩu mặc định nếu trống
			}
			users.save(u);
		}
	}
}
