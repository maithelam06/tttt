package com.example.bewebsslock.dto.request;

import jakarta.validation.constraints.NotBlank;

public class CategoryRequest {
	@NotBlank
	private String code;
	@NotBlank
	private String name;
	private String description;
	private boolean active;
	public CategoryRequest() {
	}
	public String getCode() {
		return code;
	}
	public void setCode(String v) {
		code = v;
	}
	public String getName() {
		return name;
	}
	public void setName(String v) {
		name = v;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String v) {
		description = v;
	}
	public boolean isActive() {
		return active;
	}
	public void setActive(boolean v) {
		active = v;
	}
}
