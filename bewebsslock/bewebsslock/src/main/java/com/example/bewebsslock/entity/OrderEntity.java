package com.example.bewebsslock.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Entity
@Table(name = "orders")
public class OrderEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	public Long id;
	@Column(nullable = false, unique = true)
	public String code;
	@ManyToOne(optional = false)
	public Customer customer;
	@OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
	@JoinColumn(name = "order_id")
	public List<OrderItem> items = new ArrayList<>();
	public BigDecimal total = BigDecimal.ZERO;
	public String status = "PENDING", note;
	public LocalDateTime createdAt = LocalDateTime.now();
}
