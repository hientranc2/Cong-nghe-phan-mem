import { useMemo, useState } from "react";
import vnFlag from "../assets/flags/vietnam.svg";
import ukFlag from "../assets/flags/united-kingdom.svg";
import "./Header.css";

function Header({
  cartCount = 0,
  onCartOpen = () => {},
  onNavigateHome = () => {},
  onNavigateSection = () => {},
  language = "vi",
  onLanguageChange = () => {},
  texts,
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const languageOptions = useMemo(
    () => [
      {
        id: "vi",
        label: texts?.language?.options?.vi?.label ?? "Tiếng Việt",
        icon: vnFlag,
      },
      {
        id: "en",
        label: texts?.language?.options?.en?.label ?? "English",
        icon: ukFlag,
      },
    ],
    [texts]
  );

  const brandTagline =
    language === "vi"
      ? "Ăn ngon chuẩn vị - giao tận nơi siêu tốc"
      : "Food crafted fresh · Delivered fast";

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
        <span>{texts?.topbarMessage}</span>
        <div className="topbar-actions">
          {(texts?.topbarActions ?? []).map((action) => (
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
          {(texts?.navLinks ?? []).map((link) => (
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
          <div className="language-switch" aria-label={texts?.language?.ariaLabel}>
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
            {texts?.locationPrefix} <strong>{texts?.locationHighlight}</strong>
          </button>
          <button className="login-btn" type="button">
            {texts?.loginLabel}
          </button>
          <button
            className="cart-btn"
            type="button"
            aria-label={texts?.cartAriaLabel}
            onClick={onCartOpen}
          >
            🛒<span className="cart-label">{texts?.cartLabel}</span>
            <span className="cart-count">{cartCount}</span>
          </button>
          <button
            className="menu-toggle"
            type="button"
            aria-expanded={menuOpen}
            aria-label={texts?.menuToggleLabel}
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
