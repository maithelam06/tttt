package com.example.bewebsslock.dto.response;

import java.math.BigDecimal;
import java.util.Set;

public class ProductResponse {
	private final Long id;
	private final String sku, name, brand, status, doorType, material, app;
	private final String installPolicy, imageUrl, description, categoryName;
	private final BigDecimal price;
	private final int stock, warrantyMonths;
	private final Set<String> features;
	private final Long categoryId;

	public ProductResponse(Long id, String sku, String name, String brand, BigDecimal price, int stock, String status,
			int warrantyMonths, String doorType, String material, String app, String installPolicy, String imageUrl,
			String description, Set<String> features, Long categoryId, String categoryName) {
		this.id = id;
		this.sku = sku;
		this.name = name;
		this.brand = brand;
		this.price = price;
		this.stock = stock;
		this.status = status;
		this.warrantyMonths = warrantyMonths;
		this.doorType = doorType;
		this.material = material;
		this.app = app;
		this.installPolicy = installPolicy;
		this.imageUrl = imageUrl;
		this.description = description;
		this.features = features;
		this.categoryId = categoryId;
		this.categoryName = categoryName;
	}

	public Long getId() {
		return id;
	}
	public String getSku() {
		return sku;
	}
	public String getName() {
		return name;
	}
	public String getBrand() {
		return brand;
	}
	public BigDecimal getPrice() {
		return price;
	}
	public int getStock() {
		return stock;
	}
	public String getStatus() {
		return status;
	}
	public int getWarrantyMonths() {
		return warrantyMonths;
	}
	public String getDoorType() {
		return doorType;
	}
	public String getMaterial() {
		return material;
	}
	public String getApp() {
		return app;
	}
	public String getInstallPolicy() {
		return installPolicy;
	}
	public String getImageUrl() {
		return imageUrl;
	}
	public String getDescription() {
		return description;
	}
	public Set<String> getFeatures() {
		return features;
	}
	public Long getCategoryId() {
		return categoryId;
	}
	public String getCategoryName() {
		return categoryName;
	}
}
