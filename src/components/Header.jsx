import { useState } from "react";
import "./Header.css";

function Header({ cartCount = 0 }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fco-header">
      <div className="fco-topbar">
        <span>FCO giao nhanh trong 15 phút · Freeship đơn từ 199k</span>
        <div className="topbar-actions">
          <a href="tel:19001900">📞 Hotline: 1900 1900</a>
          <a href="#tracking">🚚 Theo dõi đơn</a>
        </div>
      </div>

      <div className="fco-mainbar">
        <div className="brand" onClick={() => (window.location.href = "/") }>
          <div className="brand-logo">FCO</div>
          <div className="brand-text">
            <h1>FCO FoodFast Delivery</h1>
            <p>Ăn ngon chuẩn vị - giao tận nơi siêu tốc</p>
          </div>
        </div>

        <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
          <a href="#menu">Danh mục món</a>
          <a href="#best-seller">Bán chạy</a>
          <a href="#combo">Combo ưu đãi</a>
          <a href="#promo">Khuyến mãi</a>
          <a href="#about">Về FCO</a>
        </nav>

        <div className="nav-actions">
          <button className="location-btn" type="button">
            📍 Giao đến: <strong>TP. Hồ Chí Minh</strong>
          </button>
          <button className="login-btn" type="button">
            👤 Đăng nhập
          </button>
          <a className="cart-btn" href="#cart" aria-label="Giỏ hàng">
            🛒<span className="cart-label">Giỏ hàng</span>
            <span className="cart-count">{cartCount}</span>
          </a>
          <button
            className="menu-toggle"
            type="button"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
