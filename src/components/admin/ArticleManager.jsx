import { useState } from "react"
import { toast } from "../ui/Toast"
import ConfirmModal from "../common/ConfirmModal"

const emptyForm = {
  title: "",
  summary: "",
  content: "",
  type: "project",
  imageUrl: "",
  published: true,
}

function ArticleManager({ posts = [], onSavePost, onDeletePost }) {
  const [form, setForm]                   = useState(emptyForm)
  const [editingId, setEditingId]         = useState(null)
  const [loading, setLoading]             = useState(false)
  const [filterType, setFilterType]       = useState("all")
  const [searchQuery, setSearchQuery]     = useState("")
  const [deleteTarget, setDeleteTarget]   = useState(null)

  const isEditing = Boolean(editingId)

  // Filter posts
  const filteredPosts = posts.filter((p) => {
    const matchesType = filterType === "all" || p.type === filterType
    const matchesSearch = [p.title, p.summary].join(" ").toLowerCase().includes(searchQuery.toLowerCase())
    return matchesType && matchesSearch
  })

  function handleEditClick(post) {
    setEditingId(post.id)
    setForm({
      title: post.title || "",
      summary: post.summary || "",
      content: post.content || post.summary || "",
      type: post.type || "project",
      imageUrl: post.imageUrl || "",
      published: post.published !== false,
    })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  function handleCancelEdit() {
    setEditingId(null)
    setForm(emptyForm)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim() || !form.summary.trim()) {
      toast.error("Vui lòng điền Tiêu đề và Mô tả bài viết!")
      return
    }
    setLoading(true)
    try {
      const success = await onSavePost({ ...form, id: editingId })
      if (success) {
        toast.success(isEditing ? "Đã cập nhật bài viết thành công!" : "Đã đăng bài viết mới thành công!")
        setForm(emptyForm)
        setEditingId(null)
      }
    } catch (err) {
      toast.error(err.message || "Không thể lưu bài viết.")
    } finally {
      setLoading(false)
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    const target = deleteTarget
    setDeleteTarget(null)
    try {
      await onDeletePost(target.id)
      toast.success(`Đã xóa bài viết "${target.title}" thành công!`)
      if (editingId === target.id) {
        handleCancelEdit()
      }
    } catch (err) {
      toast.error(err.message || "Không thể xóa bài viết.")
    }
  }

  return (
    <section className="module-page" style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Top Header */}
      <div className="module-head" style={{ marginBottom: "24px" }}>
        <div>
          <span style={{ color: "#2563eb", fontSize: "11px", fontWeight: 800, letterSpacing: "1.4px", textTransform: "uppercase" }}>
            NỘI DUNG WEBSITE
          </span>
          <h1 style={{ color: "#0c1d3c", fontSize: "24px", fontWeight: 800, margin: "4px 0" }}>
            Dự án & Tin tức khóa thông minh
          </h1>
          <p style={{ color: "#64748b", fontSize: "13px", margin: 0 }}>
            Quản lý bài viết dự án công trình và tin tức xu hướng xuất bản lên website khách hàng.
          </p>
        </div>
      </div>

      {/* Main Grid: Form Left, List Right */}
      <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: "24px", alignItems: "start" }}>
        {/* Form Container */}
        <div style={{ background: "#ffffff", padding: "24px", borderRadius: "16px", border: "1.5px solid #cbd5e1", boxShadow: "0 4px 12px rgba(0,0,0,0.04)", position: "sticky", top: "80px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ margin: 0, color: "#0c1d3c", fontSize: "17px", fontWeight: 700 }}>
              {isEditing ? "✏️ Cập nhật bài viết" : "📝 Thêm bài viết mới"}
            </h3>
            {isEditing && (
              <button
                onClick={handleCancelEdit}
                style={{ background: "#f1f5f9", color: "#64748b", border: "1px solid #cbd5e1", borderRadius: "6px", padding: "4px 10px", fontSize: "12px", cursor: "pointer" }}
                type="button"
              >
                ✕ Hủy sửa
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", fontWeight: 600, color: "#334155" }}>
              Loại bài viết
              <select
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                style={{ padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13.5px" }}
                value={form.type}
              >
                <option value="project">🏢 Dự án (Công trình tiêu biểu)</option>
                <option value="news">📰 Tin tức (Xu hướng & Kinh nghiệm)</option>
              </select>
            </label>

            <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", fontWeight: 600, color: "#334155" }}>
              Tiêu đề bài viết
              <input
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="VD: Triển khai khóa thẻ từ cho Resort 120 phòng..."
                required
                style={{ padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13.5px" }}
                value={form.title}
              />
            </label>

            <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", fontWeight: 600, color: "#334155" }}>
              Hình ảnh bài viết (Tải file từ máy / Dán Link)
              <input
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    const reader = new FileReader()
                    reader.onloadend = () => setForm({ ...form, imageUrl: reader.result })
                    reader.readAsDataURL(file)
                  }
                }}
                style={{ fontSize: "12px", marginTop: "2px" }}
                type="file"
              />
              <input
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                placeholder="Hoặc dán URL đường dẫn ảnh..."
                style={{ padding: "8px 10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "12.5px" }}
                value={form.imageUrl || ""}
              />
            </label>

            {form.imageUrl && (
              <div style={{ background: "#f8fafc", padding: "8px", borderRadius: "8px", border: "1px dashed #cbd5e1", textAlign: "center" }}>
                <small style={{ color: "#64748b", display: "block", marginBottom: "4px", fontSize: "11px" }}>Xem trước ảnh:</small>
                <img
                  alt="Preview"
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                  src={form.imageUrl}
                  style={{ maxHeight: "100px", maxWidth: "100%", objectFit: "contain", borderRadius: "6px" }}
                />
              </div>
            )}

            <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", fontWeight: 600, color: "#334155" }}>
              Mô tả ngắn (Tóm tắt)
              <textarea
                onChange={(e) => setForm({ ...form, summary: e.target.value })}
                placeholder="Nhập đoạn tóm tắt ngắn hiển thị trên thẻ bài viết..."
                required
                rows={3}
                style={{ padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", lineHeight: 1.5 }}
                value={form.summary}
              />
            </label>

            <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", fontWeight: 600, color: "#334155" }}>
              Nội dung bài viết chi tiết
              <textarea
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                placeholder="Nhập nội dung đầy đủ bài viết..."
                rows={5}
                style={{ padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", lineHeight: 1.5 }}
                value={form.content}
              />
            </label>

            <button
              disabled={loading}
              style={{
                padding: "12px",
                borderRadius: "10px",
                border: 0,
                background: isEditing
                  ? "linear-gradient(135deg, #16a34a, #15803d)"
                  : "linear-gradient(135deg, #1d4ed8, #2563eb)",
                color: "#ffffff",
                fontSize: "14px",
                fontWeight: 700,
                cursor: loading ? "wait" : "pointer",
                boxShadow: "0 4px 14px rgba(37,99,235,0.3)",
                marginTop: "4px",
                transition: "all 0.2s ease",
              }}
              type="submit"
            >
              {loading ? "Đang xử lý..." : isEditing ? "💾 Lưu Cập Nhật Bài Viết" : "🚀 Đăng Bài Viết Mới"}
            </button>
          </form>
        </div>

        {/* List Container */}
        <div style={{ background: "#ffffff", padding: "24px", borderRadius: "16px", border: "1.5px solid #cbd5e1", boxShadow: "0 4px 12px rgba(0,0,0,0.04)" }}>
          {/* Header & Filter Toolbar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
            <h3 style={{ margin: 0, color: "#0c1d3c", fontSize: "17px", fontWeight: 700 }}>
              📋 Bài đã xuất bản ({filteredPosts.length})
            </h3>

            {/* Filter buttons */}
            <div style={{ display: "flex", gap: "6px" }}>
              {[
                ["all", "Tất cả"],
                ["project", "Dự án"],
                ["news", "Tin tức"],
              ].map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setFilterType(key)}
                  style={{
                    padding: "5px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                    border: filterType === key ? "1.5px solid #2563eb" : "1px solid #cbd5e1",
                    background: filterType === key ? "#eff6ff" : "#ffffff",
                    color: filterType === key ? "#1d4ed8" : "#64748b",
                  }}
                  type="button"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Search box */}
          <div style={{ marginBottom: "16px" }}>
            <input
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="⌕ Tìm bài viết theo tiêu đề, mô tả..."
              style={{ width: "100%", padding: "9px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px" }}
              value={searchQuery}
            />
          </div>

          {/* Articles Cards List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {filteredPosts.length === 0 ? (
              <div style={{ padding: "40px 20px", textAlign: "center", color: "#94a3b8", border: "1px dashed #cbd5e1", borderRadius: "12px" }}>
                Chưa có bài viết nào trong danh mục này.
              </div>
            ) : (
              filteredPosts.map((post) => (
                <article
                  key={post.id}
                  style={{
                    display: "flex",
                    gap: "16px",
                    alignItems: "center",
                    padding: "14px 16px",
                    borderRadius: "12px",
                    border: editingId === post.id ? "2px solid #2563eb" : "1px solid #e2e8f0",
                    background: editingId === post.id ? "#eff6ff" : "#ffffff",
                    transition: "all 0.2s ease",
                  }}
                >
                  {/* Thumbnail */}
                  <div
                    style={{
                      width: "72px",
                      height: "72px",
                      borderRadius: "10px",
                      background: post.type === "project" ? "#1e3a8a" : "#4c1d95",
                      color: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "11px",
                      fontWeight: 700,
                      flexShrink: 0,
                      overflow: "hidden",
                    }}
                  >
                    {post.imageUrl ? (
                      <img
                        alt={post.title}
                        draggable={false}
                        onContextMenu={(e) => e.preventDefault()}
                        src={post.imageUrl}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <span>{post.type === "project" ? "DỰ ÁN" : "TIN TỨC"}</span>
                    )}
                  </div>

                  {/* Body */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                      <span
                        style={{
                          background: post.type === "project" ? "#dbeafe" : "#f3e8ff",
                          color: post.type === "project" ? "#1d4ed8" : "#7e22ce",
                          fontSize: "11px",
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: "12px",
                        }}
                      >
                        {post.type === "project" ? "🏢 Dự án" : "📰 Tin tức"}
                      </span>
                      <small style={{ color: "#94a3b8", fontSize: "11.5px" }}>{post.date || "Hôm nay"}</small>
                    </div>

                    <h4 style={{ margin: "0 0 4px", color: "#0c1d3c", fontSize: "14.5px", fontWeight: 700, lineHeight: 1.35 }}>
                      {post.title}
                    </h4>
                    <p style={{ margin: 0, color: "#64748b", fontSize: "12.5px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", lineHeight: 1.45 }}>
                      {post.summary}
                    </p>
                  </div>

                  {/* Action Buttons: Sửa & Xóa */}
                  <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                    <button
                      onClick={() => handleEditClick(post)}
                      style={{
                        background: "#3b82f6",
                        color: "#ffffff",
                        border: 0,
                        padding: "7px 14px",
                        borderRadius: "8px",
                        fontSize: "12px",
                        fontWeight: 600,
                        cursor: "pointer",
                        boxShadow: "0 2px 6px rgba(59,130,246,0.3)",
                      }}
                      type="button"
                    >
                      ✏️ Sửa
                    </button>
                    <button
                      onClick={() => setDeleteTarget(post)}
                      style={{
                        background: "#ef4444",
                        color: "#ffffff",
                        border: 0,
                        padding: "7px 14px",
                        borderRadius: "8px",
                        fontSize: "12px",
                        fontWeight: 600,
                        cursor: "pointer",
                        boxShadow: "0 2px 6px rgba(239,68,68,0.3)",
                      }}
                      type="button"
                    >
                      🗑️ Xóa
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <ConfirmModal
          isOpen={Boolean(deleteTarget)}
          message={`Bạn có chắc chắn muốn xóa bài viết "${deleteTarget.title}"? Bài viết này sẽ không còn hiển thị trên website.`}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
          title="Xác Nhận Xóa Bài Viết"
        />
      )}
    </section>
  )
}

export default ArticleManager
