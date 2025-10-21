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
  onShowLogin = () => {},
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
  const locationSearchPlaceholder =
    texts?.locationSearchPlaceholder ?? "Tìm kiếm ...";
  const loginLabel = texts?.loginLabel ?? "👤 Đăng nhập";
  const logoutLabel = texts?.logoutLabel ?? "Đăng xuất";
  const roleLabels = texts?.roleLabels ?? {
    customer: "Khách hàng",
    admin: "Quản trị viên",
    restaurant: "Nhà hàng đối tác",
  };
  const userName = user?.name ?? texts?.anonymousLabel ?? "Người dùng";
  const cartLabel = texts?.cartLabel ?? "Giỏ hàng";
  const cartAriaLabel = texts?.cartAriaLabel ?? "Giỏ hàng";
  const menuToggleLabel = texts?.menuToggleLabel ?? "Mở menu điều hướng";
  const languageAriaLabel = texts?.language?.ariaLabel ?? "Chọn ngôn ngữ";

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
         <label className="location-search" htmlFor="header-location-search">
            <span className="search-icon" aria-hidden="true">
              🔍
            </span>
            <input
              id="header-location-search"
              type="search"
              placeholder={locationSearchPlaceholder}
              aria-label={locationSearchPlaceholder}
            />
          </label>
          <div className="auth-controls">
            {user ? (
              <div className="user-menu" aria-live="polite">
                <div className="user-menu__info">
                  <span className="user-menu__name">👋 {userName}</span>
                  <span className="user-menu__role">
                    {roleLabels[user.role] ?? user.role}
                  </span>
                </div>
                <button
                  type="button"
                  className="logout-btn"
                  onClick={onLogout}
                >
                  {logoutLabel}
                </button>
              </div>
            ) : (
              <button
                className="login-btn"
                type="button"
                onClick={onShowLogin}
              >
                {loginLabel}
              </button>
            )}
          </div>
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
