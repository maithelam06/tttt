import { useEffect, useState } from "react"
import { toast } from "../ui/Toast"
import { api } from "../../services/api"

const jobs = [
  {
    title: "Nhân viên kinh doanh phát triển đại lý",
    count: "05",
    salary: "Từ 10 triệu",
    requirements: [
      "Chủ động, giao tiếp tốt và có tinh thần học hỏi",
      "Tốt nghiệp trung cấp, cao đẳng trở lên",
      "Chưa có kinh nghiệm sẽ được đào tạo",
    ],
  },
  {
    title: "Nhân viên kỹ thuật khóa",
    count: "03",
    salary: "10 - 15 triệu",
    requirements: [
      "Có kiến thức điện, cơ khí hoặc thiết bị thông minh",
      "Sẵn sàng di chuyển lắp đặt tại công trình",
      "Trung thực, trách nhiệm với công việc",
    ],
  },
  {
    title: "Nhân viên Marketing",
    count: "02",
    salary: "8 - 15 triệu",
    requirements: [
      "Có tư duy nội dung và hình ảnh tốt",
      "Hiểu các nền tảng thương mại điện tử",
      "Kinh nghiệm Smart Home là lợi thế",
    ],
  },
]

function ContentPage({ page, projects }) {
  if (page === "gioi-thieu") return <AboutPage />
  if (page === "du-an")
    return (
      <PostGrid
        eyebrow="CÔNG TRÌNH TIÊU BIỂU"
        posts={projects.filter((p) => p.type === "project")}
        title="Các dự án đã triển khai"
      />
    )
  if (page === "tin-tuc")
    return (
      <PostGrid
        eyebrow="KIẾN THỨC & XU HƯỚNG"
        posts={projects.filter((p) => p.type === "news")}
        title="Tin tức khóa thông minh"
      />
    )
  if (page === "tuyen-dung") return <CareerPage />
  return <ContactPage />
}

function PageHero({ eyebrow, title, description }) {
  return (
    <section className="page-hero">
      <span>{eyebrow}</span>
      <h1>{title}</h1>
      <p>{description}</p>
    </section>
  )
}

function useAutoCounter(target, duration = 1600) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (typeof target !== "number") return
    let frameId
    const startTime = performance.now()

    function step(now) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))

      if (progress < 1) {
        frameId = requestAnimationFrame(step)
      }
    }

    frameId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frameId)
  }, [target, duration])

  if (typeof target !== "number") return target
  return count
}

function StatBox({ target, suffix, label, formattedTarget }) {
  const count = useAutoCounter(target, 1600)
  const displayVal = formattedTarget
    ? count >= target
      ? formattedTarget
      : `${Math.floor(count / 1000)}K+`
    : `${count}${suffix || ""}`

  return (
    <article
      style={{
        background: "#ffffff",
        border: "1.5px solid #e2e8f0",
        borderRadius: "16px",
        padding: "24px 20px",
        boxShadow: "0 4px 12px rgba(15, 23, 42, 0.03)",
        transition: "transform 0.2s ease, border-color 0.2s ease",
      }}
    >
      <b
        style={{
          display: "block",
          fontSize: "36px",
          fontWeight: 700,
          color: "#2563eb",
          lineHeight: "1.1",
          marginBottom: "8px",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        }}
      >
        {typeof target === "number" ? displayVal : target}
      </b>
      <span
        style={{
          fontSize: "14px",
          fontWeight: 500,
          color: "#64748b",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        }}
      >
        {label}
      </span>
    </article>
  )
}

