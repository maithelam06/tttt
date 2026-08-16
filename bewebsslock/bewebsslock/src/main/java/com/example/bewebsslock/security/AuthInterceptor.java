package com.example.bewebsslock.security;
import com.example.bewebsslock.dto.response.LoginResponse;
import jakarta.servlet.http.*;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
@Component
public class AuthInterceptor implements HandlerInterceptor {
	private final SessionService sessions;
	public AuthInterceptor(SessionService sessions) {
		this.sessions = sessions;
	}
	@Override
	public boolean preHandle(HttpServletRequest req, HttpServletResponse res, Object handler) throws Exception {
		String path = req.getRequestURI();
		String method = req.getMethod();
		if (path.equals("/api/auth/login") || path.contains("/verify/")
				|| (HttpMethod.GET.matches(method) && (path.startsWith("/api/products")
						|| path.startsWith("/api/categories") || path.startsWith("/api/articles")
						|| path.equals("/api/requests/track")))
				|| (HttpMethod.POST.matches(method) && (path.equals("/api/requests") || path.equals("/api/subscribers"))))
			return true;
		LoginResponse user = sessions.find(req.getHeader("X-Auth-Token"));
		if (user == null) {
			res.sendError(401, "Bạn chưa đăng nhập");
			return false;
		}
		boolean adminOnly = path.startsWith("/api/staff") || path.startsWith("/api/brands")
				|| (path.startsWith("/api/technicians") && !HttpMethod.GET.matches(method) && !path.contains("/status"))
				|| path.startsWith("/api/categories")
				|| HttpMethod.DELETE.matches(method);
		if (adminOnly && !"ADMIN".equals(user.getRole())) {
			res.sendError(403, "Bạn không có quyền");
			return false;
		}
		return true;
	}
}
