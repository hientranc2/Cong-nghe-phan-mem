import { useEffect, useState } from "react";
import "./AuthModal.css";

function AuthModal({
  isOpen = false,
  mode = "login",
  onModeChange = () => {},
  onClose = () => {},
  onLogin = () => ({ success: false }),
  onRegister = () => ({ success: false }),
  texts = {},
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setFormData({ name: "", email: "", password: "" });
    setError("");
  }, [isOpen, mode]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const isLogin = mode === "login";
  const loginTitle = texts.loginTitle ?? "Đăng nhập";
  const registerTitle = texts.registerTitle ?? "Đăng ký tài khoản";
  const title = isLogin ? loginTitle : registerTitle;
  const loginSubtitle =
    texts.loginSubtitle ?? "Nhập email và mật khẩu để tiếp tục đặt món.";
  const registerSubtitle =
    texts.registerSubtitle ??
    "Tạo tài khoản để lưu thông tin và theo dõi đơn hàng dễ dàng.";
  const subtitle = isLogin ? loginSubtitle : registerSubtitle;
  const nameLabel = texts.nameLabel ?? "Họ và tên";
  const emailLabel = texts.emailLabel ?? "Email";
  const passwordLabel = texts.passwordLabel ?? "Mật khẩu";
  const submitLogin = texts.submitLogin ?? "Đăng nhập";
  const submitRegister = texts.submitRegister ?? "Tạo tài khoản";
  const toggleToLogin =
    texts.toggleToLogin ?? "Đã có tài khoản? Đăng nhập";
  const toggleToRegister =
    texts.toggleToRegister ?? "Chưa có tài khoản? Đăng ký ngay";
  const closeLabel = texts.closeLabel ?? "Đóng hộp thoại";
  const genericError =
    texts.errors?.generic ?? "Đã xảy ra lỗi. Vui lòng thử lại.";

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const action = isLogin ? onLogin : onRegister;
    const result = action({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    });

    if (result?.success) {
      setError("");
    } else {
      setError(result?.error ?? genericError);
    }
  };

  const handleToggleMode = () => {
    onModeChange(isLogin ? "register" : "login");
    setError("");
  };

  const handleOverlayMouseDown = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="auth-modal__overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      onMouseDown={handleOverlayMouseDown}
    >
      <div className="auth-modal" role="document">
        <button
          type="button"
          className="auth-modal__close"
          onClick={onClose}
          aria-label={closeLabel}
        >
          ×
        </button>
        <div className="auth-modal__header">
          <h2 id="auth-modal-title">{title}</h2>
          <p>{subtitle}</p>
        </div>
        <form className="auth-modal__form" onSubmit={handleSubmit}>
          {!isLogin && (
            <label className="auth-modal__field">
              <span>{nameLabel}</span>
              <input
                type="text"
                value={formData.name}
                onChange={handleChange("name")}
                autoComplete="name"
                placeholder={nameLabel}
                required
              />
            </label>
          )}
          <label className="auth-modal__field">
            <span>{emailLabel}</span>
            <input
              type="email"
              value={formData.email}
              onChange={handleChange("email")}
              autoComplete="email"
              placeholder="name@example.com"
              required
            />
          </label>
          <label className="auth-modal__field">
            <span>{passwordLabel}</span>
            <input
              type="password"
              value={formData.password}
              onChange={handleChange("password")}
              autoComplete={isLogin ? "current-password" : "new-password"}
              placeholder="••••••••"
              required
            />
          </label>
          {error && <p className="auth-modal__error">{error}</p>}
          <button type="submit" className="auth-modal__submit">
            {isLogin ? submitLogin : submitRegister}
          </button>
        </form>
        <button
          type="button"
          className="auth-modal__toggle"
          onClick={handleToggleMode}
        >
          {isLogin ? toggleToRegister : toggleToLogin}
        </button>
      </div>
    </div>
  );
}

export default AuthModal;
