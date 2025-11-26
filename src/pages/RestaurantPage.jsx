import Menu from "../components/Menu";

function RestaurantPage({
  restaurant,
  menuItems = [],
  addToCart,
  onNavigateHome = () => {},
  onNavigateRestaurants = () => {},
  texts = {},
  menuLabels = {},
  onViewProduct = () => {},
}) {
  if (!restaurant) {
    return null;
  }

  const breadcrumbHome = texts.breadcrumbHome ?? "Trang chủ";
  const breadcrumbRestaurants = texts.breadcrumbRestaurants ?? "Chuỗi nhà hàng";
  const backToList = texts.backToList ?? "← Trở về danh sách nhà hàng";
  const storyHeading = texts.storyHeading ?? "Câu chuyện bếp";
  const storyDescription =
    texts.storyDescription ??
    "Khám phá nguồn cảm hứng, nguyên liệu và quy trình chế biến được đội ngũ FCO phát triển riêng.";
  const menuHeadingTemplate = texts.menuHeading ?? "Thực đơn tại {name}";
  const menuDescriptionTemplate =
    texts.menuDescription ??
    "Các món đặc trưng được chọn lọc từ bếp {name}. Thêm vào giỏ chỉ với một chạm.";
  const emptyMessage = texts.emptyMessage ?? "Nhà hàng đang cập nhật món ăn. Vui lòng quay lại sau.";
  const menuHeading = menuHeadingTemplate.replace("{name}", restaurant.name);
  const menuDescription = menuDescriptionTemplate.replace("{name}", restaurant.name);

  return (
    <main className="restaurant-page">
      <section
        className="restaurant-hero"
        style={{
          backgroundImage: `linear-gradient(160deg, rgba(0,0,0,0.55), rgba(0,0,0,0.7)), url(${restaurant.img})`,
        }}
      >
        <div className="restaurant-hero__content">
          <div className="restaurant-breadcrumb">
            <button type="button" onClick={onNavigateHome}>
              {breadcrumbHome}
            </button>
            <span>/</span>
            <button type="button" onClick={onNavigateRestaurants}>
              {breadcrumbRestaurants}
            </button>
            <span>/</span>
            <span>{restaurant.name}</span>
          </div>

          <div className="restaurant-hero__heading">
            <span className="restaurant-badge">{restaurant.badge}</span>
            <h2>{restaurant.name}</h2>
            <p>{restaurant.description}</p>

            <div className="restaurant-hero__meta">
              <span>{restaurant.deliveryTime}</span>
              <span>{restaurant.city}</span>
              {restaurant.tags?.length > 0 && (
                <div className="restaurant-tags">
                  {restaurant.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              )}
            </div>

            <div className="restaurant-hero__actions">
              <button type="button" onClick={onNavigateRestaurants}>
                {backToList}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="restaurant-story">
        <div className="section-heading">
          <h3>{storyHeading}</h3>
          <p>{storyDescription}</p>
        </div>
        <div className="restaurant-story__card">
          <p>{restaurant.story || restaurant.description}</p>
        </div>
      </section>

      <section className="restaurant-menu">
        <div className="section-heading">
          <h3>{menuHeading}</h3>
          <p>{menuDescription}</p>
        </div>

        {menuItems.length > 0 ? (
          <Menu
            items={menuItems}
            addToCart={addToCart}
            labels={menuLabels}
            onViewItem={onViewProduct}
          />
        ) : (
          <div className="restaurant-menu__empty">
            <p>{emptyMessage}</p>
            <button type="button" onClick={onNavigateRestaurants}>
              {backToList}
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

export default RestaurantPage;
