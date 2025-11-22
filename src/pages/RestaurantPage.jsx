import Menu from "../components/Menu";
import "./RestaurantPage.css";

function RestaurantPage({
  restaurant,
  items = [],
  addToCart,
  onNavigateHome = () => {},
  onBackToRestaurants = () => {},
  onViewProduct = () => {},
  texts = {},
  menuLabels = {},
}) {
  if (!restaurant) {
    return null;
  }

  const breadcrumbHome = texts.breadcrumbHome ?? "Trang chủ";
  const backLabel = texts.backLabel ?? "← Về chuỗi nhà hàng";
  const menuHeadingTemplate =
    texts.menuHeading ?? "Thực đơn tại {restaurantName}";
  const menuDescriptionTemplate =
    texts.menuDescription ??
    "Khám phá các món đặc trưng do bếp {restaurantName} chuẩn bị.";
  const storyHeading = texts.storyHeading ?? "Câu chuyện";
  const emptyMessage =
    texts.emptyMessage ??
    "Nhà hàng đang cập nhật món ăn. Vui lòng quay lại sau.";

  const menuHeading = menuHeadingTemplate.replace(
    "{restaurantName}",
    restaurant.name
  );
  const menuDescription = menuDescriptionTemplate.replace(
    "{restaurantName}",
    restaurant.name
  );

  return (
    <main className="restaurant-page">
      <section
        className="restaurant-hero"
        style={{
          backgroundImage: `linear-gradient(160deg, rgba(0,0,0,0.55), rgba(0,0,0,0.75)), url(${restaurant.img})`,
        }}
      >
        <div className="restaurant-hero__breadcrumb">
          <button type="button" onClick={onNavigateHome}>
            {breadcrumbHome}
          </button>
          <span>/</span>
          <span>{restaurant.badge}</span>
        </div>
        <div className="restaurant-hero__content">
          <div className="restaurant-hero__badge">{restaurant.badge}</div>
          <h1>{restaurant.name}</h1>
          <p className="restaurant-hero__meta">
            {restaurant.city} • {restaurant.deliveryTime}
          </p>
          <p className="restaurant-hero__description">{restaurant.description}</p>
          {restaurant.tags?.length > 0 && (
            <div className="restaurant-hero__tags">
              {restaurant.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          )}
          <div className="restaurant-hero__actions">
            <button type="button" onClick={onBackToRestaurants}>
              {backLabel}
            </button>
          </div>
        </div>
      </section>

      <section className="restaurant-story">
        <div className="section-heading">
          <h2>{storyHeading}</h2>
          <p>{restaurant.story}</p>
        </div>
      </section>

      <section className="restaurant-menu">
        <div className="section-heading">
          <h2>{menuHeading}</h2>
          <p>{menuDescription}</p>
        </div>

        {items.length > 0 ? (
          <Menu
            items={items}
            addToCart={addToCart}
            labels={menuLabels}
            onViewItem={onViewProduct}
          />
        ) : (
          <div className="restaurant-menu__empty">
            <p>{emptyMessage}</p>
            <button type="button" onClick={onBackToRestaurants}>
              {backLabel}
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

export default RestaurantPage;
