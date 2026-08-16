import { useEffect, useMemo, useState } from "react"
import { api } from "../../services/api"
import { formatMoney } from "../../utils/format"
import ConfirmModal from "../common/ConfirmModal"
import { toast } from "../ui/Toast"

const definitions = {
  brands: {
    title: "Thương hiệu",
    fields: [["name", "Tên thương hiệu"], ["country", "Quốc gia"], ["logoUrl", "Logo URL"], ["description", "Mô tả"]],
    columns: [["name", "Thương hiệu"], ["country", "Quốc gia"], ["active", "Hoạt động"]],
    editable: true,
    initial: { name: "", country: "", logoUrl: "", description: "", active: true },
  },
  inventory: {
    title: "Quản lý tồn kho",
    fields: [["productId", "Sản phẩm", "products"], ["type", "Loại giao dịch", "inventoryType"], ["quantity", "Số lượng", "number"], ["note", "Ghi chú"]],
    columns: [["product.name", "Sản phẩm"], ["type", "Loại"], ["quantity", "Số lượng"], ["createdAt", "Thời gian"]],
    initial: { productId: "", type: "IN", quantity: 1, note: "" },
    noDelete: true,
  },
  orders: {
    title: "Đơn hàng",
    fields: [["customerId", "Khách hàng", "customers"], ["productId", "Sản phẩm", "products"], ["quantity", "Số lượng", "number"], ["note", "Ghi chú"]],
    columns: [["code", "Mã đơn"], ["customer.fullName", "Khách hàng"], ["total", "Tổng tiền", "money"], ["status", "Trạng thái"], ["createdAt", "Ngày tạo"]],
    initial: { customerId: "", productId: "", quantity: 1, note: "" },
    statuses: ["PENDING", "CONFIRMED", "PROCESSING", "COMPLETED", "CANCELLED"],
    makePayload: (form) => ({ customerId: Number(form.customerId), items: [{ productId: Number(form.productId), quantity: Number(form.quantity) }], note: form.note }),
  },
  customers: {
    title: "Khách hàng",
    fields: [["fullName", "Họ và tên"], ["phone", "Số điện thoại"], ["email", "Email", "email"], ["address", "Địa chỉ"], ["note", "Ghi chú"]],
    columns: [["fullName", "Khách hàng"], ["phone", "Điện thoại"], ["email", "Email"], ["address", "Địa chỉ"]],
    editable: true,
    initial: { fullName: "", phone: "", email: "", address: "", note: "" },
  },
  quotes: {
    title: "Báo giá",
    fields: [["customerId", "Khách hàng", "customers"], ["total", "Tổng tiền", "number"], ["validUntil", "Hiệu lực đến", "date"], ["content", "Nội dung", "textarea"]],
    columns: [["code", "Mã báo giá"], ["customer.fullName", "Khách hàng"], ["total", "Tổng tiền", "money"], ["validUntil", "Hiệu lực"], ["status", "Trạng thái"]],
    initial: { customerId: "", total: 0, validUntil: "", content: "" },
    statuses: ["DRAFT", "SENT", "ACCEPTED", "REJECTED", "EXPIRED"],
  },
  warranties: {
    title: "Bảo hành điện tử",
    fields: [["customerId", "Khách hàng", "customers"], ["productId", "Sản phẩm", "products"], ["serialNumber", "Số serial"], ["purchaseDate", "Ngày mua", "date"]],
    columns: [["code", "Mã phiếu"], ["customer.fullName", "Khách hàng"], ["product.name", "Sản phẩm"], ["expiresAt", "Hết hạn"], ["status", "Trạng thái"]],
    initial: { customerId: "", productId: "", serialNumber: "", purchaseDate: "" },
    statuses: ["ACTIVE", "PENDING", "REPAIRING", "COMPLETED", "EXPIRED"],
  },
  installations: {
    title: "Lịch lắp đặt",
    fields: [["customerId", "Khách hàng", "customers"], ["productId", "Sản phẩm", "products"], ["technicianId", "Kỹ thuật viên", "technicians"], ["address", "Địa chỉ"], ["appointmentAt", "Thời gian", "datetime-local"], ["note", "Ghi chú"]],
    columns: [["customer.fullName", "Khách hàng"], ["product.name", "Sản phẩm"], ["technician.fullName", "Kỹ thuật viên"], ["appointmentAt", "Lịch hẹn"], ["status", "Trạng thái"]],
    initial: { customerId: "", productId: "", technicianId: "", address: "", appointmentAt: "", note: "" },
    statuses: ["PENDING", "ASSIGNED", "IN_PROGRESS", "COMPLETED", "CANCELLED"],
  },
  technicians: {
    title: "Kỹ thuật viên",
    fields: [
      ["fullName", "Họ và tên"],
      ["phone", "Số điện thoại"],
      ["username", "Tài khoản đăng nhập"],
      ["password", "Mật khẩu đăng nhập", "password"],
      ["area", "Khu vực"],
      ["skill", "Kỹ năng"],
      ["status", "Trạng thái", "technicianStatus"],
    ],
    columns: [
      ["fullName", "Kỹ thuật viên"],
      ["username", "Tài khoản"],
      ["phone", "Điện thoại"],
      ["area", "Khu vực"],
      ["skill", "Kỹ năng"],
      ["status", "Trạng thái"],
    ],
    editable: true,
    initial: { fullName: "", phone: "", username: "", password: "", area: "", skill: "", status: "AVAILABLE" },
  },
  staff: {
    title: "Nhân viên",
    fields: [["username", "Tài khoản"], ["password", "Mật khẩu", "password"], ["fullName", "Họ và tên"], ["role", "Vai trò", "roles"]],
    columns: [["username", "Tài khoản"], ["fullName", "Họ và tên"], ["role", "Vai trò"]],
    editable: true,
    initial: { username: "", password: "", fullName: "", role: "STAFF" },
  },
}

