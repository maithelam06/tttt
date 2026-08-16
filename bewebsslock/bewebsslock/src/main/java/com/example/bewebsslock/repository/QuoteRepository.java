package com.example.bewebsslock.repository;
import com.example.bewebsslock.entity.Quote;
import org.springframework.data.jpa.repository.JpaRepository;
public interface QuoteRepository extends JpaRepository<Quote, Long> {
}
