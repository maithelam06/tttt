import { useState } from "react"
import { api } from "../../services/api"
import "./LoginPage.css"

function LoginPage({ onGoShop, onLogin }) {
  const [credentials, setCredentials] = useState({ username: "", password: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    try {
      const response = await api.login(credentials)
      const user = { ...response, role: response.role.toLowerCase() }
      sessionStorage.setItem("sslock_token", response.token)
      sessionStorage.setItem("sslock_user", JSON.stringify(user))
      setError("")
      onLogin(user)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="login-page">
      <section className="login-panel">
        {/* Left column — copy */}
        <div className="login-copy">
          <p className="eyebrow">SSLock · Hệ thống quản lý</p>
          <h1>Quản lý cửa hàng tập trung, dễ dàng hơn bao giờ hết</h1>
          <p>Nền tảng quản trị sản phẩm, đơn hàng, bảo hành và lịch lắp đặt toàn quốc cho đội ngũ SSLock.</p>
          <ul className="login-features">
            <li>Quản lý sản phẩm & danh mục</li>
            <li>Theo dõi đơn hàng thời gian thực</li>
            <li>Bảo hành điện tử & lịch lắp đặt</li>
            <li>Phân quyền Admin / Nhân viên</li>
          </ul>
          <button className="guest-button" onClick={onGoShop} type="button">
            ← Xem trang sản phẩm
          </button>
        </div>

        {/* Right column — form */}
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-form__heading">
            <h2>Đăng nhập</h2>
            <p>Nhập tài khoản và mật khẩu của bạn.</p>
          </div>

          <label>
            Tài khoản
            <input
              autoComplete="username"
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              placeholder="Nhập tài khoản..."
              required
              value={credentials.username}
            />
          </label>

          <label>
            Mật khẩu
            <input
              autoComplete="current-password"
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              placeholder="Nhập mật khẩu..."
              required
              type="password"
              value={credentials.password}
            />
          </label>

          {error && <div className="notice error">{error}</div>}

          <button className="primary-button" disabled={loading} type="submit">
            {loading ? "Đang đăng nhập..." : "Đăng nhập →"}
          </button>
        </form>
      </section>

      {/* Hint bar */}
      <div className="login-hint">
        <b>Quản trị:</b> admin / admin123 &nbsp;·&nbsp;
        <b>Tư vấn & Điều phối:</b> nhanvien / staff123 &nbsp;·&nbsp;
        <b>Kỹ thuật viên:</b> kythuat1 / tech123
      </div>
    </main>
  )
}

export default LoginPage
