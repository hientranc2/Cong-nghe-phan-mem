function RestaurantSidebar({ activeTab, navigationTexts, onChangeTab, onBackHome }) {
  const handleChange = (tab) => {
    if (onChangeTab) {
      onChangeTab(tab);
    }
  };

  return (
    <aside className="restaurant-sidebar">
      <div className="restaurant-sidebar__brand">
        <span className="brand-dot" aria-hidden="true" />
        <div>
          <strong>FoodFast</strong>
          <small>Partner</small>
        </div>
      </div>
      <nav className="restaurant-nav" aria-label="Điều hướng nhà hàng">
        <button
          type="button"
          className={
            activeTab === "overview"
              ? "restaurant-nav__item is-active"
              : "restaurant-nav__item"
          }
          onClick={() => handleChange("overview")}
        >
          <span aria-hidden="true">📊</span>
          {navigationTexts.overview}
        </button>
        <button
          type="button"
          className={
            activeTab === "restaurants"
              ? "restaurant-nav__item is-active"
              : "restaurant-nav__item"
          }
          onClick={() => handleChange("restaurants")}
        >
          <span aria-hidden="true">🏪</span>
          {navigationTexts.restaurants}
        </button>
        <button
          type="button"
          className={
            activeTab === "orders"
              ? "restaurant-nav__item is-active"
              : "restaurant-nav__item"
          }
          onClick={() => handleChange("orders")}
        >
          <span aria-hidden="true">🧾</span>
          {navigationTexts.orders}
        </button>
      </nav>
      <button
        type="button"
        className="restaurant-nav__secondary"
        onClick={onBackHome}
      >
        ← {navigationTexts.backHome}
      </button>
    </aside>
  );
}

export default RestaurantSidebar;
