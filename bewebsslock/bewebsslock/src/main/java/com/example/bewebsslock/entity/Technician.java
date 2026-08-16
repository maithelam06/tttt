package com.example.bewebsslock.entity;

import jakarta.persistence.*;

@Entity
public class Technician {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	public Long id;

	@Column(nullable = false)
	public String fullName;

	@Column(nullable = false)
	public String phone;

	@Column(unique = true)
	private String username;
	private String password;

	public String area;
	public String skill;
	public String status = "AVAILABLE";

	public Technician() {}

	public Technician(Long id, String fullName, String phone, String username, String password, String area, String skill, String status) {
		this.id = id;
		this.fullName = fullName;
		this.phone = phone;
		this.username = username;
		this.password = password;
		this.area = area;
		this.skill = skill;
		this.status = status;
	}

	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}

	public String getFullName() {
		return fullName;
	}
	public void setFullName(String fullName) {
		this.fullName = fullName;
	}

	public String getPhone() {
		return phone;
	}
	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}

	public String getArea() {
		return area;
	}
	public void setArea(String area) {
		this.area = area;
	}

	public String getSkill() {
		return skill;
	}
	public void setSkill(String skill) {
		this.skill = skill;
	}

	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
}
