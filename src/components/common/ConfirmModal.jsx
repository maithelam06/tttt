import { createPortal } from "react-dom"

export default function ConfirmModal({
  isOpen,
  title = "Xác nhận xóa",
  message = "Bạn có chắc chắn muốn xóa mục này? Thao tác này không thể hoàn tác.",
  confirmText = "Xác nhận xóa",
  cancelText = "Hủy bỏ",
  danger = true,
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null

  return createPortal(
    <div className="modal-backdrop" onClick={onCancel} style={{ zIndex: 99999 }}>
      <div
        className="confirm-modal-box"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#ffffff",
          borderRadius: "16px",
          padding: "28px",
          maxWidth: "420px",
          width: "90%",
          boxShadow: "0 25px 50px -12px rgba(15, 23, 42, 0.25)",
          textAlign: "center",
          animation: "modalSlideIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
          border: "1px solid #e2e8f0",
        }}
      >
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            background: danger ? "#fef2f2" : "#f0f9ff",
            color: danger ? "#dc2626" : "#2563eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "24px",
            margin: "0 auto 16px",
            border: danger ? "1px solid #fecaca" : "1px solid #bae6fd",
          }}
        >
          {danger ? "⚠️" : "ℹ️"}
        </div>

        <h3 style={{ margin: "0 0 8px", color: "#0f172a", fontSize: "19px", fontWeight: 700 }}>
          {title}
        </h3>

        <p style={{ margin: "0 0 24px", color: "#64748b", fontSize: "14px", lineHeight: "1.5" }}>
          {message}
        </p>

        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: "11px 18px",
              borderRadius: "10px",
              border: "1px solid #cbd5e1",
              background: "#ffffff",
              color: "#334155",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
            type="button"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: "11px 18px",
              borderRadius: "10px",
              border: 0,
              background: danger
                ? "linear-gradient(135deg, #dc2626, #b91c1c)"
                : "linear-gradient(135deg, #2563eb, #1d4ed8)",
              color: "#ffffff",
              fontSize: "14px",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: danger ? "0 4px 12px rgba(220, 38, 38, 0.25)" : "0 4px 12px rgba(37, 99, 235, 0.25)",
              transition: "all 0.15s ease",
            }}
            type="button"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
