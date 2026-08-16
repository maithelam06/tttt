import { useState } from "react"
import sslockLogo from "../../assets/sslock-logo.svg"

const publicMenu = [
  ["/", "Trang chủ"],
  ["/gioi-thieu", "Giới thiệu"],
  ["/du-an", "Các dự án"],
  ["/tuyen-dung", "Tuyển dụng"],
  ["/tin-tuc", "Tin tức"],
  ["/lien-he", "Liên hệ"],
]

function PublicHeader({
  activePath,
  compareCount,
  onCompare,
  onLoginClick,
  onNavigate,
  onSearch,
}) {
  const [searchValue, setSearchValue] = useState("")

  function submitSearch(event) {
    event.preventDefault()
    onSearch(searchValue)
    onNavigate("/")
  }

  return (
    <header className="store-header">
      <div className="utility-bar">
        <span>SSLOCK.VN - Siêu thị khóa thông minh chính hãng</span>
        <div>
          <span>Hotline: <b>0896 619 196</b></span>
          <button onClick={onLoginClick} type="button">Đăng nhập</button>
        </div>
      </div>

      <div className="commerce-header">
        <a
          className="store-logo"
          href="/"
          onClick={(event) => {
            event.preventDefault()
            onNavigate("/")
          }}
        >
          <img alt="SSLock Signal Smart Lock" src={sslockLogo} />
        </a>

        <form className="header-search" onSubmit={submitSearch}>
          <input
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Tên hoặc mã sản phẩm bạn cần tìm"
            value={searchValue}
          />
          <button aria-label="Tìm kiếm" type="submit">⌕</button>
        </form>

        <button className="header-quick-link" onClick={onCompare} type="button">
          <HeaderIcon name="clipboard" />
          <span>Sản phẩm<b>Bạn đã xem ({compareCount})</b></span>
        </button>
        <button className="header-quick-link" onClick={onLoginClick} type="button">
          <HeaderIcon name="order" />
          <span>Theo dõi<b>Đơn hàng</b></span>
        </button>
        <a className="header-quick-link" href="tel:0896619196">
          <HeaderIcon name="phone" />
          <span>Hotline<b>0896 619 196</b></span>
        </a>
      </div>

      <nav className="public-menu">
        <div>
          {publicMenu.map(([path, label]) => (
            <a
              className={activePath === path ? "active" : ""}
              href={path}
              key={path}
              onClick={(event) => {
                event.preventDefault()
                onNavigate(path)
              }}
            >
              {label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  )
}

function HeaderIcon({ name }) {
  if (name === "phone") {
    return <svg aria-hidden="true" viewBox="0 0 32 44"><rect x="5" y="2" width="22" height="40" rx="1"/><path d="M5 8h22M5 35h22M14 39h4"/></svg>
  }

  if (name === "order") {
    return <svg aria-hidden="true" viewBox="0 0 40 44"><path d="M8 7h25v34H8zM14 3h13v8H14zM14 19h13M14 25h13M14 31h9"/><path d="M18 3a3 3 0 0 1 6 0"/></svg>
  }

  return <svg aria-hidden="true" viewBox="0 0 40 44"><path d="M8 7h25v34H8zM14 3h13v8H14zM14 20h13M14 27h13"/><path d="M18 3a3 3 0 0 1 6 0"/></svg>
}

export default PublicHeader
