import { useState } from "react"
import { api } from "../../services/api"
import { toast } from "../ui/Toast"

const services = [
  ["install",  "Lắp đặt chuyên nghiệp",  "Đội ngũ tư vấn, kỹ thuật giàu kinh nghiệm"],
  ["delivery", "Giao nhận tiện lợi",      "Giao nhận nhanh chóng, đúng lịch hẹn"],
  ["payment",  "Thanh toán linh hoạt",    "Nhiều phương thức thanh toán tiện lợi"],
  ["return",   "Đổi trả dễ dàng",         "Hỗ trợ đổi sản phẩm lỗi kỹ thuật"],
  ["care",     "Hậu mãi chu đáo",         "Chăm sóc trong suốt vòng đời sản phẩm"],
]

function SiteFooter() {
  const [email,   setEmail]   = useState("")
  const [loading, setLoading] = useState(false)
  const [done,    setDone]    = useState(false)

  async function handleNewsletter(e) {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    try {
      await api.subscribers.subscribe(email.trim()).catch(() => null)
      setDone(true)
      toast.success("🎉 Đã đăng ký nhận tin ưu đãi thành công!")
    } catch {
      toast.error("Không thể đăng ký lúc này, vui lòng thử lại sau.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Service benefits belt */}
      <section className="service-benefits">
        {services.map(([icon, title, text]) => (
          <article key={title}>
            <ServiceIcon name={icon} />
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </section>

      {/* Support + Newsletter */}
      <section className="support-footer">
        {/* Left: contact info */}
        <div className="support-contact">
          <h3>
            Tổng đài hỗ trợ <span>(8h00 – 22h00)</span>
          </h3>
          <div className="support-info-rows">
            <div className="support-info-row">
              <span>🛒 Mua hàng</span>
              <a href="tel:0896619196">0896 619 196</a>
            </div>
            <div className="support-info-row">
              <span>🔧 Giao nhận &amp; Bảo hành</span>
              <strong>0934 969 286</strong>
            </div>
            <div className="support-info-row">
              <span>✉️ Email</span>
              <a href="mailto:sslock.vn@gmail.com">sslock.vn@gmail.com</a>
            </div>
          </div>
          <hr />
          <address className="support-address">
            📍 Số 15 Lê Văn Thiêm, phường Thanh Xuân, TP Hà Nội
          </address>
        </div>

        {/* Right: newsletter */}
        <div className="support-newsletter">
          <h3>Nhận khuyến mãi từ SSLOCK.VN</h3>
          <p className="support-newsletter-desc">
            Đăng ký email để nhận ngay ưu đãi, sản phẩm mới và chương trình khuyến mãi định kỳ.
          </p>
          {done ? (
            <div className="newsletter-done">
              ✅ Cảm ơn bạn đã đăng ký! Chúng tôi sẽ gửi ưu đãi sớm nhất.
            </div>
          ) : (
            <form className="newsletter-form" onSubmit={handleNewsletter}>
              <div className="newsletter-input-row">
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Nhập địa chỉ email của bạn"
                  required
                  type="email"
                  value={email}
                />
                <button disabled={loading} type="submit">
                  {loading ? "..." : "Đăng ký"}
                </button>
              </div>
              <small>Nhận tin sản phẩm mới và chương trình ưu đãi định kỳ.</small>
            </form>
          )}
        </div>
      </section>
    </>
  )
}

function ServiceIcon({ name }) {
  const paths = {
    install:  "M12 3v5M12 16v5M3 12h5M16 12h5M5.6 5.6l3.5 3.5M14.9 14.9l3.5 3.5M18.4 5.6l-3.5 3.5M9.1 14.9l-3.5 3.5",
    delivery: "M3 6h11v11H3zM14 10h4l3 4v3h-7zM7 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM18 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z",
    payment:  "M5 3h14v18H5zM8 7h8M8 11h3M8 15h8M15 18h1",
    return:   "M12 3 4 7v10l8 4 8-4V7zM4 7l8 4 8-4M12 11v10",
    care:     "M12 3 4 6v6c0 5 3.4 8 8 10 4.6-2 8-5 8-10V6zM8.5 12l2.2 2.2 4.8-5",
  }
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d={paths[name]} />
    </svg>
  )
}

export default SiteFooter
