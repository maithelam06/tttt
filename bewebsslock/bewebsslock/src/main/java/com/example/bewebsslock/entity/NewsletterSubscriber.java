package com.example.bewebsslock.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class NewsletterSubscriber {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, unique = true)
	private String email;

	private LocalDateTime subscribedAt = LocalDateTime.now();
	private boolean active = true;

	public NewsletterSubscriber() {}

	public NewsletterSubscriber(String email) {
		this.email = email;
	}

	public Long getId() {
		return id;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public LocalDateTime getSubscribedAt() {
		return subscribedAt;
	}

	public void setSubscribedAt(LocalDateTime subscribedAt) {
		this.subscribedAt = subscribedAt;
	}

	public boolean isActive() {
		return active;
	}

	public void setActive(boolean active) {
		this.active = active;
	}
}
