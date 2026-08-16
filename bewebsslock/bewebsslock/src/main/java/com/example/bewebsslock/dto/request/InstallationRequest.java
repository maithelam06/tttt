package com.example.bewebsslock.dto.request;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;
public class InstallationRequest {
	@NotNull
	public Long productId, customerId;
	public Long technicianId;
	@NotBlank
	public String address;
	public LocalDateTime appointmentAt;
	public String note, doorImageUrl;
}
