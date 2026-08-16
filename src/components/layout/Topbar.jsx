function Topbar({ activeTab, isGuest, keyword, onKeywordChange }) {
  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">{isGuest ? "Cửa hàng ổ khóa" : "Dashboard quản trị"}</p>
        <h2>
          {isGuest
            ? "Danh sách ổ khóa"
            : activeTab === "products"
              ? "Quản lý sản phẩm ổ khóa"
              : "Quản lý danh mục"}
        </h2>
      </div>
      <input
        aria-label="Tìm kiếm sản phẩm"
        onChange={(event) => onKeywordChange(event.target.value)}
        placeholder="Tìm tên, SKU, thương hiệu..."
        type="search"
        value={keyword}
      />
    </header>
  )
}

export default Topbar
