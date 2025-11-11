import Menu from "../components/Menu";

function HomePage({
  heroBackground,
  stats = [],
  bestSellers = [],
  addToCart,
  onViewProduct = () => {},
  texts = {},
  menuLabels = {},
}) {
  const heroHighlights = texts.heroHighlights ?? [
    "⚡ Miễn phí giao nhanh nội thành",
    "💳 Thanh toán online & COD",
  ];
  const heroPrimaryCta = texts.heroPrimaryCta ?? "Đặt món bán chạy";
  const heroSecondaryCta = texts.heroSecondaryCta ?? "Xem ưu đãi";
  const bestSellerHeading = texts.bestSellerHeading ?? "Món bán chạy tại FCO";
  const bestSellerDescription =
    texts.bestSellerDescription ?? "Chọn món yêu thích và thêm vào giỏ trong một chạm.";

  return (
    <main>
      <section className="hero" style={{ backgroundImage: `url(${heroBackground})` }}>
        <div className="hero-overlay" />
        <div className="hero-content">
          <h2>{texts.heroTitle ?? "FoodFast Delivery chuẩn vị FCO"}</h2>
          <p>
            {texts.heroDescription ??
              "Đặt món nóng hổi từ FCO và nhận ngay trong 15 phút. Các đầu bếp của chúng tôi luôn sẵn sàng phục vụ burger bò Mỹ, pizza phô mai, taco Mexico và đồ uống mixology chuẩn vị."}
          </p>
          <div className="hero-actions">
            <a href="#best-seller" className="btn-primary">
              {heroPrimaryCta}
            </a>
            <a href="#best-seller" className="btn-secondary">
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
    </main>
  );
}

export default HomePage;
