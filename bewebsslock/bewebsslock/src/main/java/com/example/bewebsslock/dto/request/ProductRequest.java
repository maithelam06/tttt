package com.example.bewebsslock.dto.request;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.util.Set;

public class ProductRequest {
	private String sku;
	@NotBlank
	private String name;
	private String brand, status, doorType, material, app, serialNumber;
	private String installPolicy, imageUrl, description;
	@PositiveOrZero
	private BigDecimal price;
	@PositiveOrZero
	private int stock, warrantyMonths;
	private Set<String> features;
	@NotNull
	private Long categoryId;

	public ProductRequest() {
	}
	public String getSku() {
		return sku;
	}
	public void setSku(String v) {
		sku = v;
	}
	public String getName() {
		return name;
	}
	public void setName(String v) {
		name = v;
	}
	public String getBrand() {
		return brand;
	}
	public void setBrand(String v) {
		brand = v;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String v) {
		status = v;
	}
	public String getDoorType() {
		return doorType;
	}
	public void setDoorType(String v) {
		doorType = v;
	}
	public String getMaterial() {
		return material;
	}
	public void setMaterial(String v) {
		material = v;
	}
	public String getApp() {
		return app;
	}
	public void setApp(String v) {
		app = v;
	}
	public String getSerialNumber() {
		return serialNumber;
	}
	public void setSerialNumber(String v) {
		serialNumber = v;
	}
	public String getInstallPolicy() {
		return installPolicy;
	}
	public void setInstallPolicy(String v) {
		installPolicy = v;
	}
	public String getImageUrl() {
		return imageUrl;
	}
	public void setImageUrl(String v) {
		imageUrl = v;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String v) {
		description = v;
	}
	public BigDecimal getPrice() {
		return price;
	}
	public void setPrice(BigDecimal v) {
		price = v;
	}
	public int getStock() {
		return stock;
	}
	public void setStock(int v) {
		stock = v;
	}
	public int getWarrantyMonths() {
		return warrantyMonths;
	}
	public void setWarrantyMonths(int v) {
		warrantyMonths = v;
	}
	public Set<String> getFeatures() {
		return features;
	}
	public void setFeatures(Set<String> v) {
		features = v;
	}
	public Long getCategoryId() {
		return categoryId;
	}
	public void setCategoryId(Long v) {
		categoryId = v;
	}
}
