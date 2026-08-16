package com.example.bewebsslock.dto.request;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;
public class QuoteRequest {
	@NotNull
	public Long customerId;
	@PositiveOrZero
	public BigDecimal total;
	public String content;
	public LocalDate validUntil;
}
