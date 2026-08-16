# React + Vite

## Kết nối backend

Frontend gọi backend qua `/api`. Khi chạy `npm run dev`, Vite tự proxy sang
`http://localhost:8080`. Khi deploy riêng frontend, sao chép `.env.example`
thành `.env` và đổi `VITE_API_URL` sang URL backend thực tế.

Phiên đăng nhập được lưu trong `sessionStorage` và mọi API quản trị tự gửi
header `X-Auth-Token`.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
