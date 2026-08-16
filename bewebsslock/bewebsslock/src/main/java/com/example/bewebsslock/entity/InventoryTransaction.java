package com.example.bewebsslock.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class InventoryTransaction {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	public Long id;
	@ManyToOne(optional = false)
	public Product product;
	public int quantity;
	public String type, note;
	public LocalDateTime createdAt = LocalDateTime.now();
}
