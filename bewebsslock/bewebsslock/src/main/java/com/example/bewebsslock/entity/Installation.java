package com.example.bewebsslock.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Installation {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	public Long id;
	@ManyToOne
	public Product product;
	@ManyToOne(optional = false)
	public Customer customer;
	@ManyToOne
	public Technician technician;
	@Column(nullable = false)
	public String address;
	public LocalDateTime appointmentAt;
	public String status = "PENDING", note, doorImageUrl;
}
