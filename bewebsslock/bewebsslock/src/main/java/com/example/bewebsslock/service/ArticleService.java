package com.example.bewebsslock.service;

import com.example.bewebsslock.dto.request.ArticleRequest;
import com.example.bewebsslock.entity.Article;
import com.example.bewebsslock.enums.ArticleType;
import com.example.bewebsslock.exception.NotFoundException;
import com.example.bewebsslock.repository.ArticleRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ArticleService {
	private final ArticleRepository repository;
	public ArticleService(ArticleRepository repository) {
		this.repository = repository;
	}
	public List<Article> findAll(ArticleType type) {
		return type == null ? repository.findAll() : repository.findByTypeAndPublishedTrueOrderByCreatedAtDesc(type);
	}
	public Article findOne(Long id) {
		return get(id);
	}
	public Article create(ArticleRequest r) {
		return repository.save(map(new Article(), r));
	}
	public Article update(Long id, ArticleRequest r) {
		return repository.save(map(get(id), r));
	}
	public void delete(Long id) {
		repository.delete(get(id));
	}
	private Article get(Long id) {
		return repository.findById(id).orElseThrow(() -> new NotFoundException("Không tìm thấy bài viết"));
	}
	private Article map(Article a, ArticleRequest r) {
		a.setTitle(r.getTitle());
		a.setSummary(r.getSummary());
		a.setContent(r.getContent());
		a.setImageUrl(r.getImageUrl());
		a.setType(r.getType());
		a.setPublished(r.isPublished());
		return a;
	}
}
