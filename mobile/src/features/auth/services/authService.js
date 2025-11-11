const users = [
  {
    fullName: "Nguyễn Văn A",
    phone: "0987654321",
    email: "nguyenvana@example.com",
    password: "matkhau123"
  }
];

const normalizePhone = (phone) => phone.replace(/\D/g, "");

export const authService = {
  login: ({ phone, password }) => {
    const normalizedPhone = normalizePhone(phone ?? "");
    const trimmedPassword = password?.trim() ?? "";

    if (!normalizedPhone) {
      return {
        success: false,
        message: "Vui lòng nhập số điện thoại để đăng nhập."
      };
    }

    if (!trimmedPassword) {
      return {
        success: false,
        message: "Vui lòng nhập mật khẩu để tiếp tục."
      };
    }

    const existingUser = users.find(
      (user) => normalizePhone(user.phone) === normalizedPhone
    );

    if (!existingUser) {
      return {
        success: false,
        message: "Số điện thoại chưa được đăng ký."
      };
    }

    if (existingUser.password !== trimmedPassword) {
      return {
        success: false,
        message: "Mật khẩu không chính xác."
      };
    }

    return {
      success: true,
      message: `Xin chào ${existingUser.fullName}! Bạn đã đăng nhập thành công.`,
      user: existingUser
    };
  },
  register: ({ fullName, phone, email, password }) => {
    const normalizedPhone = normalizePhone(phone ?? "");
    const safeFullName = fullName?.trim();
    const safeEmail = email?.trim();
    const trimmedPassword = password?.trim();

    if (!safeFullName || safeFullName.length < 3) {
      return {
        success: false,
        message: "Vui lòng nhập họ tên đầy đủ (tối thiểu 3 ký tự)."
      };
    }

    if (!normalizedPhone || normalizedPhone.length < 9) {
      return {
        success: false,
        message: "Số điện thoại không hợp lệ."
      };
    }

    if (!safeEmail || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(safeEmail)) {
      return {
        success: false,
        message: "Email không hợp lệ."
      };
    }

    if (!trimmedPassword || trimmedPassword.length < 8) {
      return {
        success: false,
        message: "Mật khẩu phải có tối thiểu 8 ký tự."
      };
    }

    const phoneExists = users.some(
      (user) => normalizePhone(user.phone) === normalizedPhone
    );

    if (phoneExists) {
      return {
        success: false,
        message: "Số điện thoại đã được đăng ký trước đó."
      };
    }

    users.push({
      fullName: safeFullName,
      phone: normalizedPhone,
      email: safeEmail,
      password: trimmedPassword
    });

    return {
      success: true,
      message: "Tạo tài khoản thành công! Vui lòng đăng nhập để tiếp tục."
    };
  }
};
