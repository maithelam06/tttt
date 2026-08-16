import bannerImage from "../../assets/hero-slides/factory-testing.png"
import "./PublicCatalogShowcase.css"

const catalogItems = [
  ["Khóa cửa gỗ", "Sử dụng cho cửa gỗ, cửa composite, cửa thép"],
  ["Khóa khách sạn", "Sử dụng cho các tòa khách sạn"],
  ["Khóa cửa kính", "Sử dụng cho cửa kính"],
  ["Khóa cửa nhôm", "Sử dụng cho cửa nhôm"],
  ["Khóa cơ", "Các dòng khóa mở bằng chìa khóa cơ"],
  ["Phụ kiện và các loại khóa khác", "Phụ kiện và các loại khóa khác"],
  ["Nhà thông minh SSHOME", "Thiết bị smart home"],
]

const newsItems = [
  "Cung cấp hệ thống khóa thẻ từ khách sạn cho resort",
  "Tư vấn chọn khóa cửa gỗ cho căn hộ mới bàn giao",
]

function PublicCatalogShowcase({ products }) {
  const featuredProducts = products.slice(0, 4)

  return (
    <section className="catalog-showcase">
      <div className="catalog-bar">
        <button className="catalog-trigger" type="button">
          <span>☰</span>
          Danh mục sản phẩm
        </button>
        <nav>
          <a href="/">Trang chủ</a>
          <a href="#gioi-thieu">Giới thiệu</a>
          <a href="#du-an">Các dự án</a>
          <a href="#tuyen-dung">Tuyển dụng</a>
          <a href="#tin-tuc">Tin tức</a>
          <a href="#lien-he">Liên hệ</a>
        </nav>
        <button className="cart-button" type="button">
          🛒
          <strong>0</strong>
        </button>
      </div>

      <div className="catalog-layout">
        <aside className="catalog-list">
          {catalogItems.map(([title, description]) => (
            <button key={title} type="button">
              <strong>{title}</strong>
              <span>{description}</span>
            </button>
          ))}
        </aside>

        <div className="catalog-banner">
          <img alt="Gian hàng SSLock" src={bannerImage} />
          <div>
            <p>SSLock</p>
            <h2>Trân trọng cảm ơn Quý khách</h2>
            <span>Đã tham quan gian hàng và trải nghiệm khóa thông minh</span>
          </div>
        </div>
      </div>

      <div className="catalog-bottom">
        <aside className="news-panel" id="tin-tuc">
          <h3>Tin tức</h3>
          {newsItems.map((item) => (
            <article key={item}>
              <div />
              <p>{item}</p>
            </article>
          ))}
        </aside>

        <section className="featured-category">
          <h3>Khóa cửa gỗ</h3>
          <div className="featured-products">
            {featuredProducts.map((product) => (
              <article key={product.id}>
                <div className={`mini-product ${product.imageTone || "blue"}`} />
                <strong>{product.name}</strong>
                <span>{product.brand}</span>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  )
}

export default PublicCatalogShowcase
