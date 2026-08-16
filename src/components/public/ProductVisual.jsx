import { useState } from "react"
import ImageZoomModal from "../common/ImageZoomModal"

function ProductVisual({ product, compact = false, allowZoom = true }) {
  const [showZoom, setShowZoom] = useState(false)

  if (product?.imageUrl) {
    return (
      <>
        <div
          className={`lock-visual ${product.imageTone || "navy"} ${compact ? "compact" : ""}`}
          onClick={(e) => {
            if (allowZoom) {
              e.stopPropagation()
              setShowZoom(true)
            }
          }}
          style={{
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#ffffff",
            padding: "8px",
            position: "relative",
            cursor: allowZoom ? "zoom-in" : "default",
          }}
          title={allowZoom ? "Bấm vào để phóng to hình ảnh" : undefined}
        >
          <img
            alt={product.name}
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
            src={product.imageUrl}
            style={{ width: "100%", height: "100%", objectFit: "contain", userSelect: "none" }}
          />
          {allowZoom && (
            <span style={{ position: "absolute", bottom: "8px", right: "8px", background: "rgba(15, 23, 42, 0.75)", color: "#ffffff", fontSize: "11px", padding: "3px 8px", borderRadius: "12px", pointerEvents: "none" }}>
              🔍 Phóng to
            </span>
          )}
        </div>

        {allowZoom && (
          <ImageZoomModal
            imageUrl={product.imageUrl}
            isOpen={showZoom}
            onClose={() => setShowZoom(false)}
            title={product.name}
          />
        )}
      </>
    )
  }

  return (
    <div className={`lock-visual ${product.imageTone || "navy"} ${compact ? "compact" : ""}`}>
      <span className="lock-body">
        <i />
        <i />
        <i />
      </span>
      <small>{product.brand}</small>
    </div>
  )
}

export default ProductVisual
