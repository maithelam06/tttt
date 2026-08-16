import { formatMoney } from "../../utils/format"
import ProductVisual from "../public/ProductVisual"

function ProductDetail({ categoryName, onClose, product }) {
  if (!product) {
    return null
  }

  return (
    <aside className="detail-panel">
      <button className="detail-close" onClick={onClose} type="button">
        Đóng
      </button>

      <div style={{ borderRadius: 12, overflow: "hidden", marginBottom: 16 }}>
        <ProductVisual product={product} />
      </div>

      <div className="detail-header">
        <span className="category-tag">{categoryName}</span>
        <h3>{product.name}</h3>
        {product.serialNumber && (
          <small style={{ color: "#64748b", display: "block", marginTop: 2 }}>
            S/N: <b>{product.serialNumber}</b> · SKU: <b>{product.sku}</b>
          </small>
        )}
        <strong style={{ color: "#2563eb", fontSize: 22, display: "block", margin: "10px 0" }}>
          {formatMoney(product.price)}
        </strong>
        {product.description && (
          <p style={{ color: "#475569", lineHeight: 1.6, fontSize: 14 }}>
            {product.description}
          </p>
        )}
      </div>

      <dl className="spec-grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 12, margin: "16px 0" }}>
        <div>
          <dt style={{ color: "#94a3b8", fontSize: 12 }}>Thương hiệu</dt>
          <dd style={{ fontWeight: 600 }}>{product.brand || "SSLock"}</dd>
        </div>
        <div>
          <dt style={{ color: "#94a3b8", fontSize: 12 }}>Loại cửa</dt>
          <dd style={{ fontWeight: 600 }}>{product.doorType || "Cửa gỗ, cửa nhôm"}</dd>
        </div>
        <div>
          <dt style={{ color: "#94a3b8", fontSize: 12 }}>Chất liệu</dt>
          <dd style={{ fontWeight: 600 }}>{product.material || "Hợp kim cao cấp"}</dd>
        </div>
        <div>
          <dt style={{ color: "#94a3b8", fontSize: 12 }}>Ứng dụng (App)</dt>
          <dd style={{ fontWeight: 600 }}>{product.app || "TTLock / Tuya"}</dd>
        </div>
        <div>
          <dt style={{ color: "#94a3b8", fontSize: 12 }}>Bảo hành</dt>
          <dd style={{ fontWeight: 600 }}>{product.warrantyMonths} tháng chính hãng</dd>
        </div>
        <div>
          <dt style={{ color: "#94a3b8", fontSize: 12 }}>Chính sách lắp</dt>
          <dd style={{ fontWeight: 600 }}>{product.installTime || "Miễn phí khảo sát & lắp đặt"}</dd>
        </div>
      </dl>

      {product.features && product.features.length > 0 && (
        <div className="detail-section" style={{ marginTop: 16 }}>
          <h4>Tính năng & Phương thức mở khóa</h4>
          <div className="product-meta" style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
            {product.features.map((feature) => (
              <span key={feature} style={{ background: "#e0f2fe", color: "#0369a1", padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 500 }}>
                ✓ {feature}
              </span>
            ))}
          </div>
        </div>
      )}

      {product.suitableFor && product.suitableFor.length > 0 && (
        <div className="detail-section" style={{ marginTop: 16 }}>
          <h4>Phù hợp với</h4>
          <ul style={{ paddingLeft: 20, margin: "8px 0", color: "#334155" }}>
            {product.suitableFor.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="detail-actions" style={{ display: "flex", gap: 10, marginTop: 20 }}>
        <button className="primary-button" style={{ flex: 1 }} type="button">
          Gọi tư vấn ngay
        </button>
        <button style={{ flex: 1 }} type="button">Đặt lịch lắp đặt</button>
      </div>
    </aside>
  )
}

export default ProductDetail
