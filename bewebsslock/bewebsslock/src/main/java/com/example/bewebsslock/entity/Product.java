package com.example.bewebsslock.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.*;

@Entity
public class Product {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@Column(nullable = false, unique = true)
	private String sku;
	@Column(nullable = false)
	private String name;
	private String brand;
	private BigDecimal price = BigDecimal.ZERO;
	private int stock;
	private String status;
	private int warrantyMonths;
	private String doorType;
	private String material;
	private String app;
	private String installPolicy;
	@Column(columnDefinition = "LONGTEXT")
	private String imageUrl;
	private String serialNumber;
	@Column(length = 2000)
	private String description;
	@ElementCollection(fetch = FetchType.EAGER)
	private Set<String> features = new LinkedHashSet<>();
	@ManyToOne(optional = false)
	private Category category;

	public Product() {
	}
	public String getSerialNumber() {
		return serialNumber;
	}
	public void setSerialNumber(String serialNumber) {
		this.serialNumber = serialNumber;
	}
	public Long getId() {
		return id;
	}
	public String getSku() {
		return sku;
	}
	public void setSku(String sku) {
		this.sku = sku;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getBrand() {
		return brand;
	}
	public void setBrand(String brand) {
		this.brand = brand;
	}
	public BigDecimal getPrice() {
		return price;
	}
	public void setPrice(BigDecimal price) {
		this.price = price;
	}
	public int getStock() {
		return stock;
	}
	public void setStock(int stock) {
		this.stock = stock;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public int getWarrantyMonths() {
		return warrantyMonths;
	}
	public void setWarrantyMonths(int value) {
		warrantyMonths = value;
	}
	public String getDoorType() {
		return doorType;
	}
	public void setDoorType(String doorType) {
		this.doorType = doorType;
	}
	public String getMaterial() {
		return material;
	}
	public void setMaterial(String material) {
		this.material = material;
	}
	public String getApp() {
		return app;
	}
	public void setApp(String app) {
		this.app = app;
	}
	public String getInstallPolicy() {
		return installPolicy;
	}
	public void setInstallPolicy(String value) {
		installPolicy = value;
	}
	public String getImageUrl() {
		return imageUrl;
	}
	public void setImageUrl(String imageUrl) {
		this.imageUrl = imageUrl;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public Set<String> getFeatures() {
		return features;
	}
	public void setFeatures(Set<String> features) {
		this.features = features;
	}
	public Category getCategory() {
		return category;
	}
	public void setCategory(Category category) {
		this.category = category;
	}
}
