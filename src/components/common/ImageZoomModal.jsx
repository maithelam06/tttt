import { createPortal } from "react-dom"

export default function ImageZoomModal({ isOpen, imageUrl, title, onClose }) {
  if (!isOpen || !imageUrl) return null

  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999999,
        background: "rgba(11, 17, 32, 0.92)",
        backdropFilter: "blur(12px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        animation: "fadeIn 0.2s ease",
      }}
    >
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: "20px",
          right: "24px",
          background: "rgba(255, 255, 255, 0.15)",
          color: "#ffffff",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          width: "42px",
          height: "42px",
          borderRadius: "50%",
          fontSize: "20px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
        }}
        type="button"
      >
        ✕
      </button>

      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "92vw",
          maxHeight: "88vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          alt={title || "Xem anh khoang zoom"}
          draggable={false}
          onContextMenu={(e) => e.preventDefault()}
          src={imageUrl}
          style={{
            maxWidth: "100%",
            maxHeight: "78vh",
            objectFit: "contain",
            borderRadius: "14px",
            boxShadow: "0 25px 60px rgba(0, 0, 0, 0.8)",
            border: "1px solid rgba(255, 255, 255, 0.25)",
            userSelect: "none",
            background: "#ffffff",
          }}
        />

        {title && (
          <p style={{ color: "#ffffff", marginTop: "16px", fontSize: "15px", fontWeight: 600, textAlign: "center", background: "rgba(0,0,0,0.6)", padding: "8px 20px", borderRadius: "30px", border: "1px solid rgba(255,255,255,0.2)" }}>
            🔍 {title}
          </p>
        )}
      </div>
    </div>,
    document.body,
  )
}
