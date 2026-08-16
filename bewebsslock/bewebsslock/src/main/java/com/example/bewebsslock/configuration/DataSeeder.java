package com.example.bewebsslock.configuration;

import com.example.bewebsslock.entity.*;
import com.example.bewebsslock.enums.Role;
import com.example.bewebsslock.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.math.BigDecimal;
import java.util.Set;

@Configuration
public class DataSeeder {
	@Bean
	CommandLineRunner seed(
			CategoryRepository categories,
			ProductRepository products,
			AppUserRepository users,
			TechnicianRepository technicians,
			NewsletterSubscriberRepository subscribers,
			PasswordEncoder encoder) {
		return args -> {
			if (subscribers.count() == 0) {
				subscribers.save(new NewsletterSubscriber("sslock.vn@gmail.com"));
				subscribers.save(new NewsletterSubscriber("khachhang.demo@gmail.com"));
				subscribers.save(new NewsletterSubscriber("nguyenvana.hanoi@gmail.com"));
				subscribers.save(new NewsletterSubscriber("tranvanb.hcm@gmail.com"));
			}
			// Seed Users if not present
			if (users.count() == 0) {
				users.save(user("admin", "admin123", "Quản trị viên", Role.ADMIN, encoder));
				users.save(user("nhanvien", "staff123", "Nhân viên tư vấn & điều phối", Role.STAFF, encoder));
				users.save(user("kythuat1", "tech123", "Mai Thế Lâm (Kỹ thuật Hà Nội)", Role.TECHNICIAN, encoder));
				users.save(user("kythuat2", "tech123", "Nguyễn Văn Hùng (Kỹ thuật HCM)", Role.TECHNICIAN, encoder));
			}

			// Seed Categories & Products
			if (categories.count() == 0) {
				Category smart = category("SMART", "Khóa cửa thông minh");
				categories.save(smart);
				products.save(product(smart));
			}

			// Seed Technicians with username and password
			if (technicians.count() == 0) {
				technicians.save(new Technician(null, "Mai Thế Lâm", "0962509536", "kythuat1", "tech123", "Hà Nội", "Lắp đặt & Bảo hành", "AVAILABLE"));
				technicians.save(new Technician(null, "Nguyễn Văn Hùng", "0912345678", "kythuat2", "tech123", "Hồ Chí Minh", "Chuyên khóa Face ID", "AVAILABLE"));
				technicians.save(new Technician(null, "Trần Quốc Tuấn", "0987654321", "kythuat3", "tech123", "Đà Nẵng", "Lắp đặt khóa khách sạn", "AVAILABLE"));
			}
		};
	}

	private AppUser user(String name, String pass, String fullName, Role role, PasswordEncoder encoder) {
		AppUser u = new AppUser();
		u.setUsername(name);
		u.setPassword(encoder.encode(pass));
		u.setFullName(fullName);
		u.setRole(role);
		return u;
	}
	private Category category(String code, String name) {
		Category c = new Category();
		c.setCode(code);
		c.setName(name);
		c.setActive(true);
		return c;
	}
	private Product product(Category category) {
		Product p = new Product();
		p.setSku("KDS-K20PM");
		p.setName("Kaadas K20 Pro Max");
		p.setBrand("Kaadas");
		p.setPrice(new BigDecimal("16800000"));
		p.setStock(8);
		p.setStatus("Đang bán");
		p.setWarrantyMonths(24);
		p.setDoorType("Cửa gỗ");
		p.setFeatures(Set.of("Vân tay", "Mã số", "Face ID", "Camera"));
		p.setCategory(category);
		return p;
	}
}
