package com.example.bewebsslock.service;
import com.example.bewebsslock.dto.request.QuoteRequest;
import com.example.bewebsslock.entity.Quote;
import com.example.bewebsslock.exception.NotFoundException;
import com.example.bewebsslock.repository.*;
import org.springframework.stereotype.Service;
import java.util.List;
@Service
public class QuoteService {
	private final QuoteRepository repo;
	private final CustomerRepository customers;
	public QuoteService(QuoteRepository r, CustomerRepository c) {
		repo = r;
		customers = c;
	}
	public List<Quote> all() {
		return repo.findAll();
	}
	public Quote one(Long id) {
		return get(id);
	}
	public Quote create(QuoteRequest r) {
		Quote x = new Quote();
		x.code = "BG-" + System.currentTimeMillis();
		x.customer = customers.findById(r.customerId)
				.orElseThrow(() -> new NotFoundException("Không tìm thấy khách hàng"));
		x.total = r.total;
		x.content = r.content;
		x.validUntil = r.validUntil;
		return repo.save(x);
	}
	public Quote update(Long id, QuoteRequest r) {
		Quote x = get(id);
		x.customer = customers.findById(r.customerId)
				.orElseThrow(() -> new NotFoundException("Không tìm thấy khách hàng"));
		x.total = r.total;
		x.content = r.content;
		x.validUntil = r.validUntil;
		return repo.save(x);
	}
	public Quote status(Long id, String status) {
		Quote x = get(id);
		x.status = status.toUpperCase();
		return repo.save(x);
	}
	public void delete(Long id) {
		repo.delete(get(id));
	}
	private Quote get(Long id) {
		return repo.findById(id).orElseThrow(() -> new NotFoundException("Không tìm thấy báo giá"));
	}
}
