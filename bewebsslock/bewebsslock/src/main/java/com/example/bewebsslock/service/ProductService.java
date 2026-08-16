package com.example.bewebsslock.service;

import com.example.bewebsslock.dto.request.ProductRequest;
import com.example.bewebsslock.dto.response.ProductResponse;
import com.example.bewebsslock.entity.*;
import com.example.bewebsslock.exception.NotFoundException;
import com.example.bewebsslock.mapper.ProductMapper;
import com.example.bewebsslock.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {
	private final ProductRepository products;
	private final CategoryRepository categories;
	private final ProductMapper mapper;
	private final InstallationRepository installations;
	private final CustomerRequestRepository customerRequests;
	private final WarrantyRepository warranties;

	public ProductService(
			ProductRepository products,
			CategoryRepository categories,
			ProductMapper mapper,
			InstallationRepository installations,
			CustomerRequestRepository customerRequests,
			WarrantyRepository warranties
	) {
		this.products = products;
		this.categories = categories;
		this.mapper = mapper;
		this.installations = installations;
		this.customerRequests = customerRequests;
		this.warranties = warranties;
	}

	public List<ProductResponse> findAll(String keyword) {
		List<Product> data = keyword == null || keyword.isBlank()
				? products.findAll()
				: products.findByNameContainingIgnoreCaseOrSkuContainingIgnoreCase(keyword, keyword);
		return data.stream().map(mapper::toResponse).collect(Collectors.toList());
	}

	public ProductResponse findById(Long id) {
		return mapper.toResponse(get(id));
	}

	public List<ProductResponse> recommend(String doorType, String feature, java.math.BigDecimal maxPrice) {
		return products.findAll().stream().filter(p -> doorType == null || doorType.equalsIgnoreCase(p.getDoorType()))
				.filter(p -> feature == null || p.getFeatures().contains(feature))
				.filter(p -> maxPrice == null || p.getPrice().compareTo(maxPrice) <= 0).limit(3).map(mapper::toResponse)
				.collect(Collectors.toList());
	}

	@Transactional
	public ProductResponse create(ProductRequest request) {
		Product product = mapper.toEntity(request);
		product.setCategory(getCategory(request.getCategoryId()));
		return mapper.toResponse(products.save(product));
	}

	@Transactional
	public ProductResponse update(Long id, ProductRequest request) {
		Product product = get(id);
		mapper.update(request, product);
		product.setCategory(getCategory(request.getCategoryId()));
		return mapper.toResponse(products.save(product));
	}

	@Transactional
	public void delete(Long id) {
		Product product = get(id);
		try {
			installations.deleteByProductId(id);
		} catch (Exception ignored) {}
		try {
			customerRequests.unlinkProduct(id);
		} catch (Exception ignored) {}
		try {
			warranties.deleteByProductId(id);
		} catch (Exception ignored) {}
		products.delete(product);
	}

	private Product get(Long id) {
		return products.findById(id).orElseThrow(() -> new NotFoundException("Không tìm thấy sản phẩm"));
	}

	private Category getCategory(Long id) {
		return categories.findById(id).orElseThrow(() -> new NotFoundException("Không tìm thấy danh mục"));
	}
}
