package com.example.bewebsslock.service;
import com.example.bewebsslock.repository.*;
import com.example.bewebsslock.entity.OrderEntity;
import com.example.bewebsslock.enums.RequestStatus;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.PageRequest;
import java.time.*;
import java.util.*;
@Service
public class DashboardService {
	private final ProductRepository products;
	private final OrderRepository orders;
	private final OrderItemRepository items;
	private final InstallationRepository installations;
	private final WarrantyRepository warranties;
	private final CustomerRepository customers;
	private final CustomerRequestRepository requests;
	public DashboardService(ProductRepository p, OrderRepository o, OrderItemRepository it, InstallationRepository i,
			WarrantyRepository w, CustomerRepository c, CustomerRequestRepository r) {
		products = p;
		orders = o;
		items = it;
		installations = i;
		warranties = w;
		customers = c;
		requests = r;
	}
	public Map<String, Object> summary() {
		LocalDate today = LocalDate.now();
		Map<String, Object> x = new LinkedHashMap<>();
		x.put("totalProducts", products.count());
		x.put("totalOrders", orders.count());
		x.put("totalCustomers", customers.count());
		x.put("revenue", orders.totalRevenue());
		x.put("lowStockProducts", products.findTop5ByStockLessThanOrderByStockAsc(10));
		x.put("bestSellingProducts", items.bestSelling(PageRequest.of(0, 5)));
		x.put("todayInstallations",
				installations.countByAppointmentAtBetween(today.atStartOfDay(), today.plusDays(1).atStartOfDay()));
		x.put("pendingWarranties", warranties.countByStatus("PENDING"));
		x.put("pendingRequests", requests.countByStatus(RequestStatus.PENDING));
		x.put("unassignedInstallations", installations.countByStatus("PENDING"));
		x.put("recentOrders", orders.findTop5ByOrderByCreatedAtDesc());
		x.put("monthlyRevenue", monthlyRevenue(orders.findAll(), today.getYear()));
		return x;
	}
	private List<Map<String, Object>> monthlyRevenue(List<OrderEntity> data, int year) {
		List<Map<String, Object>> result = new ArrayList<>();
		for (int month = 1; month <= 12; month++) {
			final int targetMonth = month;
			java.math.BigDecimal total = data.stream()
					.filter(o -> o.createdAt != null && o.createdAt.getYear() == year
							&& o.createdAt.getMonthValue() == targetMonth && !"CANCELLED".equals(o.status))
					.map(o -> o.total == null ? java.math.BigDecimal.ZERO : o.total)
					.reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add);
			Map<String, Object> point = new LinkedHashMap<>();
			point.put("month", month);
			point.put("revenue", total);
			result.add(point);
		}
		return result;
	}
}
