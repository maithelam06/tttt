package com.example.bewebsslock.service;
import com.example.bewebsslock.dto.request.StaffRequest;
import com.example.bewebsslock.entity.AppUser;
import com.example.bewebsslock.exception.NotFoundException;
import com.example.bewebsslock.repository.AppUserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
@Service
public class StaffService {
	private final AppUserRepository repo;
	private final PasswordEncoder encoder;
	public StaffService(AppUserRepository r, PasswordEncoder e) {
		repo = r;
		encoder = e;
	}
	public List<AppUser> all() {
		return repo.findAll();
	}
	public AppUser one(Long id) {
		return get(id);
	}
	public AppUser create(StaffRequest r) {
		AppUser x = new AppUser();
		x.setUsername(r.username);
		x.setPassword(encoder.encode(r.password));
		x.setFullName(r.fullName);
		x.setRole(r.role);
		return repo.save(x);
	}
	public AppUser update(Long id, StaffRequest r) {
		AppUser x = get(id);
		x.setUsername(r.username);
		if (r.password != null && !r.password.isBlank())
			x.setPassword(encoder.encode(r.password));
		x.setFullName(r.fullName);
		x.setRole(r.role);
		return repo.save(x);
	}
	public void delete(Long id) {
		if (!repo.existsById(id))
			throw new NotFoundException("Không tìm thấy nhân viên");
		repo.deleteById(id);
	}
	private AppUser get(Long id) {
		return repo.findById(id).orElseThrow(() -> new NotFoundException("Không tìm thấy nhân viên"));
	}
}
