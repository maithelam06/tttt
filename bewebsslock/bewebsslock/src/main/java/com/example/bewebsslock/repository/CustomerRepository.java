package com.example.bewebsslock.repository;
import com.example.bewebsslock.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
public interface CustomerRepository extends JpaRepository<Customer, Long> {
}
