# Công Nghệ Phần Mềm – Monorepo

Monorepo này chứa cả ứng dụng web (React + Vite) và ứng dụng di động (React Native với Expo) sử dụng chung bộ nhận diện thương hiệu của FCO.

## Cấu trúc thư mục

```
apps/
  mobile/   # Ứng dụng React Native dùng Expo
  web/      # Ứng dụng web React + Vite
packages/
  theme/    # Gói chia sẻ bảng màu, khoảng cách, typography
```

## Bắt đầu

> **Yêu cầu:** Node.js >= 18.18 và npm >= 8 (hỗ trợ npm workspaces).

Cài đặt toàn bộ dependencies cho cả monorepo:

```bash
npm install
```

> Nếu gặp lỗi khi cài đặt Expo do giới hạn mạng nội bộ, hãy thử lại trên môi trường có quyền truy cập npm đầy đủ.

## Các lệnh hữu ích

### Web (React + Vite)

```bash
npm run dev:web      # chạy dev server với HMR
npm run build:web    # build production
npm run preview:web  # chạy bản build đã tạo
npm run lint:web     # kiểm tra lint theo cấu hình ESLint
```

### Mobile (React Native + Expo)

```bash
npm run start:mobile   # khởi động Expo Metro bundler
npm run android:mobile # chạy trên thiết bị/giả lập Android (thông qua Expo)
npm run ios:mobile     # chạy trên thiết bị/giả lập iOS (thông qua Expo)
```

Ứng dụng di động và web cùng nhập bảng màu từ `@cong/theme` nên giữ được trải nghiệm thương hiệu thống nhất.

## Chia sẻ chủ đề

Gói `@cong/theme` cung cấp:

- `palette`: Bảng màu chính (`primary`, `primary-dark`, `background`, ...)
- `spacing` & `radii`: Giá trị dùng chung cho layout
- `typography`: font mặc định

Ứng dụng web tự động gán các giá trị này thành CSS variables, trong khi ứng dụng mobile sử dụng trực tiếp trong `StyleSheet` của React Native.
