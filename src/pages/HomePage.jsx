import { useMemo, useState } from "react";
import Menu from "../components/Menu";

function HomePage({
  heroBackground,
  stats = [],
  categories = [],
  bestSellers = [],
  restaurants = [],
  combos = [],
  promotions = [],
  menuItems = [],
  addToCart,
  onSelectCategory = () => {},
  onViewProduct = () => {},
  texts = {},
  menuLabels = {},
}) {
  const heroHighlights = texts.heroHighlights ?? [
    "⚡ Miễn phí giao nhanh nội thành",
    "💳 Thanh toán online & COD",
  ];
  const heroPrimaryCta = texts.heroPrimaryCta ?? "Đặt món bán chạy";
  const heroSecondaryCta = texts.heroSecondaryCta ?? "Xem combo ưu đãi";
  const categoryHeading = texts.categoryHeading ?? "Khám phá danh mục nổi bật";
  const categoryDescription =
    texts.categoryDescription ??
    "Nguyên liệu tuyển chọn mỗi sáng, chế biến tại bếp trung tâm và giao đến bạn trong thời gian nhanh nhất.";
  const categoryCta = texts.categoryCta ?? "Xem món";
  const bestSellerHeading = texts.bestSellerHeading ?? "Món bán chạy tại FCO";
  const bestSellerDescription =
    texts.bestSellerDescription ?? "Chọn món yêu thích và thêm vào giỏ trong một chạm.";
  const restaurantHeading = texts.restaurantHeading ?? "Chuỗi nhà hàng FCO";
  const restaurantDescription =
    texts.restaurantDescription ??
    "Tìm nhà hàng yêu thích và các món đặc trưng được các bếp FCO phát triển riêng.";
  const comboHeading = texts.comboHeading ?? "Combo chia sẻ siêu tiết kiệm";
  const comboDescription =
    texts.comboDescription ??
    "Thiết kế riêng cho từng bữa ăn của bạn: gia đình, hẹn hò hay văn phòng.";
  const comboButton = texts.comboButton ?? "Đặt combo";
  const promotionHeading = texts.promotionHeading ?? "Ưu đãi & chương trình thành viên";
  const promotionDescription =
    texts.promotionDescription ?? "Tham gia FCO Rewards để không bỏ lỡ bất kỳ deal nào.";
  const promotionCta = texts.promotionCta ?? "Tìm hiểu thêm →";
  const aboutHeading =
    texts.aboutHeading ?? "FCO - FoodFast Delivery chuẩn chuyên nghiệp";
  const aboutDescription =
    texts.aboutDescription ??
    "Thành lập từ 2015, FCO mang tới trải nghiệm ẩm thực nhanh chóng nhưng vẫn giữ nguyên sự chỉn chu của một nhà hàng chuyên nghiệp. Hệ thống bếp trung tâm và đội ngũ giao nhận nội bộ giúp chúng tôi kiểm soát chất lượng từng đơn hàng.";
  const aboutList = texts.aboutList ?? [
    "🌟 Chứng nhận vệ sinh an toàn thực phẩm quốc tế HACCP",
    "🥗 90% nguyên liệu nhập khẩu, truy xuất nguồn gốc rõ ràng",
    "🛵 Đội ngũ giao nhận chuyên nghiệp, đồng phục nhận diện FCO",
  ];
  const aboutBadgeValue = texts.aboutBadgeValue ?? "98%";
  const aboutBadgeLabel =
    texts.aboutBadgeLabel ?? "Khách hàng quay lại lần 2";

  return (
    <main>
      <section className="hero" style={{ backgroundImage: `url(${heroBackground})` }}>
        <div className="hero-overlay" />
        <div className="hero-content">
          <h2>{texts.heroTitle ?? "FoodFast Delivery chuẩn vị FCO"}</h2>
          <p>{texts.heroDescription ?? "Đặt món nóng hổi từ FCO và nhận ngay trong 15 phút. Các đầu bếp của chúng tôi luôn sẵn sàng phục vụ burger bò Mỹ, pizza phô mai, taco Mexico và đồ uống mixology chuẩn vị."}</p>
          <div className="hero-actions">
            <a href="#best-seller" className="btn-primary">
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

      <section className="restaurants" id="restaurants">
        <div className="section-heading">
          <h2>{restaurantHeading}</h2>
          <p>{restaurantDescription}</p>
        </div>
        <div className="restaurant-grid">
          {restaurants.map((restaurant) => (
            <a
              key={restaurant.id}
              className="restaurant-card"
              href={`#/restaurant/${restaurant.slug}`}
              style={{
                backgroundImage: `linear-gradient(160deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.7)), url(${restaurant.img})`,
              }}
              role="button"
              tabIndex={0}
              onClick={() => handleSelectRestaurant(restaurant.id)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  handleSelectRestaurant(restaurant.id);
                }
              }}
            >
              <h3>{restaurant.name}</h3>
              <p className="restaurant-meta">{restaurant.city}</p>
              <p className="restaurant-description">{restaurant.description}</p>
              {restaurant.tags?.length > 0 && (
                <div className="restaurant-tags">
                  {restaurant.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              )}
              <div className="restaurant-card__cta">
                {texts.restaurantCta ?? "Xem các món"}
              </div>
            </a>
          ))}
        </div>

        {activeRestaurant && (
          <div className="restaurant-menu-preview">
            <div className="section-heading">
              <h3>
                {restaurantMenuHeading} · {activeRestaurant.name}
              </h3>
              <p>{restaurantMenuDescription}</p>
            </div>
            <Menu
              items={activeRestaurantMenuItems}
              addToCart={addToCart}
              labels={menuLabels}
              onViewItem={onViewProduct}
            />
          </div>
        )}
      </section>

          <section className="best-seller" id="best-seller">
        <div className="section-heading">
          <h2>{bestSellerHeading}</h2>
          <p>{bestSellerDescription}</p>
        </div>
        <Menu
          items={bestSellers}
          addToCart={addToCart}
          labels={menuLabels}
          onViewItem={onViewProduct}
        />
      </section>
      
      <section className="combo" id="combo">
        <div className="section-heading">
          <h2>{comboHeading}</h2>
          <p>{comboDescription}</p>
        </div>
        <div className="combo-grid">
          {combos.map((combo) => (
            <article key={combo.name} className="combo-card">
              <div className="combo-badge">{combo.badge}</div>
              <h3>{combo.name}</h3>
              <p>{combo.desc}</p>
              <div className="combo-footer">
                <span>{combo.price}k</span>
                <button type="button" onClick={() => addToCart(combo)}>
                  {comboButton}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="promotion" id="promo">
        <div className="section-heading">
          <h2>{promotionHeading}</h2>
          <p>{promotionDescription}</p>
        </div>
        <div className="promotion-grid">
          {promotions.map((promo) => (
            <article key={promo.title} className="promotion-card">
              <h3>{promo.title}</h3>
              <p>{promo.content}</p>
              <a href="#">{promotionCta}</a>
            </article>
          ))}
        </div>
      </section>

      <section className="about" id="about">
        <div className="about-content">
          <h2>{aboutHeading}</h2>
          <p>{aboutDescription}</p>
          <ul>
           {aboutList.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="about-visual">
          <img
            src="https://images.unsplash.com/photo-1555992336-cbf3a2862171?auto=format&fit=crop&w=900&q=80"
            alt="FCO Kitchen"
            loading="lazy"
          />
          <div className="about-badge">
             <strong>{aboutBadgeValue}</strong>
            <span>{aboutBadgeLabel}</span>
          </div>
        </div>
      </section>
    </main>
  );
}

export default HomePage;
