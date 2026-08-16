import { formatMoney } from "../../utils/format"
import ProductVisual from "../public/ProductVisual"

function ProductCard({ product, categoryName, canManage, onEdit, onDelete, onViewDetails }) {
  return (
    <article className="product-card">
      <button
        aria-label={`Xem chi tiet ${product.name}`}
        className="product-card__visual-btn"
        onClick={onViewDetails}
        style={{ border: 0, padding: 0, background: "transparent", cursor: "pointer", width: "100%", display: "block" }}
        type="button"
      >
        <ProductVisual product={product} />
      </button>

      <div className="product-card__header">
        <div>
          <span>{product.sku}{product.serialNumber ? ` · S/N: ${product.serialNumber}` : ""}</span>
          <h3>{product.name}</h3>
        </div>
        <strong>{formatMoney(product.price)}</strong>
      </div>

      <div className="product-meta">
        <span>{categoryName}</span>
        <span>{product.brand}</span>
        <span>{product.warrantyMonths} tháng bảo hành</span>
      </div>

      <div className="stock-row">
        <span>Tồn kho: {product.stock}</span>
        <span className="status-pill">{product.status}</span>
      </div>

      <div className="card-actions">
        {canManage ? (
          <>
            <button onClick={onViewDetails} type="button">
              Chi tiết
            </button>
            <button onClick={onEdit} type="button">
              Sửa
            </button>
            <button onClick={onDelete} type="button">
              Xóa
            </button>
          </>
        ) : (
          <>
            <button onClick={onViewDetails} type="button">
              Chi tiết
            </button>
            <button type="button">Mua ngay</button>
          </>
        )}
      </div>
    </article>
  )
}

export default ProductCard
