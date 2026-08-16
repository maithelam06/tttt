package com.example.bewebsslock.repository;

import com.example.bewebsslock.entity.CustomerRequest;
import com.example.bewebsslock.enums.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CustomerRequestRepository extends JpaRepository<CustomerRequest, Long> {

	long countByStatus(RequestStatus status);

	/** Tìm theo code phiếu (chính xác) */
	Optional<CustomerRequest> findByCode(String code);

	/** Tra cứu cho khách: tìm theo SĐT hoặc mã phiếu */
	@Query("SELECT r FROM CustomerRequest r WHERE r.phone = :q OR r.code = :q ORDER BY r.createdAt DESC")
	List<CustomerRequest> trackByPhoneOrCode(@Param("q") String query);

	@Modifying
	@Query("UPDATE CustomerRequest r SET r.product = null WHERE r.product.id = :productId")
	void unlinkProduct(@Param("productId") Long productId);
}
