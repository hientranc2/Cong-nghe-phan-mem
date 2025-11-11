function Menu({
  items = [],
  addToCart,
  labels = {},
  onAddItem,
  onViewItem = () => {},
}) {
  const caloriesUnit = labels.caloriesUnit ?? "kcal";
  const prepTimeSuffix = labels.prepTimeSuffix ?? "phút chế biến";
  const addToCartLabel = labels.addToCart ?? "Thêm vào giỏ hàng";
  const viewDetailLabel = labels.viewDetail ?? "Xem chi tiết món";
  
  return (
    <div className="menu-grid">
      {items.map((item) => (
        <article key={item.id} className="menu-card">
          <div className="menu-card__media">
            <button
              type="button"
              className="menu-card__media-button"
              onClick={() => onViewItem(item)}
              aria-label={`${viewDetailLabel}: ${item.name}`}
            >
              <img src={item.img} alt={item.name} loading="lazy" />
            </button>
            {item.tag && <span className="menu-card__tag">{item.tag}</span>}
          </div>
          <div className="menu-card__body">
            <div className="menu-card__heading">
              <h3>{item.name}</h3>
              <span className="menu-card__price">{item.price}k</span>
            </div>
            <p className="menu-card__desc">{item.description}</p>
            <div className="menu-card__footer">
              <span className="menu-card__info">
                🔥 {item.calories} {caloriesUnit} · ⏱ {item.time} {prepTimeSuffix}
              </span>
              <button
                type="button"
                className="menu-card__button"
                onClick={() => {
                  if (typeof onAddItem === "function") {
                    onAddItem(item);
                    return;
                  }

                  addToCart(item);
                }}
              >
                {addToCartLabel}
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

export default Menu;
