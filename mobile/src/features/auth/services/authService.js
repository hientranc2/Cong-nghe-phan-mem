import { createRecord, fetchCollection } from "../../../utils/api";

const normalizePhone = (phone) => (phone ?? "").replace(/\D/g, "");
const normalizeEmail = (email) => (email ?? "").trim().toLowerCase();

const loadUsers = async () => {
  try {
    const users = await fetchCollection("users");
    if (Array.isArray(users)) {
      return users;
    }
  } catch (error) {
    console.error("Không thể tải danh sách người dùng", error);
  }

  return [];
};

export const authService = {
  login: async ({ phone, password }) => {
    const identifier = phone?.trim() ?? "";
    const normalizedPhone = normalizePhone(identifier);
    const normalizedEmail = identifier.includes("@")
      ? normalizeEmail(identifier)
      : "";
    const trimmedPassword = password?.trim() ?? "";

    if ((!normalizedPhone && !normalizedEmail) || !trimmedPassword) {
      return {
        success: false,
        message: "Vui lòng nhập số điện thoại/email và mật khẩu.",
      };
    }

    const users = await loadUsers();
    const existingUser = users.find((user) => {
      const phoneMatch =
        normalizedPhone && normalizePhone(user.phone ?? "") === normalizedPhone;
      const emailMatch =
        normalizedEmail && normalizeEmail(user.email ?? "") === normalizedEmail;

      return (phoneMatch || emailMatch) && user.password === trimmedPassword;
    });

    if (!existingUser) {
      return {
        success: false,
        message: "Thông tin đăng nhập chưa chính xác.",
      };
    }

    const normalizedUser = {
      ...existingUser,
      name: existingUser.name ?? existingUser.fullName,
      fullName: existingUser.fullName ?? existingUser.name,
    };

    return {
      success: true,
      message: `Xin chào ${
        normalizedUser.fullName ?? normalizedUser.name
      }! Bạn đã đăng nhập thành công.`,
      user: normalizedUser,
    };
  },
  register: async ({ fullName, phone, email, password }) => {
    const normalizedPhone = normalizePhone(phone ?? "");
    const safeFullName = fullName?.trim();
    const safeEmail = normalizeEmail(email);
    const trimmedPassword = password?.trim();

    if (!safeFullName || safeFullName.length < 3) {
      return {
        success: false,
        message: "Vui lòng nhập họ tên đầy đủ (tối thiểu 3 ký tự).",
      };
    }

    if (!normalizedPhone || normalizedPhone.length < 9) {
      return {
        success: false,
        message: "Số điện thoại không hợp lệ.",
      };
    }

    if (!safeEmail || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(safeEmail)) {
      return {
        success: false,
        message: "Email không hợp lệ.",
      };
    }

    if (!trimmedPassword || trimmedPassword.length < 8) {
      return {
        success: false,
        message: "Mật khẩu phải có tối thiểu 8 ký tự.",
      };
    }

    const users = await loadUsers();
    const duplicateUser = users.some((user) => {
      const samePhone =
        normalizedPhone && normalizePhone(user.phone ?? "") === normalizedPhone;
      const sameEmail = normalizeEmail(user.email ?? "") === safeEmail;
      return samePhone || sameEmail;
    });

    if (duplicateUser) {
      return {
        success: false,
        message: "Số điện thoại hoặc email đã tồn tại.",
      };
    }

    try {
      await createRecord("users", {
        fullName: safeFullName,
        name: safeFullName,
        phone: normalizedPhone,
        email: safeEmail,
        password: trimmedPassword,
        role: "customer",
        tier: "Tiêu chuẩn",
        active: true,
        joinedAt: new Date().toISOString().slice(0, 10),
      });
    } catch (error) {
      console.error("Không thể lưu tài khoản mới", error);
      return {
        success: false,
        message: "Không thể tạo tài khoản mới. Vui lòng thử lại.",
      };
    }

    return {
      success: true,
      message: "Tạo tài khoản thành công! Vui lòng đăng nhập để tiếp tục.",
    };
  },
};
