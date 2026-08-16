export const roles = {
  admin: { label: "Quản trị viên", canManageProducts: true, canManageCategories: true, canDelete: true },
  staff: { label: "Nhân viên tư vấn & điều phối", canManageProducts: true, canManageCategories: false, canDelete: false },
  technician: { label: "Nhân viên kỹ thuật (Lắp đặt & Bảo hành)", canManageProducts: false, canManageCategories: false, canDelete: false },
  user: { label: "Khách hàng", canManageProducts: false, canManageCategories: false, canDelete: false },
}

export const emptyProduct = {
  name: "",
  sku: "",
  serialNumber: "",
  categoryId: 1,
  brand: "",
  price: "",
  stock: "",
  status: "Đang bán",
  warrantyMonths: "24",
  doorType: "Cửa gỗ",
  material: "",
  app: "App TTLock",
  installPolicy: "Miễn phí lắp đặt tận nơi",
  description: "",
}

export const emptyCategory = {
  name: "",
  code: "",
  status: "Đang bán",
  description: "",
}
