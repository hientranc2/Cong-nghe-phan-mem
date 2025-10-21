import { useState } from "react";
import "./AuthPages.css";

function RegisterPage({
  onRegister = () => {},
  onNavigateLogin = () => {},
  texts = {},
}) {
  const title = texts.title ?? "Tạo tài khoản";
  const subtitle =
    texts.subtitle ?? "Đăng ký tài khoản để đặt món và theo dõi lịch sử đơn hàng.";
  const nameLabel = texts.nameLabel ?? "Họ và tên";
  const emailLabel = texts.emailLabel ?? "Email";
  const passwordLabel = texts.passwordLabel ?? "Mật khẩu";
  const submitLabel = texts.submitLabel ?? "Đăng ký";
  const loginPrompt = texts.loginPrompt ?? "Đã có tài khoản?";
  const loginLinkLabel = texts.loginLinkLabel ?? "Đăng nhập";
  const successMessage =
    texts.successMessage ?? "Đăng ký thành công! Đang chuyển hướng...";
  const defaultErrorMessage =
    texts.errorMessage ?? "Không thể đăng ký. Vui lòng kiểm tra thông tin.";
 

  const [formState, setFormState] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");
    setInfo("");

    try {
      const result = onRegister({
        name: formState.name,
        email: formState.email.trim(),
        password: formState.password,
      });

      if (!result?.success) {
        setError(result?.message ?? defaultErrorMessage);
        return;
      }

      setInfo(successMessage);
    } catch (submissionError) {
      setError(defaultErrorMessage);
    }
  };

  return (
    <main className="auth-page" aria-labelledby="register-heading">
      <section className="auth-card">
        <h2 id="register-heading">{title}</h2>
        <p className="auth-card__subtitle">{subtitle}</p>
        {error && (
          <div className="auth-card__error" role="alert">
            {error}
          </div>
        )}
        {info && (
          <div className="auth-card__info" role="status" aria-live="polite">
            {info}
          </div>
        )}
        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="register-name">
            {nameLabel}
            <input
              id="register-name"
              name="name"
              type="text"
              value={formState.name}
              onChange={handleChange}
              placeholder="Nguyễn Văn A"
              autoComplete="name"
              required
            />
          </label>
          <label htmlFor="register-email">
            {emailLabel}
            <input
              id="register-email"
              name="email"
              type="email"
              value={formState.email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </label>
          <label htmlFor="register-password">
            {passwordLabel}
            <input
              id="register-password"
              name="password"
              type="password"
              value={formState.password}
              onChange={handleChange}
              placeholder="••••••••"
              autoComplete="new-password"
              minLength={6}
              required
            />
          </label>
     
          <button type="submit" className="auth-submit">
            {submitLabel}
          </button>
        </form>
        <p className="auth-card__switch">
          {loginPrompt}{" "}
          <button type="button" className="auth-link" onClick={onNavigateLogin}>
            {loginLinkLabel}
          </button>
        </p>
      </section>
    </main>
  );
}

export default RegisterPage;
