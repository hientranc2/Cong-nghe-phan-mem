export const authContent = {
  heading: "Chào mừng đến với FCO",
  description:
    "Đăng nhập để tiếp tục đặt món yêu thích hoặc tạo tài khoản mới để nhận ưu đãi thành viên.",
  tabs: [
    { id: "login", label: "Đăng nhập" },
    { id: "register", label: "Đăng ký" }
  ],
  forms: {
    login: {
      primaryAction: "Đăng nhập",
      secondaryAction: "Quên mật khẩu?",
      fields: [
        {
          id: "phone",
          label: "Số điện thoại hoặc email",
          placeholder: "Nhập số điện thoại hoặc email đã đăng ký",
          keyboardType: "default"
        },
        {
          id: "password",
          label: "Mật khẩu",
          placeholder: "Nhập mật khẩu",
          secureTextEntry: true
        }
      ]
    },
    register: {
      primaryAction: "Tạo tài khoản",
      secondaryHint: "Khi đăng ký, bạn đồng ý với Điều khoản dịch vụ của FCO.",
      fields: [
        {
          id: "fullName",
          label: "Họ và tên",
          placeholder: "Nhập họ và tên đầy đủ"
        },
        {
          id: "phone",
          label: "Số điện thoại",
          placeholder: "Nhập số điện thoại liên hệ",
          keyboardType: "phone-pad"
        },
        {
          id: "email",
          label: "Email",
          placeholder: "Nhập email nhận thông báo",
          keyboardType: "email-address"
        },
        {
          id: "password",
          label: "Mật khẩu",
          placeholder: "Tạo mật khẩu tối thiểu 8 ký tự",
          secureTextEntry: true
        }
      ]
    }
  },
  socialProviders: [
    { id: "google", label: "Tiếp tục với Google", icon: "🟢" },
    { id: "facebook", label: "Tiếp tục với Facebook", icon: "📘" },
    { id: "apple", label: "Tiếp tục với Apple", icon: "⚫" }
  ],
  contactSupport: {
    title: "Cần hỗ trợ?",
    content: "Gọi hotline 1900 0999 hoặc chat với FCO Care để được hỗ trợ 24/7."
  }
};
