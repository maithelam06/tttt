package com.example.bewebsslock.mapper;

import com.example.bewebsslock.dto.request.ProductRequest;
import com.example.bewebsslock.dto.response.ProductResponse;
import com.example.bewebsslock.entity.Product;

public interface ProductMapper {
	Product toEntity(ProductRequest request);
	void update(ProductRequest request, Product product);
	ProductResponse toResponse(Product product);
}
