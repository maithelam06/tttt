package com.example.bewebsslock.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
public class OrderItem {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	public Long id;
	@ManyToOne(optional = false)
	public Product product;
	public int quantity;
	public BigDecimal price;
}
