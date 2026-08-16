package com.example.bewebsslock.service;

import com.example.bewebsslock.dto.request.CustomerRequestDto;
import com.example.bewebsslock.entity.CustomerRequest;
import com.example.bewebsslock.entity.Technician;
import com.example.bewebsslock.enums.RequestStatus;
import com.example.bewebsslock.exception.NotFoundException;
import com.example.bewebsslock.repository.*;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CustomerRequestService {

	private final CustomerRequestRepository repository;
	private final ProductRepository products;
	private final TechnicianRepository technicians;

	public CustomerRequestService(
			CustomerRequestRepository repository,
			ProductRepository products,
			TechnicianRepository technicians) {
		this.repository  = repository;
		this.products    = products;
		this.technicians = technicians;
	}

	/** Lấy tất cả yêu cầu, mới nhất trước */
	public List<CustomerRequest> findAll() {
		return repository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
	}

	/** Tạo yêu cầu mới từ khách hàng */
	public CustomerRequest create(CustomerRequestDto r) {
		CustomerRequest x = new CustomerRequest();
		x.setType(r.getType() != null ? r.getType().toUpperCase() : "CONSULTATION");
		x.setCustomerName(r.getCustomerName());
		x.setPhone(r.getPhone());
		x.setEmail(r.getEmail());
		x.setAddress(r.getAddress());
		x.setNote(r.getNote());
		x.setDoorImageUrl(r.getDoorImageUrl());
		x.setAppointmentAt(r.getAppointmentAt());
		if (r.getProductId() != null)
			x.setProduct(products.findById(r.getProductId())
					.orElseThrow(() -> new NotFoundException("Không tìm thấy sản phẩm")));
		return repository.save(x);
	}

	/** Lấy chi tiết một yêu cầu */
	public CustomerRequest findOne(Long id) {
		return get(id);
	}

	/**
	 * Tra cứu hành trình cho khách hàng.
	 * Tìm theo số điện thoại hoặc mã phiếu YC-...
	 */
	public List<CustomerRequest> track(String query) {
		if (query == null || query.isBlank())
			throw new IllegalArgumentException("Vui lòng nhập số điện thoại hoặc mã phiếu");
		return repository.trackByPhoneOrCode(query.trim());
	}

	/** Cập nhật trạng thái */
	public CustomerRequest updateStatus(Long id, String value) {
		CustomerRequest req = get(id);
		RequestStatus newStatus;
		try {
			newStatus = RequestStatus.valueOf(value.toUpperCase());
		} catch (IllegalArgumentException ex) {
			throw new IllegalArgumentException("Trạng thái không hợp lệ: " + value);
		}
		req.setStatus(newStatus);
		if (newStatus == RequestStatus.COMPLETED)
			req.setCompletedAt(LocalDateTime.now());
		return repository.save(req);
	}

	/**
	 * Phân công kỹ thuật viên.
	 * Tự động chuyển trạng thái → ASSIGNED.
	 */
	public CustomerRequest assign(Long id, Long technicianId) {
		CustomerRequest req = get(id);
		Technician tech = technicians.findById(technicianId)
				.orElseThrow(() -> new NotFoundException("Không tìm thấy kỹ thuật viên #" + technicianId));
		req.setTechnician(tech);
		req.setAssignedAt(LocalDateTime.now());
		if (req.getStatus() == RequestStatus.PENDING || req.getStatus() == RequestStatus.PROCESSING)
			req.setStatus(RequestStatus.ASSIGNED);
		return repository.save(req);
	}

	/** Xóa yêu cầu (Admin only) */
	public void delete(Long id) {
		repository.delete(get(id));
	}

	private CustomerRequest get(Long id) {
		return repository.findById(id)
				.orElseThrow(() -> new NotFoundException("Không tìm thấy yêu cầu #" + id));
	}
}
