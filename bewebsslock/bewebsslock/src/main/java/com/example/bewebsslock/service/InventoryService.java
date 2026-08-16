package com.example.bewebsslock.service;
import com.example.bewebsslock.dto.request.InventoryRequest;
import com.example.bewebsslock.entity.*;
import com.example.bewebsslock.exception.NotFoundException;
import com.example.bewebsslock.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
@Service
public class InventoryService {
	private final InventoryTransactionRepository repo;
	private final ProductRepository products;
	public InventoryService(InventoryTransactionRepository r, ProductRepository p) {
		repo = r;
		products = p;
	}
	public List<InventoryTransaction> all() {
		return repo.findAll();
	}
	public InventoryTransaction one(Long id) {
		return repo.findById(id).orElseThrow(() -> new NotFoundException("Không tìm thấy giao dịch kho"));
	}
	@Transactional
	public InventoryTransaction create(InventoryRequest r) {
		Product p = products.findById(r.productId).orElseThrow(() -> new NotFoundException("Không tìm thấy sản phẩm"));
		int change = "OUT".equalsIgnoreCase(r.type) ? -r.quantity : r.quantity;
		if (p.getStock() + change < 0)
			throw new IllegalArgumentException("Tồn kho không đủ");
		p.setStock(p.getStock() + change);
		products.save(p);
		InventoryTransaction x = new InventoryTransaction();
		x.product = p;
		x.quantity = r.quantity;
		x.type = r.type.toUpperCase();
		x.note = r.note;
		return repo.save(x);
	}
}
