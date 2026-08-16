package com.example.bewebsslock.configuration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.servlet.config.annotation.*;
import com.example.bewebsslock.security.AuthInterceptor;

@Configuration
public class WebConfig implements WebMvcConfigurer {
	@Value("${app.cors-origin}")
	private String origin;
	private final AuthInterceptor auth;
	public WebConfig(AuthInterceptor auth) {
		this.auth = auth;
	}
	@Bean
	PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
	@Override
	public void addCorsMappings(CorsRegistry registry) {
		registry.addMapping("/api/**").allowedOrigins(origin).allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE")
				.allowedHeaders("*");
	}
	@Override
	public void addInterceptors(InterceptorRegistry registry) {
		registry.addInterceptor(auth).addPathPatterns("/api/**");
	}
}
