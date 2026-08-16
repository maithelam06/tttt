package com.example.bewebsslock.repository;

import com.example.bewebsslock.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}
