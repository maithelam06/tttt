package com.example.bewebsslock.enums;

public enum RequestStatus {
	PENDING,      // Chờ tiếp nhận
	PROCESSING,   // Đang xem xét & liên hệ
	ASSIGNED,     // Đã phân công kỹ thuật viên
	IN_PROGRESS,  // Nhân viên đang thực hiện
	COMPLETED,    // Hoàn thành
	CANCELLED     // Đã hủy
}