/* ── About ─────────────────────────────────────────────────── */
function AboutPage() {
  return (
    <main>
      <PageHero
        description="Nhà cung cấp giải pháp khóa thông minh hiện đại cho gia đình, khách sạn và công trình trên toàn quốc."
        eyebrow="VỀ SSLOCK VIỆT NAM"
        title="Công nghệ bảo vệ mọi tổ ấm"
      />
      <section
        className="about-content"
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr",
          gap: "48px",
          alignItems: "center",
          padding: "48px 0",
        }}
      >
        <div>
          <span
            style={{
              color: "#2563eb",
              fontSize: "14px",
              fontWeight: 600,
              textTransform: "none",
              display: "inline-block",
              marginBottom: "8px",
              fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            }}
          >
            Câu chuyện thương hiệu
          </span>
          <h2
            style={{
              fontSize: "28px",
              fontWeight: 700,
              color: "#0f172a",
              margin: "6px 0 16px",
              lineHeight: "1.4",
              fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            }}
          >
            Đưa công nghệ an ninh đến gần hơn với người Việt
          </h2>
          <p
            style={{
              color: "#475569",
              fontSize: "15px",
              lineHeight: 1.7,
              margin: 0,
              fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            }}
          >
            SSLock phát triển và phân phối các giải pháp khóa vân tay, nhận diện khuôn mặt, mã số, thẻ từ cùng hệ sinh thái nhà thông minh. Chúng tôi theo đuổi trải nghiệm an toàn, thuận tiện và dịch vụ minh bạch.
          </p>
        </div>

        <div
          className="about-stats"
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}
        >
          <StatBox label="Năm kinh nghiệm" suffix="+" target={10} />
          <StatBox formattedTarget="30K+" label="Khách hàng" target={30000} />
          <StatBox label="Tỉnh thành" suffix="" target={63} />
          <StatBox label="Hỗ trợ kỹ thuật" target="24/7" />
        </div>
      </section>
      <section className="values-grid">
        <article>
          <span>01</span>
          <h3>Tầm nhìn</h3>
          <p>Trở thành đơn vị cung cấp thiết bị Smart Home uy tín tại Việt Nam và khu vực.</p>
        </article>
        <article>
          <span>02</span>
          <h3>Sứ mệnh</h3>
          <p>Mang đến sản phẩm chất lượng và dịch vụ tốt, hài hòa lợi ích khách hàng và xã hội.</p>
        </article>
        <article>
          <span>03</span>
          <h3>Triết lý</h3>
          <p>Lấy chất lượng làm cam kết, công nghệ làm nền tảng và sự an tâm làm thước đo.</p>
        </article>
      </section>
    </main>
  )
}

/* ── Post Grid ────────────────────────────────────────────── */
function PostGrid({ eyebrow, title, posts }) {
  return (
    <main>
      <PageHero
        description="Cập nhật hoạt động mới nhất từ SSLock và những giải pháp thực tế dành cho khách hàng."
        eyebrow={eyebrow}
        title={title}
      />
      <section className="post-grid">
        {posts.length ? (
          posts.map((post) => (
            <article key={post.id}>
              <div className={`post-cover ${post.tone}`}>
                <span>{post.type === "project" ? "DỰ ÁN" : "TIN TỨC"}</span>
              </div>
              <div>
                <small>{post.date}</small>
                <h2>{post.title}</h2>
                <p>{post.summary}</p>
                <button type="button">Đọc chi tiết →</button>
              </div>
            </article>
          ))
        ) : (
          <div className="no-post">
            <h2>Chưa có bài viết</h2>
            <p>Bài mới do nhân viên đăng sẽ tự động xuất hiện tại đây.</p>
          </div>
        )}
      </section>
    </main>
  )
}

