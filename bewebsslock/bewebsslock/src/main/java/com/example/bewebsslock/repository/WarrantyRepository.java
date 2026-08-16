package com.example.bewebsslock.repository;

import com.example.bewebsslock.entity.Warranty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface WarrantyRepository extends JpaRepository<Warranty, Long> {
	Optional<Warranty> findByCode(String code);
	Optional<Warranty> findBySerialNumber(String serialNumber);
	boolean existsBySerialNumber(String serialNumber);
	long countByStatus(String status);

	@Query("SELECT w FROM Warranty w WHERE LOWER(w.code) = LOWER(:q) OR LOWER(w.serialNumber) = LOWER(:q) OR w.customer.phone = :q")
	List<Warranty> searchPublic(@Param("q") String q);

	@Modifying
	@Query("DELETE FROM Warranty w WHERE w.product.id = :productId")
	void deleteByProductId(@Param("productId") Long productId);

	@Modifying
	@Query("UPDATE Warranty w SET w.product = null WHERE w.product.id = :productId")
	void unlinkProduct(@Param("productId") Long productId);
}
