package com.example.bewebsslock.repository;

import com.example.bewebsslock.entity.Installation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;

public interface InstallationRepository extends JpaRepository<Installation, Long> {
	long countByAppointmentAtBetween(LocalDateTime from, LocalDateTime to);
	long countByStatus(String status);

	@Modifying
	@Query("DELETE FROM Installation i WHERE i.product.id = :productId")
	void deleteByProductId(@Param("productId") Long productId);

	@Modifying
	@Query("UPDATE Installation i SET i.product = null WHERE i.product.id = :productId")
	void unlinkProduct(@Param("productId") Long productId);
}
