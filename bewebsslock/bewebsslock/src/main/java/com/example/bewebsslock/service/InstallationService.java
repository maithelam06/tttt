package com.example.bewebsslock.service;
import com.example.bewebsslock.dto.request.InstallationRequest;
import com.example.bewebsslock.entity.Installation;
import com.example.bewebsslock.exception.NotFoundException;
import com.example.bewebsslock.repository.*;
import org.springframework.stereotype.Service;
import java.util.List;
@Service
public class InstallationService {
	private final InstallationRepository repo;
	private final ProductRepository products;
	private final CustomerRepository customers;
	private final TechnicianRepository technicians;
	public InstallationService(InstallationRepository r, ProductRepository p, CustomerRepository c,
			TechnicianRepository t) {
		repo = r;
		products = p;
		customers = c;
		technicians = t;
	}
	public List<Installation> all() {
		return repo.findAll();
	}
	public Installation one(Long id) {
		return get(id);
	}
	public Installation create(InstallationRequest r) {
		Installation x = new Installation();
		x.product = products.findById(r.productId).orElseThrow(() -> new NotFoundException("Không tìm thấy sản phẩm"));
		x.customer = customers.findById(r.customerId)
				.orElseThrow(() -> new NotFoundException("Không tìm thấy khách hàng"));
		if (r.technicianId != null)
			x.technician = technicians.findById(r.technicianId)
					.orElseThrow(() -> new NotFoundException("Không tìm thấy kỹ thuật viên"));
		x.address = r.address;
		x.appointmentAt = r.appointmentAt;
		x.note = r.note;
		x.doorImageUrl = r.doorImageUrl;
		return repo.save(x);
	}
	public Installation update(Long id, InstallationRequest r) {
		Installation x = get(id);
		x.product = products.findById(r.productId).orElseThrow(() -> new NotFoundException("Không tìm thấy sản phẩm"));
		x.customer = customers.findById(r.customerId)
				.orElseThrow(() -> new NotFoundException("Không tìm thấy khách hàng"));
		x.technician = r.technicianId == null ? null : technicians.findById(r.technicianId)
				.orElseThrow(() -> new NotFoundException("Không tìm thấy kỹ thuật viên"));
		x.address = r.address;
		x.appointmentAt = r.appointmentAt;
		x.note = r.note;
		x.doorImageUrl = r.doorImageUrl;
		return repo.save(x);
	}
	public Installation assign(Long id, Long technicianId) {
		Installation x = get(id);
		x.technician = technicians.findById(technicianId)
				.orElseThrow(() -> new NotFoundException("Không tìm thấy kỹ thuật viên"));
		x.status = "ASSIGNED";
		return repo.save(x);
	}
	public Installation status(Long id, String status) {
		Installation x = get(id);
		x.status = status.toUpperCase();
		return repo.save(x);
	}
	public void delete(Long id) {
		repo.delete(get(id));
	}
	private Installation get(Long id) {
		return repo.findById(id).orElseThrow(() -> new NotFoundException("Không tìm thấy lịch lắp đặt"));
	}
}
