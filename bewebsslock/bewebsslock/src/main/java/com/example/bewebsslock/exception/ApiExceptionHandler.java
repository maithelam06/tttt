package com.example.bewebsslock.exception;

import org.springframework.http.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.dao.DataIntegrityViolationException;
import java.time.LocalDateTime;
import java.util.Map;

@RestControllerAdvice
public class ApiExceptionHandler {
	@ExceptionHandler(NotFoundException.class)
	ResponseEntity<?> notFound(NotFoundException ex) {
		return error(HttpStatus.NOT_FOUND, ex.getMessage());
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	ResponseEntity<?> invalid(MethodArgumentNotValidException ex) {
		String message = ex.getBindingResult().getFieldErrors().get(0).getDefaultMessage();
		return error(HttpStatus.BAD_REQUEST, message);
	}

	@ExceptionHandler(IllegalArgumentException.class)
	ResponseEntity<?> badRequest(IllegalArgumentException ex) {
		return error(HttpStatus.BAD_REQUEST, ex.getMessage());
	}

	@ExceptionHandler(DataIntegrityViolationException.class)
	ResponseEntity<?> conflict(DataIntegrityViolationException ex) {
		return error(HttpStatus.CONFLICT, "Dữ liệu bị trùng hoặc đang được sử dụng");
	}

	@ExceptionHandler(Exception.class)
	ResponseEntity<?> general(Exception ex) {
		String msg = ex.getMessage() != null ? ex.getMessage() : ex.getClass().getSimpleName();
		return error(HttpStatus.INTERNAL_SERVER_ERROR, msg);
	}

	private ResponseEntity<?> error(HttpStatus status, String message) {
		return ResponseEntity.status(status).body(
				Map.of("status", status.value(), "message", message, "timestamp", LocalDateTime.now().toString()));
	}
}
