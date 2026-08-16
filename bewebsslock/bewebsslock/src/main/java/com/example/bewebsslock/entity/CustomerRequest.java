package com.example.bewebsslock.entity;

import com.example.bewebsslock.enums.RequestStatus;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Entity
public class CustomerRequest {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	/** Mã phiếu tự động: YC-20260805-0001 */
	@Column(unique = true)
	private String code;

	/** CONSULTATION | INSTALLATION | WARRANTY | OTHER */
	@Column(length = 50)
	private String type;

	@Column(nullable = false)
	private String customerName;

	@Column(nullable = false)
	private String phone;

	private String email;
	private String address;

	@Column(columnDefinition = "TEXT")
	private String note;

	private String doorImageUrl;
	private LocalDateTime appointmentAt;
	private LocalDateTime createdAt = LocalDateTime.now();
	private LocalDateTime assignedAt;
	private LocalDateTime completedAt;

	@Enumerated(EnumType.STRING)
	@Column(length = 50)
	private RequestStatus status = RequestStatus.PENDING;

	@ManyToOne(fetch = FetchType.EAGER)
	private Product product;

	/** Kỹ thuật viên được phân công */
	@ManyToOne(fetch = FetchType.EAGER)
	private Technician technician;

	/* ─── Lifecycle ──────────────────────────────────────── */
	@PrePersist
	public void prePersist() {
		if (code == null || code.isBlank()) {
			code = "YC-" + DateTimeFormatter.ofPattern("yyyyMMdd").format(LocalDateTime.now())
					+ "-" + String.format("%04d", (long)(Math.random() * 9999));
		}
	}

	/* ─── Getters / Setters ──────────────────────────────── */
	public Long getId() { return id; }

	public String getCode() { return code; }

	public String getType() { return type; }
	public void setType(String type) { this.type = type; }

	public String getCustomerName() { return customerName; }
	public void setCustomerName(String value) { customerName = value; }

	public String getPhone() { return phone; }
	public void setPhone(String phone) { this.phone = phone; }

	public String getEmail() { return email; }
	public void setEmail(String email) { this.email = email; }

	public String getAddress() { return address; }
	public void setAddress(String address) { this.address = address; }

	public String getNote() { return note; }
	public void setNote(String note) { this.note = note; }

	public String getDoorImageUrl() { return doorImageUrl; }
	public void setDoorImageUrl(String value) { doorImageUrl = value; }

	public LocalDateTime getAppointmentAt() { return appointmentAt; }
	public void setAppointmentAt(LocalDateTime value) { appointmentAt = value; }

	public LocalDateTime getCreatedAt() { return createdAt; }

	public LocalDateTime getAssignedAt() { return assignedAt; }
	public void setAssignedAt(LocalDateTime assignedAt) { this.assignedAt = assignedAt; }

	public LocalDateTime getCompletedAt() { return completedAt; }
	public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }

	public RequestStatus getStatus() { return status; }
	public void setStatus(RequestStatus status) { this.status = status; }

	public Product getProduct() { return product; }
	public void setProduct(Product product) { this.product = product; }

	public Technician getTechnician() { return technician; }
	public void setTechnician(Technician technician) { this.technician = technician; }
}
