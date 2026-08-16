package com.example.bewebsslock.repository;
import com.example.bewebsslock.entity.OrderEntity;
import org.springframework.data.jpa.repository.*;
import java.math.BigDecimal;
import java.util.List;
public interface OrderRepository extends JpaRepository<OrderEntity, Long> {
	@Query("select coalesce(sum(o.total), 0) from OrderEntity o where o.status <> 'CANCELLED'")
	BigDecimal totalRevenue();
	List<OrderEntity> findTop5ByOrderByCreatedAtDesc();
}
