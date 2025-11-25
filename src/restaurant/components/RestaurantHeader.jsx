function RestaurantHeader({
  activeTab,
  headerTexts,
  navigationTexts,
  restaurantTexts,
  ordersTexts,
  onAddRestaurant,
  onAddOrder,
  onBackHome,
}) {
  return (
    <header className="restaurant-header">
      <div className="restaurant-header__info">
        <span className="restaurant-header__eyebrow">{headerTexts.eyebrow}</span>
        <h1>{headerTexts.title}</h1>
        <p>{headerTexts.subtitle}</p>
      </div>
      <div className="restaurant-header__actions">
        {activeTab === "restaurants" && (
          <button
            type="button"
            className="restaurant-btn"
            onClick={onAddRestaurant}
          >
            + {restaurantTexts.addButton}
          </button>
        )}
        {activeTab === "orders" && (
          <button type="button" className="restaurant-btn" onClick={onAddOrder}>
            + {ordersTexts.addButton}
          </button>
        )}
        <button
          type="button"
          className="restaurant-btn restaurant-btn--ghost"
          onClick={onBackHome}
        >
          {navigationTexts.backHome}
        </button>
      </div>
    </header>
  );
}

export default RestaurantHeader;
