package com.example.bewebsslock.dto.request;

import com.example.bewebsslock.enums.ArticleType;
import jakarta.validation.constraints.*;

public class ArticleRequest {
	@NotBlank
	private String title;
	private String summary, content, imageUrl;
	@NotNull
	private ArticleType type;
	private boolean published;
	public ArticleRequest() {
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String v) {
		title = v;
	}
	public String getSummary() {
		return summary;
	}
	public void setSummary(String v) {
		summary = v;
	}
	public String getContent() {
		return content;
	}
	public void setContent(String v) {
		content = v;
	}
	public String getImageUrl() {
		return imageUrl;
	}
	public void setImageUrl(String v) {
		imageUrl = v;
	}
	public ArticleType getType() {
		return type;
	}
	public void setType(ArticleType v) {
		type = v;
	}
	public boolean isPublished() {
		return published;
	}
	public void setPublished(boolean v) {
		published = v;
	}
}
