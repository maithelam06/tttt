function StatsGrid({ products, categories }) {
  const totalStock = products.reduce((sum, product) => sum + Number(product.stock), 0)
  const activeProducts = products.filter((product) => product.status === "Đang bán").length

  return (
    <div className="stats-grid">
      <div>
        <span>Tổng sản phẩm</span>
        <strong>{products.length}</strong>
      </div>
      <div>
        <span>Đang bán</span>
        <strong>{activeProducts}</strong>
      </div>
      <div>
        <span>Tồn kho</span>
        <strong>{totalStock}</strong>
      </div>
      <div>
        <span>Danh mục</span>
        <strong>{categories.length}</strong>
      </div>
    </div>
  )
}

export default StatsGrid
