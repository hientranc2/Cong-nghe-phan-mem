function Footer({ texts = {} }) {
  const navItems = texts.navItems ?? [
    { id: "home", label: "Trang chủ", icon: "🏠", href: "#/" },
    { id: "best", label: "Bán chạy", icon: "🔥", href: "#best-seller" },
    { id: "checkout", label: "Đặt hàng", icon: "🛒", href: "#/checkout" },
    { id: "orders", label: "Đơn hàng", icon: "📦", href: "#/orders" },
    { id: "account", label: "Tài khoản", icon: "👤", href: "#/login" },
  ];

  const currentHash =
    typeof window !== "undefined" && window.location.hash
      ? window.location.hash
      : "#/";

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const isActive = currentHash === item.href;
        const itemClass = `bottom-nav__item${isActive ? " bottom-nav__item--active" : ""}`;

        return (
          <a key={item.id ?? item.href} href={item.href} className={itemClass}>
            <span className="bottom-nav__icon" aria-hidden="true">
              {item.icon ?? "•"}
            </span>
            <span className="bottom-nav__label">{item.label}</span>
          </a>
        );
      })}
    </nav>
  );
}

export default Footer;
