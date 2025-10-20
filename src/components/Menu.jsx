function Menu({ items = [], addToCart, labels = {} }) {
  const caloriesUnit = labels.caloriesUnit ?? "kcal";
  const prepTimeSuffix = labels.prepTimeSuffix ?? "phút chế biến";
  const addToCartLabel = labels.addToCart ?? "Thêm vào giỏ hàng";

  return (
    <div className="menu-grid">
      {items.map((item) => (
        <article key={item.id} className="menu-card">
          <div className="menu-card__media">
            <img src={item.img} alt={item.name} loading="lazy" />
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
                onClick={() => addToCart(item)}
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
