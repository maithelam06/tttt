package com.example.bewebsslock.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.*;

@Entity
public class Quote {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	public Long id;
	@Column(nullable = false, unique = true)
	public String code;
	@ManyToOne(optional = false)
	public Customer customer;
	public BigDecimal total = BigDecimal.ZERO;
	public String content, status = "DRAFT";
	public LocalDate validUntil;
	public LocalDateTime createdAt = LocalDateTime.now();
}