/* ── Career ───────────────────────────────────────────────── */
function CareerPage() {
  return (
    <main>
      <PageHero
        description="Môi trường trẻ, chuyên nghiệp, minh bạch và luôn trao cơ hội phát triển cho người có năng lực."
        eyebrow="GIA NHẬP ĐỘI NGŨ SSLOCK"
        title="Cùng tạo nên những ngôi nhà an toàn hơn"
      />
      <section className="job-list">
        {jobs.map((job) => (
          <article key={job.title}>
            <div>
              <span>SỐ LƯỢNG {job.count}</span>
              <h2>{job.title}</h2>
              <b>{job.salary}</b>
            </div>
            <ul>
              {job.requirements.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <a className="apply-btn" href="mailto:sslock.vn@gmail.com">
              Ứng tuyển ngay →
            </a>
          </article>
        ))}
      </section>
      <section className="career-contact">
        <h2>Không tìm thấy vị trí phù hợp?</h2>
        <p>
          Gửi CV về <b>sslock.vn@gmail.com</b> hoặc gọi <b>0896 619 196</b>. Chúng tôi luôn chào đón nhân tài.
        </p>
      </section>
    </main>
  )
}

/* ── Contact ──────────────────────────────────────────────── */
function ContactPage() {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    setLoading(true)

    const TYPE_MAP = {
      "Tư vấn sản phẩm": "CONSULTATION",
      "Lắp đặt": "INSTALLATION",
      "Bảo hành": "WARRANTY",
    }
    const need = data.get("need")
    const requestType = TYPE_MAP[need] || "CONSULTATION"

    try {
      await api.requests.create({
        type: requestType,
        customerName: data.get("customerName"),
        phone: data.get("phone"),
        email: data.get("email") || "",
        note: `[${need || "Tư vấn"}] ${data.get("note") || ""}`.trim(),
      })
      setSent(true)
      toast.success("Đã gửi yêu cầu! Chúng tôi sẽ liên hệ trong 15 phút.")
    } catch {
      setSent(true)
      toast.success("Đã ghi nhận yêu cầu của bạn.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main>
      <PageHero
        description="Để lại thông tin, đội ngũ tư vấn sẽ liên hệ và hỗ trợ bạn chọn giải pháp phù hợp."
        eyebrow="KẾT NỐI VỚI SSLOCK"
        title="Chúng tôi luôn sẵn sàng hỗ trợ"
      />
      <section className="contact-layout">
        <div>
          <h2>Thông tin liên hệ</h2>
          <article>
            <i>☎</i>
            <p>
              <span>Tư vấn mua hàng</span>
              <a href="tel:0896619196">0896 619 196</a>
            </p>
          </article>
          <article>
            <i>✉</i>
            <p>
              <span>Email</span>
              <b>sslock.vn@gmail.com</b>
            </p>
          </article>
          <article>
            <i>⌖</i>
            <p>
              <span>Trụ sở Hà Nội</span>
              <b>Số 15 Lê Văn Thiêm, phường Thanh Xuân, TP Hà Nội</b>
            </p>
          </article>
        </div>

        {sent ? (
          <div className="form-success">
            <div className="form-success-icon">✓</div>
            <h3>Gửi thành công!</h3>
            <p>Đội ngũ tư vấn SSLock sẽ liên hệ với bạn trong thời gian sớm nhất.</p>
            <button
              onClick={() => setSent(false)}
              style={{
                marginTop: 8,
                background: "#0c1d3c",
                color: "#fff",
                border: 0,
                borderRadius: 8,
                padding: "10px 20px",
                cursor: "pointer",
                fontWeight: 600,
              }}
              type="button"
            >
              Gửi thêm yêu cầu
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h2>Gửi yêu cầu tư vấn</h2>
            <input name="customerName" placeholder="Họ và tên" required />
            <input name="phone" placeholder="Số điện thoại" required type="tel" />
            <input name="email" placeholder="Email (không bắt buộc)" type="email" />
            <select name="need">
              <option value="">Chọn nhu cầu hỗ trợ</option>
              <option value="Tư vấn sản phẩm">Tư vấn sản phẩm</option>
              <option value="Lắp đặt">Lắp đặt</option>
              <option value="Bảo hành">Bảo hành</option>
            </select>
            <textarea name="note" placeholder="Nội dung cần hỗ trợ..." />
            <button disabled={loading} type="submit">
              {loading ? "Đang gửi..." : "Gửi thông tin →"}
            </button>
          </form>
        )}
      </section>
    </main>
  )
}

export default ContentPage
