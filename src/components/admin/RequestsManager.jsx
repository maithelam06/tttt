import { useCallback, useEffect, useState } from "react"
import { api } from "../../services/api"
import { toast } from "../ui/Toast"
import ConfirmModal from "../common/ConfirmModal"

/* ── Constants ──────────────────────────────────────────── */
const REQUEST_STATUSES = [
  "PENDING", "PROCESSING", "ASSIGNED", "IN_PROGRESS", "COMPLETED", "CANCELLED",
]

const STATUS_CFG = {
  PENDING:     { text: "Chờ tiếp nhận",  color: "#d97706", bg: "#fef3c7", dot: "🟡" },
  PROCESSING:  { text: "Đang xem xét",   color: "#2563eb", bg: "#dbeafe", dot: "🔵" },
  ASSIGNED:    { text: "Đã phân công",   color: "#7c3aed", bg: "#ede9fe", dot: "🟣" },
  IN_PROGRESS: { text: "Đang thực hiện", color: "#0891b2", bg: "#cffafe", dot: "🔷" },
  COMPLETED:   { text: "Hoàn thành",     color: "#16a34a", bg: "#dcfce7", dot: "✅" },
  CANCELLED:   { text: "Đã hủy",         color: "#dc2626", bg: "#fee2e2", dot: "❌" },
}

const TYPE_CFG = {
  CONSULTATION: { text: "Tư vấn sản phẩm", icon: "💬", color: "#2563eb", bg: "#dbeafe" },
  INSTALLATION: { text: "Lắp đặt",         icon: "🔧", color: "#059669", bg: "#d1fae5" },
  WARRANTY:     { text: "Bảo hành",         icon: "🛡️", color: "#7c3aed", bg: "#ede9fe" },
  OTHER:        { text: "Khác",              icon: "📋", color: "#64748b", bg: "#f1f5f9" },
}

const JOURNEY = [
  { key: "PENDING",     icon: "📥", label: "Tiếp nhận" },
  { key: "PROCESSING",  icon: "🔍", label: "Xem xét & liên hệ" },
  { key: "ASSIGNED",    icon: "👷", label: "Phân công nhân viên" },
  { key: "IN_PROGRESS", icon: "🔧", label: "Đang thực hiện" },
  { key: "COMPLETED",   icon: "✅", label: "Hoàn thành" },
]

const STATUS_ORDER = ["PENDING","PROCESSING","ASSIGNED","IN_PROGRESS","COMPLETED","CANCELLED"]
const journeyIdx = (s) => STATUS_ORDER.indexOf(s)

