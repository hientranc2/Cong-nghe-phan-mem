import Menu from "../components/Menu";

function HomePage({
  heroBackground,
  stats = [],
  categories = [],
  restaurantDishes = [],
  addToCart,
  onSelectCategory = () => {},
  onViewProduct = () => {},
  restaurants = [],
  searchQuery = "",
  searchRestaurants = [],
  searchDishes = [],
  onViewRestaurant = () => {},
  texts = {},
  menuLabels = {},
}) {
  const heroHighlights = texts.heroHighlights ?? [
    "⚡ Miễn phí giao nhanh nội thành",
    "💳 Thanh toán online & COD",
  ];
  const heroPrimaryCta = texts.heroPrimaryCta ?? "Đặt món bán chạy";
  const heroSecondaryCta = texts.heroSecondaryCta ?? "Xem combo ưu đãi";
  const categoryHeading = texts.categoryHeading ?? "Kham pha danh muc noi bat";
  const categoryDescription =
    texts.categoryDescription ??
    "Nguyen lieu tuyen chon moi sang, che bien tai bep trung tam va giao den ban trong thoi gian nhanh nhat.";
  const categoryCta = texts.categoryCta ?? "Xem mon";
  const restaurantHeading = texts.restaurantHeading ?? "Chuoi nha hang FCO";
  const restaurantDescription =
    texts.restaurantDescription ??
    "Tim nha hang yeu thich va cac mon an duoc chon loc tu cac bep FCO.";
  const restaurantCta = texts.restaurantCta ?? "Xem menu";
  const dishCollectionHeading =
    texts.dishCollectionHeading ??
    texts.bestSellerHeading ??
    "Tat ca mon an tu cac nha hang FCO";
  const dishCollectionDescription =
    texts.dishCollectionDescription ??
    texts.bestSellerDescription ??
    "Danh sach day du cac mon an hien co tai he thong nha hang FCO.";

  const trimmedSearchQuery = searchQuery.trim();
  const hasSearchQuery = trimmedSearchQuery.length > 0;
  const hasSearchResults =
    searchRestaurants.length > 0 || searchDishes.length > 0;
  const searchHeading =
    texts.searchHeading ??
    (trimmedSearchQuery
      ? `Ket qua tim kiem cho "${trimmedSearchQuery}"`
      : "Ket qua tim kiem");
  const searchDescription =
    texts.searchDescription ??
    "Tim nha hang va mon an yeu thich tren toan bo menu FCO.";
  const searchEmptyText =
    texts.searchEmpty ?? "Khong co ket qua phu hop. Hay thu tu khoa khac.";

  const renderRestaurantCard = (restaurant) => (
    <article key={restaurant.id} className="restaurant-card">
      <div className="restaurant-card__media">
        <img src={restaurant.cover} alt={restaurant.name} loading="lazy" />
        {restaurant.badge && (
          <span className="restaurant-card__badge">{restaurant.badge}</span>
        )}
        <div className="restaurant-card__overlay">
          <div className="restaurant-card__heading">
            <h3>{restaurant.name}</h3>
            <span>{restaurant.city}</span>
          </div>
          <button
            type="button"
            className="restaurant-card__cta"
            onClick={() =>
              onViewRestaurant(restaurant.slug ?? restaurant.id ?? "")
            }
          >
            {restaurantCta}
          </button>
        </div>
      </div>
    </article>
  );

  return (
    <main>
      <section className="hero" style={{ backgroundImage: `url(${heroBackground})` }}>
        <div className="hero-overlay" />
        <div className="hero-content">
          <h2>{texts.heroTitle ?? "FoodFast Delivery chuẩn vị FCO"}</h2>
          <p>{texts.heroDescription ?? "Đặt món nóng hổi từ FCO và nhận ngay trong 15 phút. Các đầu bếp của chúng tôi luôn sẵn sàng phục vụ burger bò Mỹ, pizza phô mai, taco Mexico và đồ uống mixology chuẩn vị."}</p>
          <div className="hero-actions">
            <a href="#menu" className="btn-primary">
              {heroPrimaryCta}
            </a>
            <a href="#combo" className="btn-secondary">
              {heroSecondaryCta}
            </a>
          </div>
          <div className="hero-extra">
            {heroHighlights.map((highlight) => (
              <span key={highlight}>{highlight}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="stats">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card">
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </section>

      {hasSearchQuery && (
        <section className="search-results" id="search-results">
          <div className="section-heading">
            <h2>{searchHeading}</h2>
            <p>{searchDescription}</p>
          </div>
          {searchRestaurants.length > 0 && (
            <div className="restaurant-grid">
              {searchRestaurants.map((restaurant) => renderRestaurantCard(restaurant))}
            </div>
          )}
          {searchDishes.length > 0 && (
            <Menu
              items={searchDishes}
              addToCart={addToCart}
              labels={menuLabels}
              onViewItem={onViewProduct}
            />
          )}
          {!hasSearchResults && (
            <p className="search-results__empty">{searchEmptyText}</p>
          )}
        </section>
      )}

      <section className="category" id="menu">
        <div className="section-heading">
          <h2>{categoryHeading}</h2>
          <p>{categoryDescription}</p>
        </div>
        <div className="category-grid">
          {categories.map((category) => (
            <article key={category.id} className="category-card">
              <span className="category-icon">{category.icon}</span>
              <h3>{category.title}</h3>
              <p>{category.description}</p>
              <a
                href={`#/category/${category.slug}`}
                onClick={(event) => {
                  event.preventDefault();
                  onSelectCategory(category.slug);
                }}
              >
                {categoryCta}
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="restaurant" id="restaurants">
        <div className="section-heading">
          <h2>{restaurantHeading}</h2>
          <p>{restaurantDescription}</p>
        </div>
        <div className="restaurant-grid">
          {restaurants.map((restaurant) => renderRestaurantCard(restaurant))}
        </div>
      </section>

      {restaurantDishes.length > 0 && (
        <section className="dish-collection" id="best-sellers">
          <div className="section-heading">
            <h2>{dishCollectionHeading}</h2>
            <p>{dishCollectionDescription}</p>
          </div>
          <Menu
            items={restaurantDishes}
            addToCart={addToCart}
            labels={menuLabels}
            onViewItem={onViewProduct}
          />
        </section>
      )}

    </main>
  );
}

export default HomePage;





