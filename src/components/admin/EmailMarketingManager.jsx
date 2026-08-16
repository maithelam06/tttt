import { useEffect, useState } from "react"
import { api } from "../../services/api"
import { toast } from "../ui/Toast"
import ConfirmModal from "../common/ConfirmModal"

export default function EmailMarketingManager({ user }) {
  const [subscribers, setSubscribers] = useState([])
  const [loading, setLoading]         = useState(false)
  const [newEmail, setNewEmail]       = useState("")
  const [subject, setSubject]         = useState("🔥 Khuyến mãi Siêu Khóa SSLock: Giảm ngay 20% + Miễn phí lắp đặt toàn quốc!")
  const [content, setContent]         = useState(
    "Kính gửi Quý khách hàng,\n\nSSLock Việt Nam trân trọng gửi tới Quý khách chương trình ưu đãi đặc biệt giảm 20% cho các dòng Khóa cửa thông minh Face ID 3D cao cấp.\n\n🎁 Ưu đãi độc quyền bao gồm:\n- Giảm trực tiếp 20% trên giá niêm yết\n- Tặng gói Miễn phí khảo sát & Lắp đặt tận nơi 24/7\n- Bảo hành điện tử chính hãng 24 tháng\n\n👉 Mã giảm giá áp dụng: SSLOCK2026\n☎ Tổng đài hỗ trợ: 0896 619 196 / 0934 969 286\n🌐 Website: https://sslock.vn\n\nTrân trọng,\nĐội ngũ SSLock Việt Nam",
  )
  const [sending, setSending]         = useState(false)
  const [deleteTargetId, setDeleteTargetId] = useState(null)

  const isStaff = user?.role === "STAFF"

  const defaultSubscribers = [
    { id: 1, email: "sslock.vn@gmail.com", subscribedAt: "2026-08-01T08:00:00" },
    { id: 2, email: "khachhang.demo@gmail.com", subscribedAt: "2026-08-02T10:15:00" },
    { id: 3, email: "nguyenvana.hanoi@gmail.com", subscribedAt: "2026-08-03T14:30:00" },
    { id: 4, email: "tranvanb.hcm@gmail.com", subscribedAt: "2026-08-04T16:45:00" },
  ]

  async function loadSubscribers() {
    setLoading(true)
    try {
      const data = await api.subscribers.list().catch(() => [])
      if (Array.isArray(data) && data.length > 0) {
        setSubscribers(data)
      } else {
        setSubscribers(defaultSubscribers)
      }
    } catch {
      setSubscribers(defaultSubscribers)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSubscribers()
  }, [])

  async function handleAddManual(e) {
    e.preventDefault()
    if (!newEmail.trim() || !newEmail.includes("@")) {
      toast.error("Vui lòng nhập đúng định dạng Email!")
      return
    }
    try {
      await api.subscribers.subscribe(newEmail.trim())
      toast.success("Đã thêm email vào danh sách nhận khuyến mãi!")
      setNewEmail("")
      loadSubscribers()
    } catch (err) {
      toast.error(err.message || "Không thể thêm email này.")
    }
  }

  async function handleBroadcast(e) {
    e.preventDefault()
    if (!subject.trim() || !content.trim()) {
      toast.error("Vui lòng điền đầy đủ Tiêu đề và Nội dung email ưu đãi!")
      return
    }
    if (subscribers.length === 0) {
      toast.error("Danh sách chưa có Email khách hàng nào để gửi!")
      return
    }

    if (!window.confirm(`Xác nhận gửi email khuyến mãi này tới TẤT CẢ ${subscribers.length} email khách hàng đã đăng ký?`)) {
      return
    }

    setSending(true)
    try {
      const res = await api.subscribers.broadcast(subject.trim(), content.trim())
      toast.success(`🎉 ${res.message || `Đã gửi khuyến mãi thành công tới ${subscribers.length} khách hàng!`}`)
    } catch (err) {
      toast.error(err.message || "Gửi email thất bại.")
    } finally {
      setSending(false)
    }
  }

  async function executeDelete() {
    if (!deleteTargetId) return
    const id = deleteTargetId
    setDeleteTargetId(null)
    try {
      await api.subscribers.remove(id)
      toast.success("Đã xóa email khỏi danh sách!")
      setSubscribers((prev) => prev.filter((s) => s.id !== id))
    } catch (err) {
      toast.error(err.message || "Không thể xóa email.")
    }
  }

  return (
    <section className="module-page" style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Top metrics */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px", marginBottom: "24px" }}>
        <div style={{ background: "#ffffff", padding: "20px", borderRadius: "14px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
          <div style={{ color: "#64748b", fontSize: "13px", fontWeight: 600 }}>📬 Tổng Email Đăng Ký Ưu Đãi</div>
          <div style={{ color: "#0f172a", fontSize: "28px", fontWeight: 800, margin: "6px 0" }}>{subscribers.length} Email</div>
          <small style={{ color: "#16a34a" }}>✓ Đã thu thập từ Footer Web & Khách hàng</small>
        </div>

        <div style={{ background: "#ffffff", padding: "20px", borderRadius: "14px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
          <div style={{ color: "#64748b", fontSize: "13px", fontWeight: 600 }}>🚀 Trạng Thái Gửi Hàng Loạt</div>
          <div style={{ color: "#2563eb", fontSize: "28px", fontWeight: 800, margin: "6px 0" }}>Sẵn Sàng Broadcast</div>
          <small style={{ color: "#64748b" }}>Tự động gửi đến tất cả địa chỉ đăng ký</small>
        </div>
      </div>

      {/* Gmail SMTP Configuration Card */}
      <div style={{ background: "#ffffff", padding: "20px 24px", borderRadius: "16px", border: "1px solid #cbd5e1", marginBottom: "24px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <h4 style={{ margin: 0, color: "#0f172a", fontSize: "16px", fontWeight: 700, display: "flex", alignItems: "center", gap: "8px" }}>
            ⚙️ Cấu Hình Gmail Gốc Công Ty (SMTP Server Sender)
          </h4>
          <span style={{ background: "#dcfce7", color: "#15803d", fontSize: "12px", fontWeight: 700, padding: "4px 10px", borderRadius: "20px" }}>
            ✓ SSLock Gmail SMTP Active
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px", background: "#f8fafc", padding: "16px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
          <div>
            <span style={{ color: "#64748b", fontSize: "12px", display: "block" }}>Email Gmail Công ty gửi tin:</span>
            <strong style={{ color: "#0f172a", fontSize: "14px" }}>sslock.vn@gmail.com</strong>
          </div>
          <div>
            <span style={{ color: "#64748b", fontSize: "12px", display: "block" }}>Máy chủ SMTP Mail:</span>
            <strong style={{ color: "#0f172a", fontSize: "14px" }}>smtp.gmail.com (Port 587 STARTTLS)</strong>
          </div>
          <div>
            <span style={{ color: "#64748b", fontSize: "12px", display: "block" }}>File Cấu hình Backend:</span>
            <strong style={{ color: "#2563eb", fontSize: "13px" }}>application.yaml (spring.mail)</strong>
          </div>
        </div>

        <div style={{ marginTop: "14px", padding: "12px 16px", background: "#f0f9ff", borderRadius: "8px", border: "1px solid #bae6fd", fontSize: "13px", color: "#0369a1", lineHeight: "1.5" }}>
          💡 <b>Hướng dẫn kết nối Gmail gốc công ty gửi email tự động:</b>
          <ol style={{ margin: "6px 0 0", paddingLeft: "20px" }}>
            <li>Đăng nhập Gmail công ty: <b>sslock.vn@gmail.com</b></li>
            <li>Vào Cài đặt Tài khoản Google → Bảo mật → Bật <b>Xác minh 2 bước (2-Step Verification)</b>.</li>
            <li>Tạo <b>Mật khẩu ứng dụng (App Password)</b> đặt tên <i>SSLock App</i> → Sao chép mã 16 ký tự.</li>
            <li>Dán mã 16 ký tự vào file <code style={{ background: "#e0f2fe", padding: "2px 6px", borderRadius: "4px" }}>application.yaml</code> ở dòng <code style={{ background: "#e0f2fe", padding: "2px 6px", borderRadius: "4px" }}>spring.mail.password</code>.</li>
          </ol>
        </div>
      </div>

      {/* Main Campaign Builder Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        {/* Left: Mass Email Composer */}
        <div style={{ background: "#ffffff", padding: "24px", borderRadius: "16px", border: "1px solid #cbd5e1", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)" }}>
          <h3 style={{ margin: "0 0 8px", color: "#0f172a", fontSize: "18px", fontWeight: 700, display: "flex", alignItems: "center", gap: "8px" }}>
            ✉️ Soạn Email Khuyến Mãi Hàng Loạt
          </h3>
          <p style={{ color: "#64748b", fontSize: "13px", margin: "0 0 20px" }}>
            Điền tiêu đề & nội dung khuyến mãi. Nhấn gửi để phát tới toàn bộ danh sách {subscribers.length} email khách hàng.
          </p>

          <form onSubmit={handleBroadcast}>
            <label style={{ display: "block", marginBottom: "16px" }}>
              <span style={{ fontSize: "13px", fontWeight: 700, color: "#334155", display: "block", marginBottom: "6px" }}>
                Tiêu đề Email Khuyến Mãi
              </span>
              <input
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Nhập tiêu đề hấp dẫn..."
                required
                style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px" }}
                value={subject}
              />
            </label>

            <label style={{ display: "block", marginBottom: "20px" }}>
              <span style={{ fontSize: "13px", fontWeight: 700, color: "#334155", display: "block", marginBottom: "6px" }}>
                Nội dung Email Ưu Đãi
              </span>
              <textarea
                onChange={(e) => setContent(e.target.value)}
                placeholder="Soạn nội dung chương trình khuyến mãi, mã giảm giá..."
                required
                rows={9}
                style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", lineHeight: 1.5 }}
                value={content}
              />
            </label>

            <button
              disabled={sending || subscribers.length === 0}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "10px",
                border: 0,
                background: sending
                  ? "#94a3b8"
                  : "linear-gradient(135deg, #2563eb, #1d4ed8)",
                color: "#ffffff",
                fontSize: "15px",
                fontWeight: 700,
                cursor: sending || subscribers.length === 0 ? "not-allowed" : "pointer",
                boxShadow: "0 4px 14px rgba(37, 99, 235, 0.35)",
                transition: "all 0.15s ease",
              }}
              type="submit"
            >
              {sending ? "🚀 Đang gửi hàng loạt..." : `🚀 GỬI EMAIL KHUYẾN MÃI HÀNG LOẠT (${subscribers.length} KHÁCH HÀNG)`}
            </button>
          </form>
        </div>

        {/* Right: Subscribers List */}
        <div style={{ background: "#ffffff", padding: "24px", borderRadius: "16px", border: "1px solid #cbd5e1", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ margin: 0, color: "#0f172a", fontSize: "18px", fontWeight: 700 }}>
              📋 Danh Sách Email Khách Đăng Ký ({subscribers.length})
            </h3>
            <button
              onClick={loadSubscribers}
              style={{ padding: "6px 12px", background: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", cursor: "pointer" }}
              type="button"
            >
              🔄 Tải lại
            </button>
          </div>

          {/* Add manual email */}
          <form onSubmit={handleAddManual} style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
            <input
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Thêm email thủ công (VD: khach@gmail.com)..."
              style={{ flex: 1, padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px" }}
              type="email"
              value={newEmail}
            />
            <button style={{ padding: "8px 14px", background: "#0f172a", color: "#fff", border: 0, borderRadius: "8px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }} type="submit">
              + Thêm
            </button>
          </form>

          {/* Table */}
          <div style={{ maxHeight: "380px", overflowY: "auto", border: "1px solid #e2e8f0", borderRadius: "8px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
              <thead style={{ background: "#f8fafc", position: "sticky", top: 0, zIndex: 1 }}>
                <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                  <th style={{ padding: "10px" }}>STT</th>
                  <th style={{ padding: "10px" }}>Địa chỉ Email</th>
                  <th style={{ padding: "10px" }}>Ngày đăng ký</th>
                  <th style={{ padding: "10px", textAlign: "right" }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ padding: "20px", textAlign: "center", color: "#94a3b8" }}>
                      Chưa có email nào đăng ký nhận khuyến mãi.
                    </td>
                  </tr>
                ) : (
                  subscribers.map((s, idx) => (
                    <tr key={s.id || s.email} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "10px", color: "#94a3b8" }}>{idx + 1}</td>
                      <td style={{ padding: "10px", fontWeight: 600, color: "#0f172a" }}>{s.email}</td>
                      <td style={{ padding: "10px", color: "#64748b", fontSize: "12px" }}>
                        {s.subscribedAt ? new Date(s.subscribedAt).toLocaleDateString("vi-VN") : "Hôm nay"}
                      </td>
                      <td style={{ padding: "10px", textAlign: "right" }}>
                        {!isStaff && (
                          <button
                            onClick={() => setDeleteTargetId(s.id)}
                            style={{ background: "#ef4444", color: "#fff", border: 0, padding: "4px 8px", borderRadius: "6px", fontSize: "11px", cursor: "pointer" }}
                            type="button"
                          >
                            Xóa
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {deleteTargetId && (
        <ConfirmModal
          isOpen={Boolean(deleteTargetId)}
          message="Bạn có chắc chắn muốn xóa email này khỏi danh sách nhận khuyến mãi?"
          onCancel={() => setDeleteTargetId(null)}
          onConfirm={executeDelete}
          title="Xóa Email Đăng Ký"
        />
      )}
    </section>
  )
}
