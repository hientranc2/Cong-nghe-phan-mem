Trần Thái Hiễn 3122411052
Lê Hồng Minh 3122411124

## Đồng bộ dữ liệu với json-server

- Chạy API giả lập: `npm run server` (mặc định trên http://localhost:3001) để chia sẻ dữ liệu giữa web (user/admin/restaurant) và ứng dụng mobile.
- Biến môi trường tùy chọn: `VITE_API_URL` cho web và `EXPO_PUBLIC_API_URL` cho mobile nếu bạn đổi cổng hoặc hostname.
- File `db.json` chứa chung `categories`, `menuItems`, `restaurants`, `users` và `orders` để mọi giao diện đọc/ghi cùng nguồn.
