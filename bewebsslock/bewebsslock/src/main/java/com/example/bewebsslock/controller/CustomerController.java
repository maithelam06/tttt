package com.example.bewebsslock.controller;
import com.example.bewebsslock.entity.Customer;
import com.example.bewebsslock.service.CustomerService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/customers")
public class CustomerController {
	private final CustomerService s;
	public CustomerController(CustomerService s) {
		this.s = s;
	}
	@GetMapping
	public List<Customer> all() {
		return s.all();
	}
	@GetMapping("/{id}")
	public Customer one(@PathVariable Long id) {
		return s.get(id);
	}
	@PostMapping
	public Customer add(@RequestBody Customer x) {
		return s.save(x);
	}
	@PutMapping("/{id}")
	public Customer edit(@PathVariable Long id, @RequestBody Customer x) {
		return s.update(id, x);
	}
	@DeleteMapping("/{id}")
	public void delete(@PathVariable Long id) {
		s.delete(id);
	}
}
