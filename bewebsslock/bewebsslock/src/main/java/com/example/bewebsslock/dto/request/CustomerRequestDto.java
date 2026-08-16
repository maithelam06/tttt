package com.example.bewebsslock.dto.request;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

public class CustomerRequestDto {

	private String type, address, note, doorImageUrl, email;

	@NotBlank
	private String customerName;

	@NotBlank
	private String phone;

	private LocalDateTime appointmentAt;
	private Long productId;

	public CustomerRequestDto() {}

	public String getType()            { return type; }
	public void   setType(String v)    { type = v; }

	public String getEmail()           { return email; }
	public void   setEmail(String v)   { email = v; }

	public String getAddress()         { return address; }
	public void   setAddress(String v) { address = v; }

	public String getNote()            { return note; }
	public void   setNote(String v)    { note = v; }

	public String getDoorImageUrl()            { return doorImageUrl; }
	public void   setDoorImageUrl(String v)    { doorImageUrl = v; }

	public String getCustomerName()            { return customerName; }
	public void   setCustomerName(String v)    { customerName = v; }

	public String getPhone()           { return phone; }
	public void   setPhone(String v)   { phone = v; }

	public LocalDateTime getAppointmentAt()         { return appointmentAt; }
	public void          setAppointmentAt(LocalDateTime v) { appointmentAt = v; }

	public Long getProductId()         { return productId; }
	public void setProductId(Long v)   { productId = v; }
}
