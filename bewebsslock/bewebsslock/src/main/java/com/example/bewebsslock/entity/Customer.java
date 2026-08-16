package com.example.bewebsslock.entity;

import jakarta.persistence.*;

@Entity
public class Customer {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	public Long id;
	@Column(nullable = false)
	public String fullName;
	@Column(nullable = false, unique = true)
	public String phone;
	public String email, address, note;
}
