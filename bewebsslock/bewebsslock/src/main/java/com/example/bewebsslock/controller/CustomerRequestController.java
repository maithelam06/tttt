package com.example.bewebsslock.controller;

import com.example.bewebsslock.dto.request.CustomerRequestDto;
import com.example.bewebsslock.entity.CustomerRequest;
import com.example.bewebsslock.service.CustomerRequestService;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
public class CustomerRequestController {

	private final CustomerRequestService service;

	public CustomerRequestController(CustomerRequestService service) {
		this.service = service;
	}

	/** Lấy tất cả yêu cầu (Admin/Staff) */
	@GetMapping
	public List<CustomerRequest> findAll() {
		return service.findAll();
	}

	/**
	 * Tra cứu hành trình cho KHÁCH HÀNG — không cần đăng nhập.
	 * GET /api/requests/track?query=0909123456
	 */
	@GetMapping("/track")
	public List<CustomerRequest> track(@RequestParam String query) {
		return service.track(query);
	}

	/** Tạo yêu cầu mới từ form khách hàng — không cần đăng nhập */
	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public CustomerRequest create(@Valid @RequestBody CustomerRequestDto r) {
		return service.create(r);
	}

	/** Chi tiết một yêu cầu */
	@GetMapping("/{id}")
	public CustomerRequest findOne(@PathVariable Long id) {
		return service.findOne(id);
	}

	/**
	 * Cập nhật trạng thái (Admin/Staff).
	 * PATCH /api/requests/{id}/status?value=PROCESSING
	 */
	@PatchMapping("/{id}/status")
	public CustomerRequest updateStatus(
			@PathVariable Long id,
			@RequestParam String value) {
		return service.updateStatus(id, value);
	}

	/**
	 * Phân công kỹ thuật viên (Admin/Staff).
	 * PATCH /api/requests/{id}/assign?technicianId=3
	 */
	@PatchMapping("/{id}/assign")
	public CustomerRequest assign(
			@PathVariable Long id,
			@RequestParam Long technicianId) {
		return service.assign(id, technicianId);
	}

	/** Xóa yêu cầu (Admin only) */
	@DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void delete(@PathVariable Long id) {
		service.delete(id);
	}
}
