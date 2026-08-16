package com.example.bewebsslock.controller;

import com.example.bewebsslock.entity.NewsletterSubscriber;
import com.example.bewebsslock.repository.NewsletterSubscriberRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/subscribers")
public class NewsletterSubscriberController {

	private final NewsletterSubscriberRepository repository;
	private final JavaMailSender mailSender;

	@Value("${spring.mail.username:lam1871231@gmail.com}")
	private String fromEmail;

	public NewsletterSubscriberController(NewsletterSubscriberRepository repository, JavaMailSender mailSender) {
		this.repository = repository;
		this.mailSender = mailSender;
	}

	@GetMapping
	public List<NewsletterSubscriber> getAll() {
		return repository.findAll();
	}

	@PostMapping
	public ResponseEntity<?> subscribe(@RequestBody Map<String, String> body) {
		String email = body.get("email");
		if (email == null || email.isBlank() || !email.contains("@")) {
			return ResponseEntity.badRequest().body(Map.of("message", "Email không hợp lệ!"));
		}
		email = email.trim().toLowerCase();
		if (repository.existsByEmail(email)) {
			return ResponseEntity.ok(Map.of("message", "Email đã đăng ký từ trước!", "email", email));
		}
		NewsletterSubscriber subscriber = repository.save(new NewsletterSubscriber(email));
		return ResponseEntity.ok(subscriber);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<?> delete(@PathVariable Long id) {
		repository.deleteById(id);
		return ResponseEntity.ok(Map.of("message", "Đã xóa email khỏi danh sách!"));
	}

	@PostMapping("/broadcast")
	public ResponseEntity<?> broadcast(@RequestBody Map<String, String> body) {
		String subject = body.getOrDefault("subject", "Thông tin ưu đãi từ SSLock");
		String content = body.getOrDefault("content", "");
		List<NewsletterSubscriber> all = repository.findAll();
		int sentCount = 0;
		List<String> logs = new ArrayList<>();

		for (NewsletterSubscriber sub : all) {
			try {
				SimpleMailMessage message = new SimpleMailMessage();
				message.setFrom(fromEmail);
				message.setTo(sub.getEmail());
				message.setSubject(subject);
				message.setText(content);
				mailSender.send(message);
				sentCount++;
				logs.add("✅ Đã gửi thành công tới: " + sub.getEmail());
			} catch (Exception e) {
				logs.add("❌ Lỗi gửi tới " + sub.getEmail() + ": " + e.getMessage());
			}
		}

		return ResponseEntity.ok(Map.of(
				"status", "SUCCESS",
				"message", "Đã gửi mail thực tế thành công tới " + sentCount + "/" + all.size() + " email!",
				"sentCount", sentCount,
				"totalCount", all.size(),
				"logs", logs
		));
	}
}
