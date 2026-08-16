function CategoryForm({ editingCategoryId, form, onChange, onSubmit }) {
  return (
    <form className="manager-form" onSubmit={onSubmit}>
      <h3>{editingCategoryId ? "Cập nhật danh mục" : "Thêm danh mục mới"}</h3>
      <label>
        Tên danh mục
        <input
          onChange={(event) => onChange({ ...form, name: event.target.value })}
          required
          value={form.name}
        />
      </label>
      <label>
        Mã danh mục
        <input
          onChange={(event) => onChange({ ...form, code: event.target.value.toUpperCase() })}
          required
          value={form.code}
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
        </select>
      </label>
      <label>
        Mô tả
        <textarea
          onChange={(event) => onChange({ ...form, description: event.target.value })}
          required
          rows="4"
          value={form.description}
        />
      </label>
      <button className="primary-button" type="submit">
        {editingCategoryId ? "Lưu cập nhật" : "Thêm danh mục"}
      </button>
    </form>
  )
}

export default CategoryForm
