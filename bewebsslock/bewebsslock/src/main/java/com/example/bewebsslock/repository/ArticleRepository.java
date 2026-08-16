package com.example.bewebsslock.repository;

import com.example.bewebsslock.entity.Article;
import com.example.bewebsslock.enums.ArticleType;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ArticleRepository extends JpaRepository<Article, Long> {
	List<Article> findByTypeAndPublishedTrueOrderByCreatedAtDesc(ArticleType type);
}
