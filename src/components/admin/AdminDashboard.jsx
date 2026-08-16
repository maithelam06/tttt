import { useEffect, useMemo, useState } from "react"
import { api } from "../../services/api"
import { formatMoney } from "../../utils/format"

const MONTHS = ["T1","T2","T3","T4","T5","T6","T7","T8","T9","T10","T11","T12"]

function AdminDashboard({ products, user, onNavigate }) {
  const [data, setData] = useState(null)
  const [error, setError] = useState("")

  useEffect(() => {
    api.dashboard().then(setData).catch((e) => setError(e.message))
  }, [])

  const revenue = useMemo(() => data?.monthlyRevenue || [], [data])
  const maxRevenue = Math.max(...revenue.map((i) => Number(i.revenue)), 1)
  const lowStockCount = useMemo(() => {
    if (data?.lowStockProducts?.length !== undefined) return data.lowStockProducts.length
    return products.filter((p) => (p.stock || 0) < 10).length
  }, [data, products])

  const metrics = [
    { label:"Tổng sản phẩm",   value: data?.totalProducts ?? products.length,                   icon:"📦", tab:"products",      color:"#2563eb" },
    { label:"Tổng đơn hàng",   value: data?.totalOrders ?? 0,                                   icon:"🧾", tab:"orders",        color:"#7c3aed" },
    { label:"Doanh thu",        value: formatMoney(Number(data?.revenue || 0)),                  icon:"💰", tab:"orders",        color:"#059669" },
    { label:"Bán chạy nhất",    value: data?.bestSellingProducts?.[0]?.name || "—",             icon:"🏆", tab:"products",      color:"#d97706" },
    { label:"Sắp hết hàng",     value: `${lowStockCount} SP`,                                    icon:"⚠️", tab:"inventory",    color:"#dc2626" },
    { label:"Lịch lắp hôm nay", value: data?.todayInstallations ?? 0,                           icon:"🔧", tab:"installations", color:"#0891b2" },
    { label:"Bảo hành chờ xử", value: data?.pendingWarranties ?? 0,                             icon:"🛡️", tab:"warranty",     color:"#be185d" },
  ]

  return (
    <section className="dashboard-page">
      {/* Header */}
      <div className="dash-header">
        <div>
          <span className="dash-eyebrow">TỔNG QUAN HỆ THỐNG</span>
          <h1 className="dash-title">Xin chào, {user?.fullName || "Quản trị viên"} <span className="dash-role">{user?.role?.toUpperCase() || "ADMIN"}</span></h1>
          <p className="dash-sub">Báo cáo chỉ số hoạt động cập nhật trực tiếp từ hệ thống SSLock.</p>
        </div>
        <button className="dash-cta" onClick={() => onNavigate("orders")} type="button">
          + Tạo đơn hàng mới
        </button>
      </div>

      {error && <div className="notice error">{error}</div>}

      {/* KPI Metrics */}
      <div className="kpi-grid">
        {metrics.map(({ label, value, icon, tab, color }) => (
          <article
            className="kpi-card"
            key={label}
            onClick={() => onNavigate(tab)}
            style={{ "--kpi-color": color }}
          >
            <div className="kpi-icon">{icon}</div>
            <span className="kpi-label">{label}</span>
            <strong className="kpi-value">{value}</strong>
            <small className="kpi-link">Xem chi tiết →</small>
          </article>
        ))}
      </div>

      {/* Charts Row */}
      <div className="dash-grid">
        {/* Revenue Chart */}
        <article className="revenue-card">
          <div className="revenue-head">
            <h3>Doanh thu theo tháng</h3>
            <span>Năm {new Date().getFullYear()}</span>
          </div>
          {revenue.length > 0 ? (
            <>
              <div className="chart">
                {revenue.map((item) => (
                  <span
                    className={item.month === new Date().getMonth() + 1 ? "hot" : ""}
                    key={item.month}
                    style={{ height: `${Math.max((Number(item.revenue) / maxRevenue) * 100, 4)}%` }}
                    title={`${MONTHS[item.month - 1]}: ${formatMoney(Number(item.revenue))}`}
                  />
                ))}
              </div>
              <div className="chart-labels">
                {revenue.map((item) => <span key={item.month}>{MONTHS[item.month - 1]}</span>)}
              </div>
            </>
          ) : (
            <div className="chart-empty">Chưa có dữ liệu doanh thu</div>
          )}
        </article>

        {/* Tasks */}
        <article className="alert-card">
          <h3>Việc cần xử lý ngay</h3>
          {[
            { icon:"🛡️", label:`${data?.pendingWarranties || 0} Yêu cầu bảo hành`, sub:"Đang chờ tiếp nhận & xử lý", tab:"warranty" },
            { icon:"📦", label:`${lowStockCount} SP sắp hết hàng`, sub:"Cần nhập thêm tồn kho", tab:"inventory" },
            { icon:"🔧", label:`${data?.todayInstallations || 0} Lịch lắp hôm nay`, sub:`${data?.unassignedInstallations || 0} chưa phân công kỹ thuật viên`, tab:"installations" },
          ].map(({ icon, label, sub, tab }) => (
            <div className="task-item" key={label} onClick={() => onNavigate(tab)}>
              <i>{icon}</i>
              <p><b>{label}</b><span>{sub}</span></p>
              <strong>→</strong>
            </div>
          ))}
        </article>
      </div>

      {/* Recent Orders & Best Sellers */}
      <div className="dash-bottom">
        <article className="recent-orders">
          <div className="card-head">
            <h3>Đơn hàng gần đây</h3>
            <button onClick={() => onNavigate("orders")} type="button">Xem tất cả →</button>
          </div>
          <table>
            <thead>
              <tr>
                <th>Mã đơn</th><th>Khách hàng</th><th>Sản phẩm</th><th>Giá trị</th><th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {(data?.recentOrders || []).map((order) => (
                <tr key={order.id}>
                  <td><b>{order.code}</b></td>
                  <td>{order.customer?.fullName || "Khách lẻ"}</td>
                  <td>{order.items?.map((i) => i.product?.name).join(", ") || "Khóa SSLock"}</td>
                  <td><b>{formatMoney(Number(order.total))}</b></td>
                  <td><span className="order-badge">{order.status}</span></td>
                </tr>
              ))}
              {!data?.recentOrders?.length && (
                <tr><td colSpan="5" className="table-empty">Chưa có đơn hàng mới phát sinh.</td></tr>
              )}
            </tbody>
          </table>
        </article>

        <article className="best-sellers">
          <div className="card-head">
            <h3>Sản phẩm bán chạy</h3>
          </div>
          {(data?.bestSellingProducts || products.slice(0, 5)).map((product, index) => (
            <div className="seller-row" key={product.id}>
              <b className="seller-rank">#{index + 1}</b>
              <div className="seller-info">
                <span>{product.name}</span>
                <small>{product.brand} · {product.doorType}</small>
              </div>
              <strong>{product.price ? formatMoney(Number(product.price)) : "Liên hệ"}</strong>
            </div>
          ))}
        </article>
      </div>
    </section>
  )
}

export default AdminDashboard
