import Menu from "../components/Menu";

function RestaurantPage({
  restaurant,
  items = [],
  addToCart,
  onNavigateHome,
  onViewProduct,
  texts = {},
  menuLabels = {},
}) {
  if (!restaurant) {
    return (
      <main className="restaurant-page">
        <div className="section-heading">
          <p>{texts.notFound ?? "Không tìm thấy nhà hàng."}</p>
          <button type="button" className="btn-secondary" onClick={onNavigateHome}>
            {texts.backHome ?? "Quay lại trang chủ"}
          </button>
        </div>
      </main>
    );
  }

  const pageTitle = texts.heading ?? "Nhà hàng FCO";
  const storyTitle = texts.storyTitle ?? "Câu chuyện bếp";
  const menuTitle = texts.menuTitle ?? "Menu đa dạng";
  const backLabel = texts.backHome ?? "Quay lại trang chủ";

  return (
    <main className="restaurant-page">
      <section
        className="restaurant-hero"
        style={{
          backgroundImage: `linear-gradient(160deg, rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.75)), url(${restaurant.img})`,
        }}
      >
        <div className="restaurant-hero__content">
          <button type="button" className="back-link" onClick={onNavigateHome}>
            ← {backLabel}
          </button>
          <p className="restaurant-kicker">{pageTitle}</p>
          <h1>{restaurant.name}</h1>
          <p className="restaurant-meta">{restaurant.city}</p>
          <p className="restaurant-description">{restaurant.description}</p>
          {restaurant.tags?.length > 0 && (
            <div className="restaurant-tags">
              {restaurant.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="restaurant-story">
        <div className="section-heading">
          <h2>{storyTitle}</h2>
          <p>{restaurant.story}</p>
        </div>
      </section>

      <section className="restaurant-menu" id="menu">
        <div className="section-heading">
          <h2>{menuTitle}</h2>
          <p>{texts.menuDescription ?? "Chọn món yêu thích và thêm ngay vào giỏ."}</p>
        </div>
        <Menu
          items={items}
          addToCart={addToCart}
          labels={menuLabels}
          onViewItem={onViewProduct}
        />
      </section>
    </main>
  );
}

export default RestaurantPage;
