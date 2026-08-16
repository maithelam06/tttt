package com.example.bewebsslock.service;
import com.example.bewebsslock.entity.Customer;
import com.example.bewebsslock.exception.NotFoundException;
import com.example.bewebsslock.repository.CustomerRepository;
import org.springframework.stereotype.Service;
import java.util.List;
@Service
public class CustomerService {
	private final CustomerRepository repo;
	public CustomerService(CustomerRepository repo) {
		this.repo = repo;
	}
	public List<Customer> all() {
		return repo.findAll();
	}
	public Customer save(Customer x) {
		return repo.save(x);
	}
	public Customer update(Long id, Customer x) {
		get(id);
		x.id = id;
		return repo.save(x);
	}
	public void delete(Long id) {
		repo.delete(get(id));
	}
	public Customer get(Long id) {
		return repo.findById(id).orElseThrow(() -> new NotFoundException("Không tìm thấy khách hàng"));
	}
}