const resourceName = (module) => (module === "warranty" ? "warranties" : module)
const read = (item, path) => path.split(".").reduce((value, key) => value?.[key], item)

function AdminResourceManager({ module, products, user }) {
  const resource = resourceName(module)
  const definition = definitions[resource] || definitions.orders
  const [items, setItems] = useState([])
  const [references, setReferences] = useState({ customers: [], technicians: [] })
  const [form, setForm] = useState(definition.initial)
  const [editingId, setEditingId] = useState(null)
  const [keyword, setKeyword] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(true)

  const isStaff = user?.role === "STAFF"

  async function load() {
    setLoading(true)
    try {
      const [data, customers, technicians] = await Promise.all([
        api.admin.list(resource),
        api.admin.list("customers").catch(() => []),
        api.admin.list("technicians").catch(() => []),
      ])
      setItems(data)
      setReferences({ customers, technicians })
      setMessage("")
    } catch (error) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setForm(definition.initial)
    setEditingId(null)
    load()
  }, [resource])

  const filtered = useMemo(
    () =>
      items.filter((item) =>
        JSON.stringify(item).toLowerCase().includes(keyword.toLowerCase()),
      ),
    [items, keyword],
  )

  if (resource === "staff" && isStaff) {
    return (
      <section className="module-page">
        <div className="notice error">
          ⚠️ Bạn đang sử dụng tài khoản <b>Nhân viên (STAFF)</b>. Chỉ Admin quản trị hệ thống mới có quyền xem và quản lý tài khoản nhân viên.
        </div>
      </section>
    )
  }

  async function submit(event) {
    event.preventDefault()
    try {
      const payload = definition.makePayload
        ? definition.makePayload(form)
        : normalizePayload(form)
      if (editingId) await api.admin.update(resource, editingId, payload)
      else await api.admin.create(resource, payload)
      setForm(definition.initial)
      setEditingId(null)
      await load()
    } catch (error) {
      setMessage(error.message)
    }
  }

  const [deleteTargetId, setDeleteTargetId] = useState(null)

  async function remove(id) {
    if (isStaff) {
      toast.error("Tài khoản Nhân viên không có quyền xóa dữ liệu quan trọng!")
      return
    }
    setDeleteTargetId(id)
  }

  async function executeRemove() {
    if (!deleteTargetId) return
    const id = deleteTargetId
    setDeleteTargetId(null)
    try {
      await api.admin.remove(resource, id)
      toast.success("Đã xóa bản ghi thành công!")
      await load()
    } catch (error) {
      setMessage(error.message)
      toast.error(error.message || "Không thể xóa bản ghi này.")
    }
  }

  async function changeStatus(id, value) {
    try {
      await api.admin.status(resource, id, value)
      await load()
    } catch (error) {
      setMessage(error.message)
    }
  }

  function startEdit(item) {
    const next = {}
    definition.fields.forEach(([key]) => {
      next[key] = item[key] ?? ""
    })
    setForm(next)
    setEditingId(item.id)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <section className="module-page resource-manager">
      <div className="module-head">
        <div>
          <span>QUẢN LÝ HỆ THỐNG</span>
          <h1>{definition.title}</h1>
          <p>Dữ liệu đồng bộ trực tiếp với máy chủ SSLock Backend.</p>
        </div>
        {isStaff && (
          <span className="staff-badge">Quyền Nhân viên (Staff Mode)</span>
        )}
      </div>

      {message && <div className="notice error">{message}</div>}

      <div className="resource-layout">
        <form className="manager-form resource-form" onSubmit={submit}>
          <h3>{editingId ? "Cập nhật dữ liệu" : `Thêm ${definition.title.toLowerCase()}`}</h3>
          {definition.fields.map((field) => (
            <ResourceField
              field={field}
              form={form}
              key={field[0]}
              onChange={setForm}
              products={products}
              references={references}
            />
          ))}
          <button className="primary-button">{editingId ? "Lưu cập nhật" : "Thêm mới"}</button>
          {editingId && (
            <button onClick={() => { setEditingId(null); setForm(definition.initial) }} type="button">
              Hủy sửa
            </button>
          )}
        </form>

        <div className="resource-list">
          <div className="module-toolbar">
            <input
              onChange={(e) => setKeyword(e.target.value)}
              placeholder={`Tìm kiếm trong ${definition.title.toLowerCase()}...`}
              value={keyword}
            />
          </div>

          {loading ? (
            <div className="empty-module"><p>Đang tải dữ liệu...</p></div>
          ) : (
            <div className="table-panel">
              <table>
                <thead>
                  <tr>
                    {definition.columns.map(([, label]) => (
                      <th key={label}>{label}</th>
                    ))}
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item) => (
                    <tr key={item.id}>
                      {definition.columns.map(([key, , format]) => (
                        <td key={key}>{formatValue(read(item, key), format)}</td>
                      ))}
                      <td className="table-actions">
                        {definition.statuses && (
                          <select onChange={(e) => changeStatus(item.id, e.target.value)} value={item.status}>
                            <option value={item.status}>{item.status}</option>
                            {definition.statuses.filter((x) => x !== item.status).map((x) => (
                              <option key={x}>{x}</option>
                            ))}
                          </select>
                        )}
                        {definition.editable && (
                          <button onClick={() => startEdit(item)} type="button">Sửa</button>
                        )}
                        {!definition.noDelete && !isStaff && (
                          <button onClick={() => remove(item.id)} type="button">Xóa</button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {!filtered.length && (
                    <tr><td colSpan={definition.columns.length + 1}>Chưa có dữ liệu.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      {deleteTargetId && (
        <ConfirmModal
          isOpen={Boolean(deleteTargetId)}
          message="Bạn có chắc chắn muốn xóa bản ghi này khỏi hệ thống? Thao tác này không thể hoàn tác."
          onCancel={() => setDeleteTargetId(null)}
          onConfirm={executeRemove}
          title="Xác nhận xóa bản ghi"
        />
      )}
    </section>
  )
}

function ResourceField({ field: [key, label, type], form, onChange, products, references }) {
  const set = (value) => onChange({ ...form, [key]: value })
  const options =
    type === "products"
      ? products.map((x) => [x.id, x.name])
      : type === "customers"
      ? references.customers.map((x) => [x.id, `${x.fullName} - ${x.phone}`])
      : type === "technicians"
      ? references.technicians.map((x) => [x.id, x.fullName])
      : type === "inventoryType"
      ? [["IN", "Nhập kho"], ["OUT", "Xuất kho"]]
      : type === "technicianStatus"
      ? [["AVAILABLE", "Sẵn sàng"], ["BUSY", "Đang bận"], ["INACTIVE", "Ngừng hoạt động"]]
      : type === "roles"
      ? [["STAFF", "Nhân viên"], ["ADMIN", "Quản trị viên"]]
      : null

  if (options)
    return (
      <label>
        {label}
        <select required onChange={(e) => set(e.target.value)} value={form[key]}>
          <option value="">Chọn {label.toLowerCase()}</option>
          {options.map(([value, text]) => (
            <option key={value} value={value}>{text}</option>
          ))}
        </select>
      </label>
    )

  if (type === "textarea")
    return (
      <label>
        {label}
        <textarea onChange={(e) => set(e.target.value)} value={form[key]} />
      </label>
    )

  return (
    <label>
      {label}
      <input
        min={type === "number" ? 0 : undefined}
        onChange={(e) => set(e.target.value)}
        required={!["logoUrl", "email", "note"].includes(key)}
        type={type || "text"}
        value={form[key]}
      />
    </label>
  )
}

function normalizePayload(form) {
  return Object.fromEntries(
    Object.entries(form).map(([key, value]) => {
      if (["customerId", "productId", "technicianId"].includes(key))
        return [key, value ? Number(value) : null]
      if (["quantity", "total"].includes(key)) return [key, Number(value)]
      return [key, value]
    }),
  )
}

function formatValue(value, format) {
  if (value === null || value === undefined || value === "") return "—"
  if (format === "money") return formatMoney(Number(value))
  if (typeof value === "boolean") return value ? "Có" : "Không"
  if (typeof value === "string" && value.includes("T")) return new Date(value).toLocaleString("vi-VN")
  return String(value)
}

export default AdminResourceManager

