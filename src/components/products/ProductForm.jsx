function ProductForm({
  categories = [],
  brands = [],
  editingProductId,
  form,
  onChange,
  onSubmit,
}) {
  const defaultBrands = ["SSLock", "Kaadas", "Philips", "Yale", "Hafele", "Epic", "Orbita"]
  const allBrands = Array.from(
    new Set([
      ...defaultBrands,
      ...brands.map((b) => (typeof b === "string" ? b : b.name)),
      ...(form.brand ? [form.brand] : []),
    ]),
  ).filter(Boolean)

  return (
    <form className="manager-form" onSubmit={onSubmit}>
      <h3>{editingProductId ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}</h3>

      <label>
        Tên sản phẩm
        <input
          onChange={(event) => onChange({ ...form, name: event.target.value })}
          placeholder="VD: KHÓA CỬA VÂN TAY, KHÓA THÔNG MINH B26-FACP (APP TTLOCK) NHÔM CAO CẤP CNC"
          required
          value={form.name}
        />
      </label>

      <div className="form-row">
        <label>
          SKU (Mã sp)
          <input
            onChange={(event) => onChange({ ...form, sku: event.target.value })}
            placeholder="VD: B26-FACP"
            required
            value={form.sku}
          />
        </label>
        <label>
          Số Serial (S/N)
          <input
            onChange={(event) => onChange({ ...form, serialNumber: event.target.value })}
            placeholder="VD: SN-SSL-2026-99812"
            value={form.serialNumber || ""}
          />
        </label>
      </div>

      <div className="form-row">
        <label>
          Danh mục
          <select
            onChange={(event) => onChange({ ...form, categoryId: event.target.value })}
            value={form.categoryId}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Thương hiệu
          <select
            onChange={(event) => onChange({ ...form, brand: event.target.value })}
            required
            value={form.brand || ""}
          >
            <option value="">-- Chọn thương hiệu --</option>
            {allBrands.map((brandName) => (
              <option key={brandName} value={brandName}>
                {brandName}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label>
        Hình ảnh sản phẩm (Tải ảnh từ máy / Dán Link)
        <input
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) {
              const reader = new FileReader()
              reader.onloadend = () => {
                onChange({ ...form, imageUrl: reader.result })
              }
              reader.readAsDataURL(file)
            }
          }}
          style={{ marginTop: 4, marginBottom: 4 }}
          type="file"
        />
        <input
          onChange={(event) => onChange({ ...form, imageUrl: event.target.value })}
          placeholder="Hoặc dán URL đường dẫn ảnh..."
          value={form.imageUrl || ""}
        />
      </label>

      {form.imageUrl && (
        <div style={{ margin: "6px 0 12px", background: "#f8fafc", padding: 8, borderRadius: 8, border: "1px dashed #cbd5e1", textAlign: "center" }}>
          <small style={{ color: "#64748b", display: "block", marginBottom: 4, fontSize: 11 }}>Xem trước ảnh sản phẩm:</small>
          <img
            alt="Preview"
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
            src={form.imageUrl}
            style={{ maxHeight: 120, objectFit: "contain", borderRadius: 6, userSelect: "none" }}
          />
        </div>
      )}

      <div className="form-row">
        <label>
          Loại cửa phù hợp
          <select
            onChange={(event) => onChange({ ...form, doorType: event.target.value })}
            value={form.doorType || "Cửa gỗ"}
          >
            <option value="Cửa gỗ">Cửa gỗ</option>
            <option value="Cửa nhôm CNC">Cửa nhôm CNC / Xingfa</option>
            <option value="Cửa kính">Cửa kính cường lực</option>
            <option value="Cửa sắt / Cổng">Cửa sắt / Cổng ngoài trời</option>
            <option value="Khách sạn / Homestay">Khách sạn / Homestay</option>
          </select>
        </label>
        <label>
          Ứng dụng (App)
          <select
            onChange={(event) => onChange({ ...form, app: event.target.value })}
            value={form.app || "App TTLock"}
          >
            <option value="App TTLock">App TTLock (Tiếng Việt)</option>
            <option value="App Tuya Smart">App Tuya Smart / Smart Life</option>
            <option value="Philips EasyKey">Philips EasyKey</option>
            <option value="Kaadas App">Kaadas App</option>
            <option value="Không dùng App">Không dùng App</option>
          </select>
        </label>
      </div>

      <div className="form-row">
        <label>
          Chất liệu thân khóa
          <input
            onChange={(event) => onChange({ ...form, material: event.target.value })}
            placeholder="VD: Nhôm cao cấp CNC, Hợp kim kẽm"
            value={form.material || ""}
          />
        </label>
        <label>
          Chính sách lắp đặt
          <input
            onChange={(event) => onChange({ ...form, installPolicy: event.target.value })}
            placeholder="VD: Miễn phí khảo sát & lắp đặt tận nơi"
            value={form.installPolicy || ""}
          />
        </label>
      </div>

      <div className="form-row">
        <label>
          Giá bán (VNĐ)
          <input
            min="0"
            onChange={(event) => onChange({ ...form, price: event.target.value })}
            required
            type="number"
            value={form.price}
          />
        </label>
        <label>
          Số lượng tồn kho
          <input
            min="0"
            onChange={(event) => onChange({ ...form, stock: event.target.value })}
            required
            type="number"
            value={form.stock}
          />
        </label>
      </div>

      <div className="form-row">
        <label>
          Bảo hành (tháng)
          <input
            min="0"
            onChange={(event) => onChange({ ...form, warrantyMonths: event.target.value })}
            required
            type="number"
            value={form.warrantyMonths}
          />
        </label>
        <label>
          Trạng thái
          <select
            onChange={(event) => onChange({ ...form, status: event.target.value })}
            value={form.status}
          >
            <option>Đang bán</option>
            <option>Tạm ẩn</option>
            <option>Hết hàng</option>
          </select>
        </label>
      </div>

      <label>
        Mô tả bài viết giới thiệu sản phẩm
        <textarea
          onChange={(event) => onChange({ ...form, description: event.target.value })}
          placeholder="Nhập chi tiết mô tả sản phẩm, tính năng công nghệ nhận diện vân tay, mở từ xa..."
          rows={4}
          value={form.description || ""}
        />
      </label>

      <button className="primary-button" type="submit">
        {editingProductId ? "Lưu cập nhật" : "Thêm sản phẩm"}
      </button>
    </form>
  )
}

export default ProductForm
