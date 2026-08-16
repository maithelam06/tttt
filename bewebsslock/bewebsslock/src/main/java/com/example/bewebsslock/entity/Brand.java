package com.example.bewebsslock.entity;

import jakarta.persistence.*;

@Entity
public class Brand {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	public Long id;
	@Column(nullable = false, unique = true)
	public String name;
	public String country, logoUrl, description;
	public boolean active = true;
}
