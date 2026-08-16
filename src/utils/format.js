export function formatMoney(value) {
  return Number(value).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  })
}
