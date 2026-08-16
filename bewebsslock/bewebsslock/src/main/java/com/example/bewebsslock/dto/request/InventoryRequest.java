package com.example.bewebsslock.dto.request;
import jakarta.validation.constraints.*;
public class InventoryRequest {
	@NotNull
	public Long productId;
	@NotBlank
	public String type;
	@Positive
	public int quantity;
	public String note;
}
