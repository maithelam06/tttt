import { useEffect, useMemo, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { formatMoney } from "../../utils/format"
import ProductVisual from "./ProductVisual"
import SiteFooter from "./SiteFooter"
import WarrantyLookup from "./WarrantyLookup"
import { api } from "../../services/api"
import { toast } from "../ui/Toast"

const doorTypes = ["Tất cả", "Cửa gỗ", "Cửa kính", "Cửa nhôm", "Khách sạn"]
const featureList = ["Vân tay", "Mã số", "Thẻ từ", "Face ID", "Camera", "Chuông hình", "App Tuya", "App TTLock"]

function Storefront({ products, keyword, onKeywordChange, compareIds, onToggleCompare }) {
  const [door, setDoor] = useState("Tất cả")
  const [feature, setFeature] = useState("")
  const [price, setPrice] = useState("all")
  const [detail, setDetail] = useState(null)
  const [modal, setModal] = useState("")
  const [showWarrantyModal, setShowWarrantyModal] = useState(false)
  const [ai, setAi] = useState({ space: "", door: "", feature: "", budget: "" })

  // Lock body scroll when any modal is open
  const anyModal = !!(detail || modal || showWarrantyModal)
  useEffect(() => {
    document.body.style.overflow = anyModal ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [anyModal])

  const filtered = useMemo(() => products.filter((item) => {
    const matchesText = [item.name, item.brand, item.sku].join(" ").toLowerCase().includes(keyword.toLowerCase())
    const matchesPrice = price === "all" || (price === "low" ? item.price && item.price < 6000000 : price === "mid" ? item.price >= 6000000 && item.price <= 10000000 : item.price > 10000000)
    return matchesText && (door === "Tất cả" || item.doorType === door) && (!feature || item.features.includes(feature)) && matchesPrice
  }), [door, feature, keyword, price, products])

  // AI Intelligent Recommendation algorithm with matching scores
  const aiSuggestions = useMemo(() => {
    if (!products || !products.length) return []
    return products
      .map((p) => {
        let score = 70
        if (ai.door && p.doorType === ai.door) score += 15
        if (ai.feature && p.features.includes(ai.feature)) score += 15
        if (ai.budget === "Dưới 6 triệu" && p.price && p.price < 6000000) score += 10
        if (ai.budget === "6 - 10 triệu" && p.price >= 6000000 && p.price <= 10000000) score += 10
        if (ai.budget === "Trên 10 triệu" && p.price > 10000000) score += 10
        return { ...p, matchScore: Math.min(score, 99) }
      })
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 3)
  }, [ai, products])

  return (
    <>
      <section className="hero-store">
        <div>
          <span className="hero-tag">CÔNG NGHỆ BẢO VỆ TỔ ẤM</span>
          <h1>Mở cửa thông minh.<br /><em>An tâm mỗi ngày.</em></h1>
          <p>Khóa chính hãng, lắp đặt chuẩn kỹ thuật và bảo hành điện tử minh bạch trên toàn quốc.</p>
          <div className="hero-buttons">
            <a href="#san-pham">Khám phá sản phẩm</a>
            <button onClick={() => setModal("consult")} type="button">Nhận tư vấn miễn phí</button>
            <button
              className="btn-gold"
              onClick={() => setShowWarrantyModal(true)}
              type="button"
            >
              ✦ Tra cứu Bảo hành QR
            </button>
          </div>
          <div className="trust-row">
            <span>✓ Chính hãng 100%</span>
            <span>✓ Bảo hành đến 3 năm</span>
            <span>✓ Lắp đặt tận nơi 24/7</span>
          </div>
        </div>
        <div className="hero-product" style={{ position: "relative" }}>
          <div className="glow" />
          {(() => {
            const featuredLock = products[0] || {
              name: "SSLOCK B26-FACP (APP TTLOCK) NHÔM CAO CẤP CNC",
              sku: "B26-FACP",
              brand: "SSLock",
              price: 5000000,
              warrantyMonths: 24,
              features: ["Vân tay", "Mã số", "Face ID 3D", "App TTLock"],
            }
            return (
              <div style={{ position: "relative", zIndex: 2, background: "rgba(15, 23, 42, 0.8)", backdropFilter: "blur(14px)", border: "1px solid rgba(255, 255, 255, 0.18)", borderRadius: "20px", padding: "20px", width: "100%", maxWidth: "390px", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.6)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <span style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)", color: "#ffffff", fontSize: "11px", fontWeight: 700, padding: "4px 10px", borderRadius: "20px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    ⭐ Khóa Tiêu Biểu Nổi Bật
                  </span>
                  <span style={{ color: "#94a3b8", fontSize: "12px", fontWeight: 600 }}>SKU: {featuredLock.sku}</span>
                </div>

                <div style={{ borderRadius: "12px", overflow: "hidden", marginBottom: "14px", border: "1px solid rgba(255, 255, 255, 0.1)", background: "#091327" }}>
                  <ProductVisual product={featuredLock} />
                </div>

                <h3 style={{ color: "#ffffff", fontSize: "16px", fontWeight: 700, margin: "0 0 6px", lineHeight: "1.4" }}>
                  {featuredLock.name}
                </h3>

                <div style={{ display: "flex", alignItems: "baseline", gap: "10px", margin: "8px 0 12px" }}>
                  <strong style={{ color: "#38bdf8", fontSize: "21px", fontWeight: 800 }}>
                    {formatMoney(featuredLock.price)}
                  </strong>
                  <span style={{ color: "#94a3b8", fontSize: "12px" }}>
                    Bảo hành {featuredLock.warrantyMonths || 24} tháng
                  </span>
                </div>

                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "16px" }}>
                  <span style={{ background: "rgba(56, 189, 248, 0.15)", color: "#38bdf8", fontSize: "11px", padding: "3px 8px", borderRadius: "6px", border: "1px solid rgba(56, 189, 248, 0.3)" }}>
                    ✦ Face ID 3D (&lt; 0.5s)
                  </span>
                  <span style={{ background: "rgba(168, 85, 247, 0.15)", color: "#c084fc", fontSize: "11px", padding: "3px 8px", borderRadius: "6px", border: "1px solid rgba(168, 85, 247, 0.3)" }}>
                    ✦ Vân tay sinh trắc học
                  </span>
                  <span style={{ background: "rgba(34, 197, 94, 0.15)", color: "#4ade80", fontSize: "11px", padding: "3px 8px", borderRadius: "6px", border: "1px solid rgba(34, 197, 94, 0.3)" }}>
                    ✦ App TTLock Tiếng Việt
                  </span>
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={() => setSelectedProduct(featuredLock)}
                    style={{ flex: 1, background: "rgba(255, 255, 255, 0.12)", color: "#ffffff", border: "1px solid rgba(255, 255, 255, 0.25)", padding: "10px", borderRadius: "10px", fontSize: "13px", fontWeight: 600, cursor: "pointer", transition: "all 0.15s ease" }}
                    type="button"
                  >
                    Xem chi tiết
                  </button>
                  <button
                    onClick={() => setModal({ type: "booking", product: featuredLock })}
                    style={{ flex: 1, background: "linear-gradient(135deg, #2563eb, #1d4ed8)", color: "#ffffff", border: 0, padding: "10px", borderRadius: "10px", fontSize: "13px", fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 12px rgba(37, 99, 235, 0.4)" }}
                    type="button"
                  >
                    Đặt lắp ngay
                  </button>
                </div>
              </div>
            )
          })()}
        </div>
      </section>

      <CounterBelt />

      <section className="catalog-section" id="san-pham">
        <div className="section-heading">
          <div>
            <span>SẢN PHẨM NỔI BẬT</span>
            <h2>Tìm chiếc khóa dành cho bạn</h2>
          </div>
          <p>Khám phá những giải pháp bảo mật phù hợp với từng loại cửa và nhu cầu của gia đình.</p>
        </div>

        <div className="catalog-tools">
          <div className="search-box">
            ⌕
            <input
              onChange={(e) => onKeywordChange(e.target.value)}
              placeholder="Tìm tên khóa, thương hiệu, tính năng..."
              value={keyword}
            />
          </div>
          <select onChange={(e) => setPrice(e.target.value)} value={price}>
            <option value="all">Mọi mức giá</option>
            <option value="low">Dưới 6 triệu</option>
            <option value="mid">6 - 10 triệu</option>
            <option value="high">Trên 10 triệu</option>
          </select>
        </div>

        <div className="door-tabs">
          {doorTypes.map((x) => (
            <button
              className={door === x ? "active" : ""}
              key={x}
              onClick={() => setDoor(x)}
              type="button"
            >
              {x}
            </button>
          ))}
        </div>

        <div className="feature-filter">
          <span>Tính năng nổi bật:</span>
          {featureList.map((x) => (
            <button
              className={feature === x ? "active" : ""}
              key={x}
              onClick={() => setFeature(feature === x ? "" : x)}
              type="button"
            >
              {x}
            </button>
          ))}
        </div>

        <div className="result-line">
          <b>{filtered.length} sản phẩm phù hợp</b>
          <span>Hiển thị sản phẩm tốt nhất cho nhu cầu của bạn</span>
        </div>

        <div className="store-grid">
          {filtered.map((product) => (
            <article className="store-card" key={product.id}>
              <div className="badge">
                {product.stock < 10 ? "SẮP HẾT" : "BÁN CHẠY"}
              </div>
              <button
                className={`compare-check ${compareIds.includes(product.id) ? "checked" : ""}`}
                onClick={() => onToggleCompare(product.id)}
                title="Chọn để so sánh"
                type="button"
              >
                ✓
              </button>
              <ProductVisual product={product} />
              <div className="card-body">
                <span>{product.brand} · {product.doorType}</span>
                <h3>{product.name}</h3>
                <div className="feature-tags">
                  {product.features.slice(0, 3).map((x) => (
                    <i key={x}>{x}</i>
                  ))}
                </div>
                <div className="price-row">
                  <strong>{product.price ? formatMoney(product.price) : "Liên hệ"}</strong>
                  <small>BH {product.warrantyMonths} tháng</small>
                </div>
                <button className="detail-btn" onClick={() => setDetail(product)} type="button">
                  Xem chi tiết <b>→</b>
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="ai-section" id="ai-tu-van">
        <div className="ai-copy">
          <span>✦ TRỢ LÝ AI SSLOCK</span>
          <h2>Chưa biết chọn mẫu khóa nào?</h2>
          <p>Trả lời 4 câu hỏi ngắn, trợ lý thuật toán sẽ tự động phân tích nhu cầu và gợi ý 3 mẫu khóa phù hợp nhất cho ngôi nhà bạn.</p>
          <ul><li>Gợi ý chính xác theo chất liệu & loại cửa</li><li>Tối ưu tính năng theo thói quen sử dụng</li><li>Cân đối ngân sách tối ưu nhất</li></ul>
        </div>

        <div className="ai-form">
          <b>Nhập thông tin nhu cầu lắp đặt</b>
          <label>
            1. Không gian sử dụng
            <select onChange={(e) => setAi({ ...ai, space: e.target.value })} value={ai.space}>
              <option value="">Chọn không gian</option>
              <option>Chung cư</option>
              <option>Biệt thự</option>
              <option>Khách sạn</option>
              <option>Văn phòng</option>
            </select>
          </label>
          <label>
            2. Loại cửa hiện tại
            <select onChange={(e) => setAi({ ...ai, door: e.target.value })} value={ai.door}>
              <option value="">Chọn loại cửa</option>
              {doorTypes.slice(1).map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
          <label>
            3. Tính năng mong muốn nhất
            <select onChange={(e) => setAi({ ...ai, feature: e.target.value })} value={ai.feature}>
              <option value="">Chọn tính năng</option>
              {featureList.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
          <label>
            4. Mức ngân sách dự kiến
            <select onChange={(e) => setAi({ ...ai, budget: e.target.value })} value={ai.budget}>
              <option value="">Chọn khoảng giá</option>
              <option>Dưới 6 triệu</option>
              <option>6 - 10 triệu</option>
              <option>Trên 10 triệu</option>
            </select>
          </label>
          <button onClick={() => setModal("ai")} type="button">✦ Phân tích & Gợi ý Top 3 Khóa</button>
        </div>
      </section>

      <SiteFooter />
      <BranchFooter />

      {createPortal(
        <>
          {/* Product Detail Modal */}
          {detail && (
            <div className="modal-backdrop" onClick={() => setDetail(null)}>
              <aside className="product-modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={() => setDetail(null)} type="button">×</button>
                <ProductVisual product={detail} />
                <div className="modal-content">
                  <span>{detail.brand} · SKU: {detail.sku}</span>
                  <h2>{detail.name}</h2>
                  <strong>{detail.price ? formatMoney(detail.price) : "Liên hệ báo giá"}</strong>
                  <p style={{ margin: "12px 0", lineHeight: 1.6 }}>{detail.description || "Dòng khóa cửa thông minh cao cấp, thiết kế nguyên khối sang trọng, tích hợp chip sinh trắc bảo mật cao."}</p>

                  <div className="stock-ok" style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <span>● {detail.stock ? `Còn hàng (${detail.stock} sản phẩm)` : "Liên hệ hotline để đặt trước"}</span>
                    <span style={{ color: "#2563eb", background: "#eff6ff", padding: "4px 8px", borderRadius: "4px", fontSize: "11px" }}>
                      Lắp đặt trong ngày
                    </span>
                  </div>

                  <dl>
                    <div><dt>Loại cửa phù hợp</dt><dd>{detail.doorType}</dd></div>
                    <div><dt>Công nghệ mở khóa</dt><dd>{detail.features.join(", ")}</dd></div>
                    <div><dt>Chất liệu thân khóa</dt><dd>{detail.material || "Hợp kim kẽẽ cao cấp"}</dd></div>
                    <div><dt>Ứng dụng quản lý</dt><dd>{detail.app || "App Tuya / TTLock Smart"}</dd></div>
                    <div><dt>Thời gian bảo hành</dt><dd>{detail.warrantyMonths} tháng (Chính hãng)</dd></div>
                    <div><dt>Chính sách lắp đặt</dt><dd>{detail.installTime || "Miễn phí lắp đặt tận nơi nội thành"}</dd></div>
                  </dl>

                  <div className="modal-actions">
                    <a href="tel:0896628818" style={{ background: "#2563eb", color: "#fff", textDecoration: "none" }}>
                      📞 Gọi Tư vấn Zalo / Hotline
                    </a>
                    <button
                      onClick={() => {
                        setDetail(null)
                        setModal("booking")
                      }}
                      type="button"
                    >
                      📅 Đặt lịch lắp đặt
                    </button>
                  </div>
                </div>
              </aside>
            </div>
          )}

          {/* AI Wizard & Lead Booking Modals */}
          {modal && (
            <LeadModal
              onClose={() => setModal("")}
              products={modal === "ai" ? aiSuggestions : products}
              selectedProduct={detail}
              type={modal}
            />
          )}

          {/* Electronic Warranty QR Modal */}
          {showWarrantyModal && <WarrantyLookup onClose={() => setShowWarrantyModal(false)} />}
        </>,
        document.body,
      )}
    </>
  )
}

const branches = [
  { name: "Trụ sở chính tại Hà Nội", address: "Số 15 Lê Văn Thiêm, phường Thanh Xuân, TP Hà Nội", phones: ["0896 619 196"] },
  { name: "Showroom Ecopark Hưng Yên", address: "Số 5A Shop House Grand Maria Ecopark, Phụng Công, Văn Giang, Hưng Yên", phones: ["0896 628 818"] },
  { name: "Đại diện khu vực Nghệ An", address: "Số nhà 69, đường Đào Duy Từ, Khối 14, P Trường Thi, TP Vinh, Nghệ An", phones: ["0948 750 999", "0373 779 822"] },
  { name: "Đại diện khu vực Đà Nẵng", address: "K50/42 Hồ Xuân Hương, P. Ngũ Hành Sơn, TP Đà Nẵng", phones: ["0935 396 619", "0896 662 818"] },
  { name: "Đại diện khu vực Miền Nam", address: "Số 206, Đường III, khu dân cư Khang Điền, phường Phước Long, TP Hồ Chí Minh", phones: ["0944 499 090", "0896 628 818"] },
  { name: "Chi nhánh Bình Dương", address: "106B Hưng Định 10, phường Hưng Định, TP Thuận An, tỉnh Bình Dương", phones: ["0908 120 026", "0896 628 818"] },
]

export function BranchFooter() {
  return (
    <footer className="branch-footer" id="lien-he">
      <div className="branch-inner">
        <div className="branch-intro">
          <span>HỆ THỐNG PHÂN PHỐI TOÀN QUỐC</span>
          <h2>SSLOCK.VN - Siêu thị khóa thông minh trực tuyến hàng đầu Việt Nam</h2>
          <p>Khu vực Hà Nội · Số 15 Lê Văn Thiêm, phường Thanh Xuân, TP Hà Nội</p>
          <div>
            <a href="tel:0896628818">Hotline: 0896 628 818</a>
            <a href="mailto:sslock.vn@gmail.com">sslock.vn@gmail.com</a>
          </div>
        </div>
        <div className="branch-layout">
          <div className="branch-list">
            {branches.map((branch, index) => (
              <article key={branch.name}>
                <i>{String(index + 1).padStart(2, "0")}</i>
                <div>
                  <h3>{branch.name}</h3>
                  <p><span>Địa chỉ</span>{branch.address}</p>
                  <p>
                    <span>Hotline</span>
                    {branch.phones.map((phone, i) => (
                      <a href={`tel:${phone.replaceAll(" ", "")}`} key={phone}>
                        {phone}{i < branch.phones.length - 1 ? " · " : ""}
                      </a>
                    ))}
                  </p>
                </div>
              </article>
            ))}
          </div>
          <aside className="sales-box">
            <div className="sales-title">
              <i>☎</i>
              <p><span>HỖ TRỢ NHANH</span><b>Phòng kinh doanh</b></p>
            </div>
            <a href="tel:0896618818">
              <i>1</i>
              <p><span>Kinh doanh</span><b>0896 618 818</b></p>
              <strong>›</strong>
            </a>
            <a href="tel:0896619196">
              <i>2</i>
              <p><span>Kinh doanh</span><b>089 661 9196</b></p>
              <strong>›</strong>
            </a>
            <small>Phục vụ 8:00 - 21:00 mỗi ngày</small>
          </aside>
        </div>
        <div className="branch-bottom">
          <span>© 2026 SSLock. All rights reserved.</span>
          <p>Và các đại lý trên toàn quốc</p>
          <a href="#">Về đầu trang ↑</a>
        </div>
      </div>
    </footer>
  )
}

function LeadModal({ type, products, selectedProduct, onClose }) {
  const isAi = type === "ai"

  async function submit(event) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    try {
      await api.requests.create({
        type: type === "booking" ? "INSTALLATION" : "CONSULTATION",
        customerName: data.get("customerName"),
        phone: data.get("phone"),
        productId: data.get("productId") ? Number(data.get("productId")) : null,
        address: data.get("address") || "",
        appointmentAt: data.get("appointmentAt") || null,
        note: `[ĐẶT LỊCH LẮP ĐẶT] Ảnh cửa/loại cửa: ${data.get("doorPhoto") || "Chưa có"} | Ghi chú: ${data.get("note") || ""}`,
      })
      toast.success("Đã ghi nhận yêu cầu! SSLock sẽ liên hệ xác nhận trong 15 phút.")
      onClose()
    } catch (error) {
      toast.error(error.message || "Gửi thất bại, vui lòng thử lại!")
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="lead-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: isAi ? "720px" : "560px" }}>
        <button className="modal-close" onClick={onClose} type="button">×</button>
        <span className="modal-tag">{isAi ? "✦ ĐỀ XUẤT THUẬT TOÁN AI" : "SSLOCK CARE"}</span>
        <h2 className="modal-title">
          {isAi ? "Top 3 mẫu khóa phù hợp nhất với bạn" : type === "booking" ? "Đặt lịch lắp đặt tận nơi" : "Yêu cầu tư vấn miễn phí"}
        </h2>

        {isAi ? (
          <div className="suggest-list">
            {products.map((x) => (
              <div key={x.id} className="suggest-item">
                <ProductVisual compact product={x} />
                <div className="suggest-body">
                  <div className="suggest-header">
                    <b>{x.name}</b>
                    <span className="suggest-score">Phù hợp {x.matchScore || 95}%</span>
                  </div>
                  <div className="suggest-meta">Loại cửa: {x.doorType} | BH: {x.warrantyMonths} tháng</div>
                  <strong>{x.price ? formatMoney(x.price) : "Liên hệ"}</strong>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <form onSubmit={submit} className="lead-form">
            <input name="customerName" placeholder="Họ và tên khách hàng *" required />
            <input name="phone" placeholder="Số điện thoại liên hệ *" required type="tel" />
            
            {type === "booking" && (
              <>
                <select defaultValue={selectedProduct?.id || ""} name="productId" required>
                  <option value="">-- Chọn sản phẩm lắp đặt --</option>
                  {products.map((x) => (
                    <option key={x.id} value={x.id}>{x.name} ({x.price ? formatMoney(x.price) : "Liên hệ"})</option>
                  ))}
                </select>
                <input name="address" placeholder="Địa chỉ lắp đặt tận nơi *" required />
                <label>Ngày & giờ hẹn lắp đặt:</label>
                <input name="appointmentAt" type="datetime-local" />
                <input name="doorPhoto" placeholder="Dán link ảnh cửa hiện tại (không bắt buộc)" />
              </>
            )}
            <textarea name="note" placeholder="Ghi chú thêm về đố cửa, loại cửa hoặc yêu cầu tư vấn khác..." />
            <button type="submit">Gửi đăng ký hẹn lịch</button>
          </form>
        )}
      </div>
    </div>
  )
}

export default Storefront

/* ── CounterBelt: scroll-triggered count-up animation ─────── */
const STATS = [
  { value: 30000, suffix: "+",  label: "Khách hàng tin chọn",  prefix: "" },
  { value: 10,    suffix: " năm", label: "Kinh nghiệm",         prefix: "" },
  { value: 63,    suffix: " tỉnh", label: "Lắp đặt toàn quốc", prefix: "" },
  { value: 4.9,   suffix: "/5", label: "Đánh giá dịch vụ",     prefix: "" },
]

function useCountUp(target, duration = 1600, started = false) {
  const [current, setCurrent] = useState(0)
  const raf = useRef(null)

  useEffect(() => {
    if (!started) return
    const start = performance.now()
    const isFloat = !Number.isInteger(target)
    function tick(now) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      const val = isFloat
        ? parseFloat((eased * target).toFixed(1))
        : Math.round(eased * target)
      setCurrent(val)
      if (progress < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [started, target, duration])

  return current
}

function StatItem({ value, suffix, label, prefix, started }) {
  const count = useCountUp(value, 1600, started)
  const isFloat = !Number.isInteger(value)
  const display = isFloat
    ? count.toFixed(1).replace(".", ",")
    : count >= 1000
      ? count.toLocaleString("vi-VN")
      : count

  return (
    <div className="counter-stat">
      <b>
        {prefix}{display}{suffix}
      </b>
      <span>{label}</span>
    </div>
  )
}

function CounterBelt() {
  const ref = useRef(null)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); obs.disconnect() } },
      { threshold: 0.4 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section className="benefits counter-belt" ref={ref}>
      {STATS.map((s) => (
        <StatItem key={s.label} {...s} started={started} />
      ))}
    </section>
  )
}


