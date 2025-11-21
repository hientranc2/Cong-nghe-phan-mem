import Menu from "../components/Menu";

function RestaurantDetailPage({
  restaurant = null,
  detailTexts = {},
  menuLabels = {},
  addToCart = () => {},
  onViewProduct = () => {},
  onBack = () => {},
}) {
  if (!restaurant) {
    return (
      <main className="restaurant-detail">
        <button
          type="button"
          className="restaurant-detail__back"
          onClick={onBack}
        >
          {detailTexts.backLabel ?? "Quay lại"}
        </button>
        <section className="restaurant-detail__empty">
          <h2>{detailTexts.missingTitle ?? "Nhà hàng không tồn tại"}</h2>
          <p>
            {detailTexts.missingDescription ??
              "Chúng tôi sẽ sớm cập nhật lại. Vui lòng quay về trang chủ."}
          </p>
          <button
            type="button"
            className="restaurant-detail__cta"
            onClick={onBack}
          >
            {detailTexts.backHomeLabel ?? "Về trang chủ"}
          </button>
        </section>
      </main>
    );
  }

  const tags = restaurant.tags ?? [];
  const menuItems = restaurant.menuItems ?? [];
  const story = restaurant.story ?? restaurant.description ?? "";
  const badge = restaurant.badge ?? null;

  return (
    <main className="restaurant-detail">
      <button
        type="button"
        className="restaurant-detail__back"
        onClick={onBack}
      >
        {detailTexts.backLabel ?? "Quay lại"}
      </button>

      <section className="restaurant-detail__hero">
        <div className="restaurant-detail__media">
          <img src={restaurant.cover} alt={restaurant.name} />
          {badge && (
            <span className="restaurant-detail__badge">{badge}</span>
          )}
        </div>
        <div className="restaurant-detail__info">
          <p className="restaurant-detail__eyebrow">
            {restaurant.city} ·{" "}
            {detailTexts.deliveryLabel ?? "Thời gian giao"}:{" "}
            {restaurant.deliveryTime}
          </p>
          <h1>{restaurant.name}</h1>
          <p>{story}</p>
          <div className="restaurant-detail__tags">
            {tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="restaurant-detail__menu">
        <div className="section-heading">
          <h2>{detailTexts.menuHeading ?? "Menu của nhà hàng"}</h2>
          <p>
            {detailTexts.menuDescription ??
              "Chọn món yêu thích và thêm vào giỏ của bạn."}
          </p>
        </div>
        {menuItems.length > 0 ? (
          <Menu
            items={menuItems}
            addToCart={addToCart}
            labels={menuLabels}
            onViewItem={onViewProduct}
          />
        ) : (
          <p className="restaurant-detail__empty">
            {detailTexts.emptyMessage ??
              "Nhà hàng đang cập nhật món ăn. Vui lòng quay lại sau."}
          </p>
        )}
      </section>
    </main>
  );
}

export default RestaurantDetailPage;
