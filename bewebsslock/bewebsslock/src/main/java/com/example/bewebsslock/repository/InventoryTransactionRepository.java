package com.example.bewebsslock.repository;
import com.example.bewebsslock.entity.InventoryTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
public interface InventoryTransactionRepository extends JpaRepository<InventoryTransaction, Long> {
}