/* ── Component ──────────────────────────────────────────── */
export default function RequestsManager({ user }) {
  const [items,       setItems]       = useState([])
  const [technicians, setTechs]       = useState([])
  const [loading,     setLoading]     = useState(true)
  const [selected,    setSelected]    = useState(null)
  const [filterType,  setFilterType]  = useState("ALL")   // ALL | CONSULTATION | INSTALLATION | WARRANTY
  const [filterSt,    setFilterSt]    = useState("ALL")   // ALL | PENDING | ...
  const [keyword,     setKeyword]     = useState("")

  const [selectedTechId, setSelectedTechId] = useState("")

  const isTech  = user?.role?.toLowerCase() === "technician"
  const isStaff = user?.role?.toLowerCase() === "staff"

  /* ── Load ──────────────────────────────────────────────── */
  const load = useCallback(async () => {
    setLoading(true)
    try {
      const reqs = await api.requests.list().catch((err) => {
        console.error("Failed to load requests:", err)
        toast.error("Không thể lấy danh sách yêu cầu: " + (err.message || "Lỗi máy chủ"))
        return []
      })
      const techs = await api.admin.list("technicians").catch(() => [])
      setItems(Array.isArray(reqs) ? reqs.filter((r) => !r.note?.includes("[Newsletter]") && r.customerName !== "Khách đăng ký email") : [])
      setTechs(Array.isArray(techs) ? techs : [])
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  /* ── Mutations ─────────────────────────────────────────── */
  async function changeStatus(id, value) {
    try {
      await api.requests.status(id, value)
      const label = STATUS_CFG[value]?.text || value
      toast.success(`Cập nhật → ${label}`)
      applyUpdate(id, { status: value })
    } catch (err) { toast.error(err.message) }
  }

  async function assignTech(reqId, techId) {
    if (!techId) { toast.error("Vui lòng chọn kỹ thuật viên!"); return }
    try {
      const updated = await api.requests.assign(reqId, Number(techId))
      const tech = technicians.find((t) => t.id === Number(techId))
      toast.success(`Đã phân công: ${tech?.fullName || "Kỹ thuật viên"}`)
      applyUpdate(reqId, { technician: updated.technician || tech, status: updated.status || "ASSIGNED" })
    } catch (err) { toast.error(err.message) }
  }

  const [requestConfirm, setRequestConfirm] = useState(null)

  function doCancel(id) {
    setRequestConfirm({
      title: "Hủy yêu cầu",
      message: "Bạn có chắc chắn muốn chuyển trạng thái yêu cầu này sang HỦY?",
      danger: false,
      confirmText: "Xác nhận Hủy",
      onConfirm: async () => {
        setRequestConfirm(null)
        await changeStatus(id, "CANCELLED")
      },
    })
  }

  function doDelete(id) {
    setRequestConfirm({
      title: "Xóa vĩnh viễn yêu cầu",
      message: "Bạn có chắc chắn muốn XÓA VĨNH VIỄN yêu cầu này khỏi hệ thống? Thao tác này không thể hoàn tác.",
      danger: true,
      confirmText: "Xác nhận Xóa",
      onConfirm: async () => {
        setRequestConfirm(null)
        try {
          await api.requests.remove(id)
          toast.success("Đã xóa vĩnh viễn yêu cầu thành công!")
          setItems((prev) => prev.filter((r) => r.id !== id))
          if (selected?.id === id) setSelected(null)
        } catch (err) {
          toast.error(err.message || "Không thể xóa yêu cầu.")
        }
      },
    })
  }

  function applyUpdate(id, patch) {
    setItems((prev) => prev.map((r) => r.id === id ? { ...r, ...patch } : r))
    setSelected((s) => s?.id === id ? { ...s, ...patch } : s)
  }

  // For Technician: find own record and toggle status (AVAILABLE <-> BUSY)
  const myTechRecord = technicians.find(
    (t) => t.username === user?.username || t.fullName?.toLowerCase().includes(user?.fullName?.split(" ")[0]?.toLowerCase() || ""),
  )

  async function toggleMyBusyStatus() {
    if (!myTechRecord) {
      toast.error("Không tìm thấy thông tin kỹ thuật viên tương ứng.")
      return
    }
    const nextStatus = myTechRecord.status === "BUSY" ? "AVAILABLE" : "BUSY"
    try {
      await api.admin.status("technicians", myTechRecord.id, nextStatus)
      setTechs((prev) => prev.map((t) => (t.id === myTechRecord.id ? { ...t, status: nextStatus } : t)))
      if (nextStatus === "BUSY") {
        toast.success("Đã báo bận thành công! Admin và Nhân viên điều phối đã nhận được thông tin.")
      } else {
        toast.success("Đã chuyển sang trạng thái Sẵn sàng nhận việc!")
      }
    } catch (err) {
      toast.error("Không thể cập nhật trạng thái: " + err.message)
    }
  }

  /* ── Filter ────────────────────────────────────────────── */
  const filtered = items.filter((r) => {
    // Nếu là Kỹ thuật viên -> CHỈ HIỂN THỊ CÁC YÊU CẦU ĐƯỢC PHÂN CÔNG CHO CHÍNH KỸ THUẬT VIÊN NÀY
    if (isTech) {
      const techName = r.technician?.fullName?.toLowerCase().trim() || ""
      const myName   = user?.fullName?.toLowerCase().trim() || ""
      
      const isMyId = myTechRecord?.id && r.technician?.id === myTechRecord.id
      const isMyUsername = myTechRecord?.username && r.technician?.username === myTechRecord.username
      const isMyNameMatch = techName && (
        techName === myName ||
        (myName && (techName.includes(myName.split(" ")[0]) || myName.includes(techName.split(" ")[0])))
      )

      if (!isMyId && !isMyUsername && !isMyNameMatch) return false
    }

    const matchType = filterType === "ALL" || r.type === filterType
    const matchSt   = filterSt   === "ALL" || r.status === filterSt
    const q = keyword.toLowerCase()
    const matchKw = !q || [r.customerName, r.phone, r.code].join(" ").toLowerCase().includes(q)
    return matchType && matchSt && matchKw
  })

  /* ── KPI counts ────────────────────────────────────────── */
  const displayItems = isTech ? filtered : items
  const total   = displayItems.length
  const pending = displayItems.filter((r) => r.status === "PENDING").length
  const active  = displayItems.filter((r) => ["PROCESSING","ASSIGNED","IN_PROGRESS"].includes(r.status)).length
  const done    = displayItems.filter((r) => r.status === "COMPLETED").length

  const typeCounts = {
    CONSULTATION: items.filter((r) => r.type === "CONSULTATION").length,
    INSTALLATION: items.filter((r) => r.type === "INSTALLATION").length,
    WARRANTY:     items.filter((r) => r.type === "WARRANTY").length,
  }

  /* ── Render ────────────────────────────────────────────── */
  return (
    <section className="module-page requests-page">

      {/* Header */}
      <div className="module-head">
        <div>
          <span>{isTech ? "GIAO DIỆN KỸ THUẬT VIÊN" : "QUẢN LÝ KHÁCH HÀNG"}</span>
          <h1>{isTech ? "Lịch làm việc & Yêu cầu phân công" : "Yêu cầu tư vấn & Lắp đặt & Bảo hành"}</h1>
          <p>{isTech ? "Theo dõi lịch làm việc và cập nhật tiến độ cho Admin & Nhân viên điều phối." : "Tiếp nhận, phân công kỹ thuật viên và theo dõi hành trình xử lý từng yêu cầu của khách hàng."}</p>
        </div>
        <button onClick={load} type="button">↻ Làm mới</button>
      </div>

      {/* Technician Status Banner */}
      {isTech && (
        <div className="req-tech-banner" style={{ background: "#f8fafc", border: "1.5px solid #cbd5e1", borderRadius: 12, padding: "16px 20px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <strong style={{ color: "#0f172a", fontSize: 15, display: "block" }}>👷 Kỹ thuật viên: {user?.fullName}</strong>
            <span style={{ color: "#64748b", fontSize: 13 }}>
              Trạng thái làm việc: {myTechRecord?.status === "BUSY" ? "⏳ ĐANG BÁO BẬN (Cần hỗ trợ điều phối)" : "🟢 SẴN SÀNG NHẬN VIỆC"}
            </span>
          </div>
          <button
            onClick={toggleMyBusyStatus}
            style={{
              background: myTechRecord?.status === "BUSY" ? "#16a34a" : "#dc2626",
              color: "#fff",
              border: 0,
              borderRadius: 8,
              padding: "10px 18px",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer"
            }}
            type="button"
          >
            {myTechRecord?.status === "BUSY" ? "🟢 Chuyển Sẵn sàng" : "⏳ Báo bận cho Admin & Điều phối"}
          </button>
        </div>
      )}

      {/* KPI row */}
      <div className="req-kpi-row">
        {[
          { label: "Tổng yêu cầu",    value: total,   color: "#2563eb" },
          { label: "Chờ tiếp nhận",   value: pending, color: "#d97706" },
          { label: "Đang xử lý",      value: active,  color: "#0891b2" },
          { label: "Hoàn thành",      value: done,    color: "#16a34a" },
        ].map(({ label, value, color }) => (
          <div className="req-kpi" key={label} style={{ "--kpi-c": color }}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>

      {/* Type tabs */}
      <div className="req-type-tabs">
        <button
          className={filterType === "ALL" ? "active" : ""}
          onClick={() => setFilterType("ALL")}
          type="button"
        >
          Tất cả ({total})
        </button>
        {Object.entries(TYPE_CFG).filter(([k]) => k !== "OTHER").map(([key, cfg]) => (
          <button
            className={filterType === key ? "active" : ""}
            key={key}
            onClick={() => setFilterType(key)}
            style={{ "--type-c": cfg.color }}
            type="button"
          >
            {cfg.icon} {cfg.text} ({typeCounts[key] || 0})
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="req-toolbar">
        <input
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="🔍  Tìm theo tên, SĐT, mã yêu cầu..."
          value={keyword}
        />
        <div className="req-filter-tabs">
          <button
            className={filterSt === "ALL" ? "active" : ""}
            onClick={() => setFilterSt("ALL")}
            type="button"
          >
            Tất cả trạng thái
          </button>
          {REQUEST_STATUSES.map((s) => {
            const cnt = items.filter((r) => r.status === s).length
            if (!cnt) return null
            const cfg = STATUS_CFG[s]
            return (
              <button
                className={filterSt === s ? "active" : ""}
                key={s}
                onClick={() => setFilterSt(s)}
                style={{ "--tab-c": cfg.color }}
                type="button"
              >
                {cfg.dot} {cfg.text} ({cnt})
              </button>
            )
          })}
        </div>
      </div>

      <div className="req-layout">
        {/* Table */}
        <div className="req-table-wrap">
          {loading ? (
            <div className="table-panel" style={{ padding: 40, textAlign: "center", color: "#64748b" }}>
              ⏳ Đang tải...
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-module">
              <i>📭</i>
              <p>Không có yêu cầu nào phù hợp bộ lọc.</p>
            </div>
          ) : (
            <div className="table-panel">
              <table>
                <thead>
                  <tr>
                    <th>Mã YC</th>
                    <th>Khách hàng</th>
                    <th>Loại yêu cầu</th>
                    <th>Nhân viên phụ trách</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => {
                    const st   = STATUS_CFG[r.status]  || STATUS_CFG.PENDING
                    const type = TYPE_CFG[r.type]       || TYPE_CFG.OTHER
                    return (
                      <tr
                        className={selected?.id === r.id ? "row-active" : ""}
                        key={r.id}
                        onClick={() => {
                          setSelected(r)
                          setSelectedTechId(r.technician?.id || "")
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        <td>
                          <b className="req-code">{r.code || `#${r.id}`}</b>
                          <small style={{ display: "block", color: "#94a3b8", fontSize: 10 }}>
                            {r.createdAt ? new Date(r.createdAt).toLocaleDateString("vi-VN") : ""}
                          </small>
                        </td>
                        <td>
                          <div className="req-customer">
                            <span>{r.customerName}</span>
                            <small>{r.phone}</small>
                            {r.email && <small style={{ color: "#94a3b8" }}>{r.email}</small>}
                          </div>
                        </td>
                        <td>
                          <span className="req-type-badge" style={{ background: type.bg, color: type.color }}>
                            {type.icon} {type.text}
                          </span>
                        </td>
                        <td>
                          {r.technician
                            ? <span className="tech-assigned">{r.technician.fullName}</span>
                            : <span className="tech-none">Chưa phân công</span>}
                        </td>
                        <td>
                          <span className="status-pill" style={{ background: st.bg, color: st.color }}>
                            {st.dot} {st.text}
                          </span>
                        </td>
                        <td onClick={(e) => e.stopPropagation()}>
                          <div className="table-actions">
                            <select
                              onChange={(e) => changeStatus(r.id, e.target.value)}
                              value={r.status}
                            >
                              {REQUEST_STATUSES.map((s) => (
                                <option key={s} value={s}>{STATUS_CFG[s]?.text}</option>
                              ))}
                            </select>
                            {!isTech && (
                              <>
                                <button className="btn-secondary" onClick={() => doCancel(r.id)} style={{ padding: "4px 8px", fontSize: 12 }} type="button">
                                  Hủy
                                </button>
                                <button className="btn-danger" onClick={() => doDelete(r.id)} style={{ padding: "4px 8px", fontSize: 12, background: "#ef4444", color: "#fff", border: 0, borderRadius: 6, cursor: "pointer" }} type="button">
                                  Xóa
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="req-detail">
            {/* Header */}
            <div className="req-detail-head">
              <div>
                <span className="req-detail-code">{selected.code || `#${selected.id}`}</span>
                <h3>{selected.customerName}</h3>
                <div style={{ display: "flex", gap: 10, marginTop: 4, flexWrap: "wrap" }}>
                  <a href={`tel:${selected.phone}`}>{selected.phone}</a>
                  {selected.email && <span style={{ color: "#64748b", fontSize: 12 }}>{selected.email}</span>}
                </div>
              </div>
              <button className="modal-close-sm" onClick={() => setSelected(null)} type="button">×</button>
            </div>

            {/* Type badge */}
            <div>
              {(() => {
                const type = TYPE_CFG[selected.type] || TYPE_CFG.OTHER
                const st   = STATUS_CFG[selected.status] || STATUS_CFG.PENDING
                return (
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <span className="req-type-badge" style={{ background: type.bg, color: type.color, fontSize: 13, padding: "6px 14px" }}>
                      {type.icon} {type.text}
                    </span>
                    <span className="status-pill" style={{ background: st.bg, color: st.color, fontSize: 13, padding: "6px 14px" }}>
                      {st.dot} {st.text}
                    </span>
                  </div>
                )
              })()}
            </div>

            {/* Journey tracker */}
            <div className="req-journey">
              <h4>Hành trình xử lý</h4>
              {selected.status === "CANCELLED" ? (
                <div style={{ background: "#fee2e2", borderRadius: 10, padding: "12px 16px", color: "#b91c1c", fontWeight: 600, fontSize: 13 }}>
                  ❌ Yêu cầu đã bị hủy
                </div>
              ) : (
                <div className="journey-steps">
                  {JOURNEY.map((step, idx) => {
                    const cur  = journeyIdx(selected.status)
                    const done = idx < cur
                    const active = idx === cur
                    return (
                      <div key={step.key}>
                        <div className={`journey-step ${done ? "done" : ""} ${active ? "active" : ""}`}>
                          <div className="journey-dot">{done ? "✓" : step.icon}</div>
                          <span>{step.label}</span>
                        </div>
                        {idx < JOURNEY.length - 1 && <div className="journey-line" />}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Info grid */}
            <div className="req-info-grid">
              {selected.address && (
                <div style={{ gridColumn: "1/-1" }}>
                  <span>Địa chỉ lắp đặt</span>
                  <strong>{selected.address}</strong>
                </div>
              )}
              {selected.appointmentAt && (
                <div style={{ gridColumn: "1/-1" }}>
                  <span>Lịch hẹn</span>
                  <strong>{new Date(selected.appointmentAt).toLocaleString("vi-VN")}</strong>
                </div>
              )}
              {selected.createdAt && (
                <div>
                  <span>Ngày tạo</span>
                  <strong>{new Date(selected.createdAt).toLocaleString("vi-VN")}</strong>
                </div>
              )}
              {selected.assignedAt && (
                <div>
                  <span>Ngày phân công</span>
                  <strong>{new Date(selected.assignedAt).toLocaleString("vi-VN")}</strong>
                </div>
              )}
              {selected.note && (
                <div style={{ gridColumn: "1/-1" }}>
                  <span>Ghi chú khách hàng</span>
                  <strong style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{selected.note}</strong>
                </div>
              )}
            </div>

            {/* Assign technician (Admin & Staff only) */}
            {!isTech && (
              <div className="req-assign">
                <h4>Phân công kỹ thuật viên</h4>
                <div className="req-assign-row">
                  <select
                    onChange={(e) => setSelectedTechId(e.target.value)}
                    value={selectedTechId || selected.technician?.id || ""}
                  >
                    <option value="">-- Chọn kỹ thuật viên --</option>
                    {technicians.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.fullName}{t.area ? ` · ${t.area}` : ""} — {t.status === "AVAILABLE" ? "✅ Sẵn sàng" : "⏳ Đang bận"}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => assignTech(selected.id, selectedTechId || selected.technician?.id)}
                    type="button"
                  >
                    Phân công →
                  </button>
                </div>
                {selected.technician && (
                  <div className="req-assigned-badge">
                    👷 Đã phân công: <b>{selected.technician.fullName}</b>
                    {selected.technician.area && ` — ${selected.technician.area}`}
                  </div>
                )}
              </div>
            )}

            {/* Quick status */}
            <div className="req-quick-actions">
              <h4>Cập nhật trạng thái nhanh</h4>
              <div className="req-action-btns">
                {REQUEST_STATUSES.filter((s) => s !== selected.status).map((s) => {
                  const cfg = STATUS_CFG[s]
                  return (
                    <button
                      key={s}
                      onClick={() => changeStatus(selected.id, s)}
                      style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}40` }}
                      type="button"
                    >
                      {cfg.dot} {cfg.text}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>
      {requestConfirm && (
        <ConfirmModal
          cancelText="Hủy bỏ"
          confirmText={requestConfirm.confirmText}
          danger={requestConfirm.danger}
          isOpen={Boolean(requestConfirm)}
          message={requestConfirm.message}
          onCancel={() => setRequestConfirm(null)}
          onConfirm={requestConfirm.onConfirm}
          title={requestConfirm.title}
        />
      )}
    </section>
  )
}
