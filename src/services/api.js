import axios from "axios"

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: { "Content-Type": "application/json" },
})

client.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("sslock_token")
  if (token) config.headers["X-Auth-Token"] = token
  return config
})

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config?.url?.includes("/auth/login")) {
      sessionStorage.removeItem("sslock_token")
      sessionStorage.removeItem("sslock_user")
      if (window.location.pathname !== "/login") {
        window.location.replace("/login")
      }
    }
    const value = error.response?.data?.message
      || error.response?.data?.error
      || error.response?.data
      || "Không thể kết nối đến máy chủ."
    return Promise.reject(new Error(typeof value === "string" ? value : "Yêu cầu không thành công."))
  },
)

const unwrap = (request) => request.then(({ data }) => data)

export const api = {
  login: (payload) => unwrap(client.post("/auth/login", payload)),
  logout: () => unwrap(client.post("/auth/logout")),
  products: {
    list: () => unwrap(client.get("/products")),
    create: (payload) => unwrap(client.post("/products", payload)),
    update: (id, payload) => unwrap(client.put(`/products/${id}`, payload)),
    remove: (id) => unwrap(client.delete(`/products/${id}`)),
  },
  categories: {
    list: () => unwrap(client.get("/categories")),
    create: (payload) => unwrap(client.post("/categories", payload)),
    update: (id, payload) => unwrap(client.put(`/categories/${id}`, payload)),
    remove: (id) => unwrap(client.delete(`/categories/${id}`)),
  },
  articles: {
    list: () => unwrap(client.get("/articles")),
    create: (payload) => unwrap(client.post("/articles", articlePayload(payload))),
    update: (id, payload) => unwrap(client.put(`/articles/${id}`, articlePayload(payload))),
    remove: (id) => unwrap(client.delete(`/articles/${id}`)),
  },
  requests: {
    create: (payload) => unwrap(client.post("/requests", payload)),
    list:   ()        => unwrap(client.get("/requests")),
    track:  (query)   => unwrap(client.get("/requests/track", { params: { query } })),
    assign: (id, technicianId) => unwrap(client.patch(`/requests/${id}/assign`, null, { params: { technicianId } })),
    status: (id, value)        => unwrap(client.patch(`/requests/${id}/status`,  null, { params: { value } })),
    remove: (id)               => unwrap(client.delete(`/requests/${id}`)),
  },
  subscribers: {
    subscribe: (email) => unwrap(client.post("/subscribers", { email })),
    list: () => unwrap(client.get("/subscribers")),
    remove: (id) => unwrap(client.delete(`/subscribers/${id}`)),
    broadcast: (subject, content) => unwrap(client.post("/subscribers/broadcast", { subject, content })),
  },
  orders: {
    list:   ()                  => unwrap(client.get("/orders")),
    create: (payload)           => unwrap(client.post("/orders", payload)),
    status: (id, value)         => unwrap(client.patch(`/orders/${id}/status`, null, { params: { value } })),
    remove: (id)                => unwrap(client.delete(`/orders/${id}`)),
  },
  customers: {
    list:   ()                  => unwrap(client.get("/customers")),
    create: (payload)           => unwrap(client.post("/customers", payload)),
    update: (id, payload)       => unwrap(client.put(`/customers/${id}`, payload)),
    remove: (id)                => unwrap(client.delete(`/customers/${id}`)),
  },
  warranties: {
    verify: (query)             => unwrap(client.get(`/warranties/verify/${encodeURIComponent(query)}`)),
  },
  dashboard: () => unwrap(client.get("/dashboard")),
  admin: {
    list:   (resource)          => unwrap(client.get(`/${resource}`)),
    create: (resource, payload) => unwrap(client.post(`/${resource}`, payload)),
    update: (resource, id, payload) => unwrap(client.put(`/${resource}/${id}`, payload)),
    remove: (resource, id)      => unwrap(client.delete(`/${resource}/${id}`)),
    status: (resource, id, value) => unwrap(client.patch(`/${resource}/${id}/status`, null, { params: { value } })),
    assignTechnician: (id, technicianId) => unwrap(client.patch(`/installations/${id}/assign`, null, {
      params: { technicianId },
    })),
  },
}

export const normalizeProduct = (product) => ({
  ...product,
  serialNumber: product.serialNumber || "",
  features: [...(product.features || [])],
  suitableFor: product.suitableFor || [],
  installTime: product.installPolicy || product.installTime || "",
  imageTone: product.imageTone || "navy",
})

export const productPayload = (product) => ({
  sku: product.sku || `SKU-${Date.now().toString().slice(-6)}`,
  name: product.name,
  serialNumber: product.serialNumber || "",
  brand: product.brand,
  status: product.status,
  doorType: product.doorType || "",
  material: product.material || "",
  app: product.app || "",
  installPolicy: product.installPolicy || product.installTime || "",
  imageUrl: product.imageUrl || "",
  description: product.description || "",
  price: Number(product.price) || 0,
  stock: Number(product.stock) || 0,
  warrantyMonths: Number(product.warrantyMonths) || 0,
  features: product.features || [],
  categoryId: Number(product.categoryId),
})

export const normalizeCategory = (category) => ({
  ...category,
  status: category.active ? "Đang bán" : "Tạm ẩn",
})

export const categoryPayload = (category) => ({
  code: category.code,
  name: category.name,
  description: category.description,
  active: category.status !== "Tạm ẩn",
})

export const normalizeArticle = (article) => ({
  ...article,
  type: article.type?.toLowerCase(),
  date: article.createdAt
    ? new Date(article.createdAt).toLocaleDateString("vi-VN")
    : new Date().toLocaleDateString("vi-VN"),
  tone: article.type === "PROJECT" ? "ocean" : "tips",
})

export const articlePayload = (article) => ({
  title: article.title,
  summary: article.summary,
  content: article.content || article.summary || "",
  imageUrl: article.imageUrl || "",
  type: (article.type || "project").toUpperCase(),
  published: article.published !== false,
})
