package com.example.bewebsslock.mapper;

import com.example.bewebsslock.dto.request.ProductRequest;
import com.example.bewebsslock.dto.response.ProductResponse;
import com.example.bewebsslock.entity.Product;
import org.springframework.stereotype.Component;
import java.util.LinkedHashSet;

@Component
public class ProductMapperImpl implements ProductMapper {
	@Override
	public Product toEntity(ProductRequest request) {
		Product product = new Product();
		update(request, product);
		return product;
	}

	@Override
	public void update(ProductRequest r, Product p) {
		p.setSku(r.getSku());
		p.setName(r.getName());
		p.setBrand(r.getBrand());
		p.setPrice(r.getPrice());
		p.setStock(r.getStock());
		p.setStatus(r.getStatus());
		p.setWarrantyMonths(r.getWarrantyMonths());
		p.setDoorType(r.getDoorType());
		p.setMaterial(r.getMaterial());
		p.setApp(r.getApp());
		p.setInstallPolicy(r.getInstallPolicy());
		p.setImageUrl(r.getImageUrl());
		p.setDescription(r.getDescription());
		p.setFeatures(r.getFeatures() == null ? new LinkedHashSet<>() : r.getFeatures());
	}

	@Override
	public ProductResponse toResponse(Product p) {
		return new ProductResponse(p.getId(), p.getSku(), p.getName(), p.getBrand(), p.getPrice(), p.getStock(),
				p.getStatus(), p.getWarrantyMonths(), p.getDoorType(), p.getMaterial(), p.getApp(),
				p.getInstallPolicy(), p.getImageUrl(), p.getDescription(), p.getFeatures(), p.getCategory().getId(),
				p.getCategory().getName());
	}
}
