import { useCallback, useEffect, useRef, useState } from "react"

/* ─── Types: success | error | info ─────────────────────── */

let _push = null

/** Call toast.success("msg") / toast.error("msg") anywhere */
export const toast = {
  success: (msg) => _push?.({ msg, type: "success" }),
  error:   (msg) => _push?.({ msg, type: "error" }),
  info:    (msg) => _push?.({ msg, type: "info" }),
}

/* ─── Provider (mount once near root) ───────────────────── */
export function ToastProvider() {
  const [toasts, setToasts] = useState([])
  const timerMap = useRef({})

  const push = useCallback(({ msg, type }) => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, msg, type, exiting: false }])
    timerMap.current[id] = setTimeout(() => dismiss(id), 3800)
  }, [])

  useEffect(() => { _push = push }, [push])

  function dismiss(id) {
    clearTimeout(timerMap.current[id])
    // mark exiting to play out-animation
    setToasts((prev) => prev.map((t) => t.id === id ? { ...t, exiting: true } : t))
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 360)
  }

  if (!toasts.length) return null

  return (
    <div className="toast-stack">
      {toasts.map(({ id, msg, type, exiting }) => (
        <div
          className={`toast toast-${type} ${exiting ? "toast-exit" : "toast-enter"}`}
          key={id}
          onClick={() => dismiss(id)}
        >
          <span className="toast-icon">
            {type === "success" ? "✓" : type === "error" ? "✕" : "ℹ"}
          </span>
          <span className="toast-msg">{msg}</span>
          <button className="toast-close" type="button">×</button>
        </div>
      ))}
    </div>
  )
}
