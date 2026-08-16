package com.example.bewebsslock.service;
import com.example.bewebsslock.entity.Brand;
import com.example.bewebsslock.exception.NotFoundException;
import com.example.bewebsslock.repository.BrandRepository;
import org.springframework.stereotype.Service;
import java.util.List;
@Service
public class BrandService {
	private final BrandRepository repo;
	public BrandService(BrandRepository repo) {
		this.repo = repo;
	}
	public List<Brand> all() {
		return repo.findAll();
	}
	public Brand one(Long id) {
		return get(id);
	}
	public Brand save(Brand x) {
		return repo.save(x);
	}
	public Brand update(Long id, Brand x) {
		get(id);
		x.id = id;
		return repo.save(x);
	}
	public void delete(Long id) {
		repo.delete(get(id));
	}
	private Brand get(Long id) {
		return repo.findById(id).orElseThrow(() -> new NotFoundException("Không tìm thấy thương hiệu"));
	}
}
