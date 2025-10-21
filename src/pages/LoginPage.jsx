import { useState } from "react";
import "./AuthPages.css";

function LoginPage({
  onLogin = () => {},
  onNavigateRegister = () => {},
  texts = {},
  message = "",
}) {
  const title = texts.title ?? "Đăng nhập";
  const subtitle =
    texts.subtitle ?? "Đăng nhập để theo dõi đơn hàng và thanh toán nhanh chóng.";
  const emailLabel = texts.emailLabel ?? "Email";
  const passwordLabel = texts.passwordLabel ?? "Mật khẩu";
  const submitLabel = texts.submitLabel ?? "Đăng nhập";
  const registerPrompt = texts.registerPrompt ?? "Chưa có tài khoản?";
  const registerLinkLabel = texts.registerLinkLabel ?? "Đăng ký ngay";
 
  const messageLabel = texts.messageLabel ?? "Lưu ý";
  const defaultErrorMessage =
    texts.errorMessage ?? "Đăng nhập không thành công. Vui lòng kiểm tra lại.";
 

  const [formState, setFormState] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    try {
      const result = onLogin({
        email: formState.email.trim(),
        password: formState.password,
      });

      if (!result?.success) {
        setError(result?.message ?? defaultErrorMessage);
      }
    } catch (submissionError) {
      setError(defaultErrorMessage);
    }
  };

  return (
    <main className="auth-page" aria-labelledby="login-heading">
      <section className="auth-card">
        <h2 id="login-heading">{title}</h2>
        <p className="auth-card__subtitle">{subtitle}</p>
        {message && (
          <div className="auth-card__info" role="status" aria-live="polite">
            <strong>{messageLabel}:</strong>
            <span>{message}</span>
          </div>
        )}
        {error && (
          <div className="auth-card__error" role="alert">
            {error}
          </div>
        )}
        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="login-email">
            {emailLabel}
            <input
              id="login-email"
              name="email"
              type="email"
              value={formState.email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </label>
          <label htmlFor="login-password">
            {passwordLabel}
            <input
              id="login-password"
              name="password"
              type="password"
              value={formState.password}
              onChange={handleChange}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </label>
          <button type="submit" className="auth-submit">
            {submitLabel}
          </button>
        </form>
        <p className="auth-card__switch">
          {registerPrompt}{" "}
          <button type="button" className="auth-link" onClick={onNavigateRegister}>
            {registerLinkLabel}
          </button>
        </p>
      </section>
    
    </main>
  );
}

export default LoginPage;
