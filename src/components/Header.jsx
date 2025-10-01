import { useState } from "react";
import "./Header.css";

function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  return (
    <header className="header">
      {/* Bên trái */}
      <div className="header-left">
        {/* Icon Home */}
        <div className="home-icon" onClick={() => window.location.href = "/"}>
          🍔
        </div>

        {/* Logo + tagline */}
        <div className="logo">
          <h1>Fastfood Delivery</h1>
          <p>Giao hàng bằng Drone cực nhanh 🚀</p>
        </div>

        {/* Menu ngang */}
        <nav className="main-nav">
          <a href="#menu">Thực đơn</a>
          <a href="#combo">Combo + Khuyến mãi</a>
          <a href="#about">Giới thiệu</a>
        </nav>
      </div>

      {/* Bên phải */}
      <div className="header-right">
        {/* Icon menu sản phẩm */}
        <div
          className="icon"
          onMouseEnter={() => setShowMenu(true)}
          onMouseLeave={() => setShowMenu(false)}
        >
          ☰
          {showMenu && (
            <div className="dropdown">
              <p><strong>Danh mục sản phẩm</strong></p>
              <a href="#">🍕 Pizza</a>
              <a href="#">🍔 Burger</a>
              <a href="#">🥤 Drinks</a>
              <a href="#">🍟 Snacks</a>
              <hr />
              <p><strong>Món ăn nổi bật</strong></p>
              <a href="#">🔥 Pizza phô mai</a>
              <a href="#">🍔 Burger gà giòn</a>
              <a href="#">🥤 Trà sữa</a>
            </div>
          )}
        </div>

        {/* Icon giỏ hàng */}
        <div className="icon" onClick={() => setShowCart(!showCart)}>
          🛒
          {showCart && (
            <div className="dropdown">
              <p>Giỏ hàng của bạn trống</p>
            </div>
          )}
        </div>

        {/* Icon đăng nhập */}
        <div className="icon" onClick={() => setShowLogin(!showLogin)}>
          👤
          {showLogin && (
            <div className="dropdown">
              <p>Đăng nhập / Đăng ký</p>
              <button>Login</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
