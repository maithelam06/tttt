package com.example.bewebsslock.dto.request;
import jakarta.validation.constraints.*;
import java.time.LocalDate;
public class WarrantyRequest {
	@NotNull
	public Long productId, customerId;
	public String serialNumber;
	@NotNull
	public LocalDate purchaseDate;
}
