export const authContent = {
  login: {
    tabLabel: "Đăng nhập",
    title: "Chào mừng trở lại",
    subtitle:
      "Đăng nhập để theo dõi đơn hàng, lưu địa chỉ giao hàng và nhận các ưu đãi mới nhất từ FCO.",
    primaryAction: "Đăng nhập",
    successTitle: "Đăng nhập thành công",
    successMessage:
      "Đây là dữ liệu minh họa. Chúng tôi sẽ kết nối với máy chủ khi tính năng hoàn thiện.",
    switchLabel: "Chưa có tài khoản?",
    switchAction: "Đăng ký ngay",
    policyText:
      "Khi tiếp tục, bạn đã đồng ý với Điều khoản sử dụng và Chính sách bảo mật của FCO.",
    fields: [
      {
        id: "phone",
        label: "Số điện thoại",
        placeholder: "Nhập số điện thoại",
        keyboardType: "phone-pad",
      },
      {
        id: "password",
        label: "Mật khẩu",
        placeholder: "Nhập mật khẩu",
        secureTextEntry: true,
      },
    ],
  },
  register: {
    tabLabel: "Đăng ký",
    title: "Tạo tài khoản mới",
    subtitle:
      "Chỉ mất vài giây để tham gia FCO. Hãy đăng ký và bắt đầu trải nghiệm giao đồ ăn nhanh chóng.",
    primaryAction: "Đăng ký",
    successTitle: "Đăng ký thành công",
    successMessage:
      "Đây là dữ liệu minh họa. Chúng tôi sẽ gửi thông báo khi tài khoản sẵn sàng.",
    switchLabel: "Đã có tài khoản?",
    switchAction: "Đăng nhập",
    policyText:
      "Bằng cách đăng ký, bạn đồng ý nhận thông tin khuyến mãi qua SMS và email từ FCO.",
    fields: [
      {
        id: "fullName",
        label: "Họ và tên",
        placeholder: "Nhập họ và tên",
        autoCapitalize: "words",
      },
      {
        id: "phone",
        label: "Số điện thoại",
        placeholder: "Nhập số điện thoại",
        keyboardType: "phone-pad",
      },
      {
        id: "password",
        label: "Mật khẩu",
        placeholder: "Tạo mật khẩu",
        secureTextEntry: true,
      },
      {
        id: "confirmPassword",
        label: "Xác nhận mật khẩu",
        placeholder: "Nhập lại mật khẩu",
        secureTextEntry: true,
      },
    ],
  },
};
