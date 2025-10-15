import { useState } from "react";
import "./Header.css";

function Header({
  cartCount = 0,
  onCartOpen = () => {},
  onNavigateHome = () => {},
  onNavigateSection = () => {},
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSectionClick = (event, sectionId) => {
    event.preventDefault();
    onNavigateSection(sectionId);
    setMenuOpen(false);
  };

  const handleHomeNavigation = () => {
    setMenuOpen(false);
    onNavigateHome();
  };

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
        <div
          className="brand"
          role="button"
          tabIndex={0}
          onClick={handleHomeNavigation}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              handleHomeNavigation();
            }
          }}
        >
          <div className="brand-logo">FCO</div>
          <div className="brand-text">
            <h1>FCO FoodFast Delivery</h1>
            <p>Ăn ngon chuẩn vị - giao tận nơi siêu tốc</p>
          </div>
        </div>

        <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
          <a href="/#menu" onClick={(event) => handleSectionClick(event, "menu")}>
            Danh mục món
          </a>
          <a
            href="/#best-seller"
            onClick={(event) => handleSectionClick(event, "best-seller")}
          >
            Bán chạy
          </a>
          <a href="/#combo" onClick={(event) => handleSectionClick(event, "combo")}>
            Combo ưu đãi
          </a>
          <a href="/#promo" onClick={(event) => handleSectionClick(event, "promo")}>
            Khuyến mãi
          </a>
          <a href="/#about" onClick={(event) => handleSectionClick(event, "about")}>
            Về FCO
          </a>
        </nav>

        <div className="nav-actions">
          <button className="location-btn" type="button">
            📍 Giao đến: <strong>TP. Hồ Chí Minh</strong>
          </button>
          <button className="login-btn" type="button">
            👤 Đăng nhập
          </button>
          <button
            className="cart-btn"
            type="button"
            aria-label="Giỏ hàng"
            onClick={onCartOpen}
          >
            🛒<span className="cart-label">Giỏ hàng</span>
            <span className="cart-count">{cartCount}</span>
          </button>
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
