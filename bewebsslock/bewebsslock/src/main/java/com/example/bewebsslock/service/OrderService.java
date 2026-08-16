package com.example.bewebsslock.service;
import com.example.bewebsslock.dto.request.OrderRequest;
import com.example.bewebsslock.entity.*;
import com.example.bewebsslock.exception.NotFoundException;
import com.example.bewebsslock.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;
@Service
public class OrderService {
	private final OrderRepository orders;
	private final CustomerRepository customers;
	private final ProductRepository products;
	public OrderService(OrderRepository o, CustomerRepository c, ProductRepository p) {
		orders = o;
		customers = c;
		products = p;
	}
	public List<OrderEntity> all() {
		return orders.findAll();
	}
	public OrderEntity one(Long id) {
		return get(id);
	}
	@Transactional
	public OrderEntity create(OrderRequest r) {
		OrderEntity order = new OrderEntity();
		order.code = "DH-" + System.currentTimeMillis();
		order.note = r.note;
		order.customer = customers.findById(r.customerId)
				.orElseThrow(() -> new NotFoundException("Không tìm thấy khách hàng"));
		for (OrderRequest.Item input : r.items) {
			Product p = products.findById(input.productId)
					.orElseThrow(() -> new NotFoundException("Không tìm thấy sản phẩm"));
			if (p.getStock() < input.quantity)
				throw new IllegalArgumentException("Sản phẩm " + p.getName() + " không đủ tồn kho");
			p.setStock(p.getStock() - input.quantity);
			products.save(p);
			OrderItem item = new OrderItem();
			item.product = p;
			item.quantity = input.quantity;
			item.price = p.getPrice();
			order.items.add(item);
			order.total = order.total.add(p.getPrice().multiply(BigDecimal.valueOf(input.quantity)));
		}
		return orders.save(order);
	}
	@Transactional
	public OrderEntity status(Long id, String status) {
		OrderEntity x = get(id);
		String next = status.toUpperCase();
		if ("CANCELLED".equals(next) && !"CANCELLED".equals(x.status)) {
			restoreStock(x);
		}
		if (!"CANCELLED".equals(next) && "CANCELLED".equals(x.status)) {
			throw new IllegalArgumentException("Không thể mở lại đơn đã hủy");
		}
		x.status = next;
		return orders.save(x);
	}
	@Transactional
	public void delete(Long id) {
		OrderEntity order = get(id);
		if (!"CANCELLED".equals(order.status))
			restoreStock(order);
		orders.delete(order);
	}
	private void restoreStock(OrderEntity order) {
		for (OrderItem item : order.items) {
			Product product = item.product;
			product.setStock(product.getStock() + item.quantity);
			products.save(product);
		}
	}
	private OrderEntity get(Long id) {
		return orders.findById(id).orElseThrow(() -> new NotFoundException("Không tìm thấy đơn hàng"));
	}
}
