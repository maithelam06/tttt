function CategoryTable({ canManage, categories, onDelete, onEdit }) {
  return (
    <div className="table-panel">
      {!canManage && <div className="notice">Vai trò hiện tại chỉ được xem danh mục.</div>}
      <table>
        <thead>
          <tr>
            <th>Ma</th>
            <th>Danh mục</th>
            <th>Mô tả</th>
            <th>Trạng thái</th>
            {canManage && <th>Thao tác</th>}
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td>{category.code}</td>
              <td>{category.name}</td>
              <td>{category.description}</td>
              <td>
                <span className="status-pill">{category.status}</span>
              </td>
              {canManage && (
                <td>
                  <div className="table-actions">
                    <button onClick={() => onEdit(category)} type="button">
                      Sửa
                    </button>
                    <button onClick={() => onDelete(category.id)} type="button">
                      Xóa
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default CategoryTable
