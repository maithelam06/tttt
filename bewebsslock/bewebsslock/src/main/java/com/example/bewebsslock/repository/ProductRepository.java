package com.example.bewebsslock.repository;

import com.example.bewebsslock.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
	List<Product> findByNameContainingIgnoreCaseOrSkuContainingIgnoreCase(String name, String sku);
	List<Product> findTop5ByStockLessThanOrderByStockAsc(int stock);
}
