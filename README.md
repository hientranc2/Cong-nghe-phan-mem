Trần Thái Hiễn 3122411052
Lê Hồng Minh 3122411124

## Đồng bộ dữ liệu với json-server

- Chạy API giả lập: `npm run server` (mặc định trên http://localhost:3001) để chia sẻ dữ liệu giữa web (user/admin/restaurant) và ứng dụng mobile.
- Biến môi trường tùy chọn: `VITE_API_URL` cho web và `EXPO_PUBLIC_API_URL` cho mobile nếu bạn đổi cổng hoặc hostname.
- File `db.json` chứa chung `categories`, `menuItems`, `restaurants`, `users` và `orders` để mọi giao diện đọc/ghi cùng nguồn.

## Backend Mongo bằng Express + Mongoose

- Khi cần chạy với MongoDB, dùng dịch vụ mới tại `server/` (Express + Mongoose) theo cổng mặc định `4000`:
  - Chuẩn bị biến môi trường: cập nhật `.env` với `MONGO_URI=<mongo-connection-string>` và `VITE_API_URL=http://localhost:4000`.
  - Khởi động API: `npm run api`.
  - Chạy web: `npm run dev` (frontend sẽ trỏ tới API Mongo theo `VITE_API_URL`).
- Mặc định không cần Mongo: tiếp tục dùng `npm run server` để khởi động json-server trên cổng `3001`.
- (Tuỳ chọn) Seed dữ liệu Mongo từ file `db.json`: `npm run migrate` sau khi cấu hình `MONGO_URI`.
