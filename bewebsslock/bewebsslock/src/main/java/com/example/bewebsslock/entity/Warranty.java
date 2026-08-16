package com.example.bewebsslock.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class Warranty {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	public Long id;
	@Column(nullable = false, unique = true)
	public String code;
	@Column(unique = true)
	public String serialNumber;
	@ManyToOne
	public Product product;
	@ManyToOne(optional = false)
	public Customer customer;
	public LocalDate purchaseDate, expiresAt;
	public String status = "ACTIVE";
	@Column(length = 5000)
	public String repairHistory;
}
