package com.example.bewebsslock.repository;
import com.example.bewebsslock.entity.*;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import java.util.List;
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
	@Query("select i.product from OrderItem i group by i.product order by sum(i.quantity) desc")
	List<Product> bestSelling(Pageable pageable);
}
