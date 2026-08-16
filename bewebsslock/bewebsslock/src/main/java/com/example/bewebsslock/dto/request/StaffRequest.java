package com.example.bewebsslock.dto.request;
import com.example.bewebsslock.enums.Role;
import jakarta.validation.constraints.*;
public class StaffRequest {
	@NotBlank
	public String username, password, fullName;
	@NotNull
	public Role role;
}
