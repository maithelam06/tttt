# SSLock Backend

Spring Boot 3 + PostgreSQL, chia luồng ngắn gọn:

`controller -> service -> repository -> database`

## Chạy bằng Docker

```bash
docker compose up --build
```

- API: `http://localhost:8080/api`
- PostgreSQL: `localhost:5432`
- Database: `sslock`

## API chính

| Method | Endpoint | Chức năng |
|---|---|---|
| POST | `/api/auth/login` | Đăng nhập nhân viên |
| GET/POST | `/api/products` | Danh sách / thêm sản phẩm |
| GET/PUT/DELETE | `/api/products/{id}` | Chi tiết / sửa / xóa |
| GET/POST | `/api/categories` | Danh mục |
| GET/POST | `/api/articles?type=PROJECT` | Dự án |
| GET/POST | `/api/articles?type=NEWS` | Tin tức |
| GET/POST | `/api/requests` | Tư vấn / lịch lắp đặt |
| GET | `/api/products/recommend` | Gợi ý 3 khóa theo cửa/tính năng/giá |
| GET/POST/PUT/DELETE | `/api/brands` | Thương hiệu |
| GET/POST/PUT/DELETE | `/api/customers` | Khách hàng |
| GET/POST/PUT/DELETE | `/api/technicians` | Kỹ thuật viên |
| GET/POST | `/api/orders` | Đơn hàng, tự trừ tồn kho |
| PATCH | `/api/orders/{id}/status` | Cập nhật trạng thái đơn |
| GET/POST | `/api/inventory` | Nhập/xuất kho |
| GET/POST | `/api/quotes` | Báo giá |
| GET/POST | `/api/warranties` | Phiếu bảo hành điện tử |
| GET | `/api/warranties/verify/{code}` | Quét QR/tra bảo hành công khai |
| PATCH | `/api/warranties/{id}/repair` | Thêm lịch sử sửa chữa |
| GET/POST | `/api/installations` | Lịch lắp đặt |
| PATCH | `/api/installations/{id}/assign` | Phân kỹ thuật viên |
| GET/POST/DELETE | `/api/staff` | Nhân viên |
| GET | `/api/dashboard` | Chỉ số quản trị |

Sau khi đăng nhập, gửi token cho API quản trị:

```http
X-Auth-Token: token-tra-ve-tu-api-login
```

Nhân viên không được xóa dữ liệu hoặc quản lý nhân viên, danh mục,
thương hiệu và kỹ thuật viên. Admin có toàn quyền.

Tài khoản seed: `admin/admin123`, `nhanvien/staff123`.

Biến môi trường nằm trong `application.yaml`; Docker Compose đã truyền sẵn.
