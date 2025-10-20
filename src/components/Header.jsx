import { useMemo, useState } from "react";
import vnFlag from "../assets/flags/vietnam.svg";
import ukFlag from "../assets/flags/united-kingdom.svg";
import "./Header.css";

const DEFAULT_NAV_LINKS = [
  { id: "menu", label: "Danh mục món" },
  { id: "best-seller", label: "Bán chạy" },
  { id: "combo", label: "Combo ưu đãi" },
  { id: "promo", label: "Khuyến mãi" },
];

const LANGUAGE_ICONS = {
  vi: vnFlag,
  en: ukFlag,
};

function Header({
  cartCount = 0,
  onCartOpen = () => {},
  onNavigateHome = () => {},
  onNavigateSection = () => {},
  texts = {},
  brandTagline = "",
  language = "vi",
  onLanguageChange = () => {},
  user = null,
  onLoginClick = () => {},
  onLogout = () => {},
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = useMemo(
    () => texts?.navLinks ?? DEFAULT_NAV_LINKS,
    [texts]
  );

  const languageOptions = useMemo(() => {
    const options = texts?.language?.options ?? {};

    if (Object.keys(options).length === 0) {
      return [
        { id: "vi", label: "Tiếng Việt", icon: vnFlag },
        { id: "en", label: "English", icon: ukFlag },
      ];
    }

    return Object.entries(options).map(([id, option]) => ({
      id,
      label: option.label ?? id,
      icon: LANGUAGE_ICONS[id] ?? LANGUAGE_ICONS.vi,
    }));
  }, [texts]);

  const topbarMessage =
    texts?.topbarMessage ?? "FCO giao nhanh trong 15 phút · Freeship đơn từ 199k";
  const topbarActions = texts?.topbarActions ?? [];
  const locationPrefix = texts?.locationPrefix ?? "📍 Giao đến:";
  const locationHighlight = texts?.locationHighlight ?? "TP. Hồ Chí Minh";
  const loginLabel = texts?.loginLabel ?? "👤 Đăng nhập";
  const logoutLabel = texts?.logoutLabel ?? "Đăng xuất";
  const cartLabel = texts?.cartLabel ?? "Giỏ hàng";
  const cartAriaLabel = texts?.cartAriaLabel ?? "Giỏ hàng";
  const menuToggleLabel = texts?.menuToggleLabel ?? "Mở menu điều hướng";
  const languageAriaLabel = texts?.language?.ariaLabel ?? "Chọn ngôn ngữ";
  const welcomeTemplate = texts?.welcomeMessage ?? "Xin chào, {name}";
  const welcomeMessage = welcomeTemplate.replace("{name}", user?.name ?? "");

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
        <span>{topbarMessage}</span>
        <div className="topbar-actions">
          {topbarActions.map((action) => (
            <a key={action.href} href={action.href}>
              {action.label}
            </a>
          ))}
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
            <p>{brandTagline}</p>
          </div>
        </div>

        <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`/#${link.id}`}
              onClick={(event) => handleSectionClick(event, link.id)}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="nav-actions">
          <div className="language-switch" aria-label={languageAriaLabel}>
            {languageOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                className={`language-option ${
                  language === option.id ? "active" : ""
                }`}
                onClick={() => {
                  if (language !== option.id) {
                    onLanguageChange(option.id);
                  }
                }}
                aria-pressed={language === option.id}
              >
                <img src={option.icon} alt={option.label} />
              </button>
            ))}
          </div>
          <button className="location-btn" type="button">
            {locationPrefix} <strong>{locationHighlight}</strong>
          </button>
          {user ? (
            <div className="user-info">
              <span className="user-info__greeting">{welcomeMessage}</span>
              <button
                className="logout-btn"
                type="button"
                onClick={onLogout}
              >
                {logoutLabel}
              </button>
            </div>
          ) : (
            <button className="login-btn" type="button" onClick={onLoginClick}>
              {loginLabel}
            </button>
          )}
          <button
            className="cart-btn"
            type="button"
            aria-label={cartAriaLabel}
            onClick={onCartOpen}
          >
            🛒<span className="cart-label">{cartLabel}</span>
            <span className="cart-count">{cartCount}</span>
          </button>
          <button
            className="menu-toggle"
            type="button"
            aria-expanded={menuOpen}
            aria-label={menuToggleLabel}
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
