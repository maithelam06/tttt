package com.example.bewebsslock.service;

import com.example.bewebsslock.dto.request.WarrantyRequest;
import com.example.bewebsslock.entity.Customer;
import com.example.bewebsslock.entity.Product;
import com.example.bewebsslock.entity.Warranty;
import com.example.bewebsslock.exception.NotFoundException;
import com.example.bewebsslock.repository.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WarrantyService {

	private final WarrantyRepository repo;
	private final ProductRepository products;
	private final CustomerRepository customers;

	public WarrantyService(WarrantyRepository r, ProductRepository p, CustomerRepository c) {
		repo = r;
		products = p;
		customers = c;
	}

	public List<Warranty> all() {
		return repo.findAll();
	}

	public Warranty one(Long id) {
		return get(id);
	}

	public Warranty findByCode(String code) {
		return repo.findByCode(code).orElseThrow(() -> new NotFoundException("Không tìm thấy phiếu bảo hành"));
	}

	public List<Warranty> searchPublic(String query) {
		if (query == null || query.isBlank()) return List.of();
		return repo.searchPublic(query.trim());
	}

	public Warranty create(WarrantyRequest r) {
		Product product = products.findById(r.productId)
				.orElseThrow(() -> new NotFoundException("Không tìm thấy sản phẩm"));
		Customer customer = customers.findById(r.customerId)
				.orElseThrow(() -> new NotFoundException("Không tìm thấy khách hàng"));

		String sn = r.serialNumber != null ? r.serialNumber.trim() : "";
		if (sn.isBlank()) {
			String skuPrefix = product.getSku() != null ? product.getSku().replaceAll("[^a-zA-Z0-9]", "") : "SSL";
			sn = "SN-" + skuPrefix.toUpperCase() + "-" + java.time.LocalDate.now().getYear() + "-" + (10000 + (int)(Math.random() * 90000));
		} else if (repo.existsBySerialNumber(sn)) {
			throw new IllegalArgumentException("Số Serial [" + sn + "] đã tồn tại trong hệ thống! Mỗi khóa cấp cho khách hàng phải có số Serial duy nhất.");
		}

		Warranty x = new Warranty();
		x.code = "BH-" + System.currentTimeMillis();
		x.serialNumber = sn;
		x.product = product;
		x.customer = customer;
		x.purchaseDate = r.purchaseDate;
		x.expiresAt = r.purchaseDate.plusMonths(product.getWarrantyMonths());
		return repo.save(x);
	}

	public Warranty update(Long id, WarrantyRequest r) {
		Warranty x = get(id);
		Product product = products.findById(r.productId)
				.orElseThrow(() -> new NotFoundException("Không tìm thấy sản phẩm"));
		Customer customer = customers.findById(r.customerId)
				.orElseThrow(() -> new NotFoundException("Không tìm thấy khách hàng"));

		String sn = r.serialNumber != null ? r.serialNumber.trim() : "";
		if (!sn.isBlank() && !sn.equalsIgnoreCase(x.serialNumber) && repo.existsBySerialNumber(sn)) {
			throw new IllegalArgumentException("Số Serial [" + sn + "] đã được cấp cho sản phẩm khác!");
		}

		x.serialNumber = sn.isBlank() ? x.serialNumber : sn;
		x.product = product;
		x.customer = customer;
		x.purchaseDate = r.purchaseDate;
		x.expiresAt = r.purchaseDate.plusMonths(product.getWarrantyMonths());
		return repo.save(x);
	}

	public Warranty repair(Long id, String note) {
		Warranty x = get(id);
		x.repairHistory = (x.repairHistory == null ? "" : x.repairHistory + "\n") + note;
		return repo.save(x);
	}

	public Warranty status(Long id, String value) {
		Warranty x = get(id);
		x.status = value.toUpperCase();
		return repo.save(x);
	}

	public void delete(Long id) {
		repo.delete(get(id));
	}

	private Warranty get(Long id) {
		return repo.findById(id).orElseThrow(() -> new NotFoundException("Không tìm thấy phiếu bảo hành"));
	}
}
