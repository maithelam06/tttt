import adminLogo from "../../assets/sslock-admin-logo.svg"

const menu = [
  ["dashboard",    "📊", "Tổng quan"],
  ["products",     "📦", "Sản phẩm"],
  ["categories",   "🗂️", "Danh mục"],
  ["brands",       "🏷️", "Thương hiệu"],
  ["inventory",    "🏬", "Tồn kho"],
  ["orders",       "🧾", "Đơn hàng"],
  ["requests",     "📩", "Yêu cầu TV & Lắp"],
  ["subscribers",  "✉️", "Email Khuyến mãi"],
  ["customers",    "👥", "Khách hàng"],
  ["quotes",       "📋", "Báo giá"],
  ["warranty",     "🛡️", "Bảo hành"],
  ["installations","🔧", "Lịch lắp đặt"],
  ["technicians",  "👷", "Kỹ thuật viên"],
  ["articles",     "📝", "Bài viết"],
  ["staff",        "🔑", "Tài khoản nhân viên"],
]

function Sidebar({ activeTab, onChangeTab, onLogout, user }) {
  const role = user?.role?.toLowerCase()
  const allowed = role === "admin"
    ? menu
    : role === "technician"
      ? menu.filter(([id]) => ["requests", "installations"].includes(id))
      : menu.filter(([id]) => !["categories", "brands", "staff", "technicians"].includes(id))

  const roleLabel = role === "admin" ? "Quản trị viên" : role === "technician" ? "Kỹ thuật viên" : "Nhân viên tư vấn"

  return (
    <aside className="admin-sidebar">
      <div className="admin-brand">
        <img src={adminLogo} alt="SSLock Admin" />
      </div>

      <nav>
        {allowed.map(([id, icon, label]) => (
          <button
            className={activeTab === id ? "active" : ""}
            key={id}
            onClick={() => onChangeTab(id)}
            type="button"
          >
            <i>{icon}</i>
            <span>{label}</span>
            {id === "warranty" && <b>!</b>}
          </button>
        ))}
      </nav>

      <div className="admin-user">
        <div className="admin-avatar">{user.fullName.slice(0, 1).toUpperCase()}</div>
        <div className="admin-user-info">
          <b>{user.fullName}</b>
          <span>{roleLabel}</span>
        </div>
        <button className="admin-logout" onClick={onLogout} title="Đăng xuất" type="button">
          ↪
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
