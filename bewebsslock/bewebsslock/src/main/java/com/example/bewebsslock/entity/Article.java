package com.example.bewebsslock.entity;

import com.example.bewebsslock.enums.ArticleType;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Article {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@Column(nullable = false)
	private String title;
	@Column(length = 1000)
	private String summary;
	@Column(length = 10000)
	private String content;
	private String imageUrl;
	@Enumerated(EnumType.STRING)
	private ArticleType type;
	private boolean published = true;
	private LocalDateTime createdAt = LocalDateTime.now();

	public Article() {
	}
	public Long getId() {
		return id;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getSummary() {
		return summary;
	}
	public void setSummary(String summary) {
		this.summary = summary;
	}
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
	public String getImageUrl() {
		return imageUrl;
	}
	public void setImageUrl(String imageUrl) {
		this.imageUrl = imageUrl;
	}
	public ArticleType getType() {
		return type;
	}
	public void setType(ArticleType type) {
		this.type = type;
	}
	public boolean isPublished() {
		return published;
	}
	public void setPublished(boolean published) {
		this.published = published;
	}
	public LocalDateTime getCreatedAt() {
		return createdAt;
	}
}
