import Menu from "../components/Menu";

function HomePage({
  heroBackground,
  stats = [],
  categories = [],
  bestSellers = [],
  combos = [],
  promotions = [],
  addToCart,
  onSelectCategory = () => {},
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

  const comboHeading = texts.comboHeading ?? "Combo chia sẻ siêu tiết kiệm";
  const comboDescription =
    texts.comboDescription ??
    "Thiết kế riêng cho từng bữa ăn của bạn: gia đình, hẹn hò hay văn phòng.";
  const comboButton = texts.comboButton ?? "Đặt combo";

  const processHeading = texts.processHeading ?? "3 bước giao món chuẩn chuyên nghiệp";
  const processDescription =
    texts.processDescription ??
    "Từ khâu đặt món đến bàn giao đơn hàng, mọi bước đều được kiểm soát bằng công nghệ của FCO.";
  const processSteps = texts.processSteps ?? [
    {
      title: "Chọn món trong 1 chạm",
      description: "Duyệt menu trực quan, thêm combo hoặc món lẻ theo khẩu vị.",
      icon: "🛒",
    },
    {
      title: "Bếp trung tâm xử lý",
      description: "Đầu bếp bắt đầu chế biến và đóng gói an toàn chỉ sau 2 phút.",
      icon: "👨‍🍳",
    },
    {
      title: "Tài xế FCO giao nhanh",
      description: "Theo dõi hành trình trực tiếp, nhận món nóng hổi trong 15 phút.",
      icon: "🛵",
    },
  ];

  const promotionHeading = texts.promotionHeading ?? "Ưu đãi & chương trình thành viên";
  const promotionDescription =
    texts.promotionDescription ?? "Tham gia FCO Rewards để không bỏ lỡ bất kỳ deal nào.";
  const promotionCta = texts.promotionCta ?? "Tìm hiểu thêm →";

  const testimonialHeading = texts.testimonialHeading ?? "Khách hàng nói gì về FCO";
  const testimonialDescription =
    texts.testimonialDescription ??
    "Trải nghiệm được bảo chứng bởi hàng nghìn đánh giá 5 sao mỗi ngày.";
  const testimonials = texts.testimonials ?? [];

  const appHeading = texts.appHeading ?? "Đặt món mọi lúc với ứng dụng FCO";
  const appDescription =
    texts.appDescription ??
    "Theo dõi trạng thái đơn hàng theo thời gian thực, nhận ưu đãi độc quyền và tích điểm đổi quà.";
  const appPrimaryCta = texts.appPrimaryCta ?? "Tải ứng dụng FCO";
  const appSecondaryCta = texts.appSecondaryCta ?? "Đăng ký nhận ưu đãi";
  const appHighlights = texts.appHighlights ?? [
    "Thông báo realtime khi bếp bắt đầu chế biến",
    "Theo dõi vị trí tài xế và thời gian dự kiến",
    "Thanh toán đa kênh với ví điện tử, thẻ và COD",
  ];
  const appBadgeValue = texts.appBadgeValue ?? "4.8★";
  const appBadgeLabel = texts.appBadgeLabel ?? "Hơn 12.000 lượt đánh giá";
  const appScreenshot =
    texts.appScreenshot ??
    "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=750&q=80";

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
  const aboutBadgeLabel = texts.aboutBadgeLabel ?? "Khách hàng quay lại lần 2";

  return (
    <main>
      <section
        className="hero"
        style={{ backgroundImage: `url(${heroBackground})` }}
      >
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

      <section className="best-seller" id="best-seller">
        <div className="section-heading">
          <h2>{bestSellerHeading}</h2>
          <p>{bestSellerDescription}</p>
        </div>
        <Menu items={bestSellers} addToCart={addToCart} labels={menuLabels} />
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
                <button type="button">{comboButton}</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="process" id="process">
        <div className="section-heading">
          <h2>{processHeading}</h2>
          <p>{processDescription}</p>
        </div>
        <div className="process-grid">
          {processSteps.map((step, index) => (
            <article key={step.title} className="process-card">
              <div className="process-icon" aria-hidden="true">
                {step.icon ?? "⬤"}
              </div>
              <span className="process-index">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
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

      {testimonials.length > 0 && (
        <section className="testimonial" id="testimonial">
          <div className="section-heading">
            <h2>{testimonialHeading}</h2>
            <p>{testimonialDescription}</p>
          </div>
          <div className="testimonial-grid">
            {testimonials.map((item) => (
              <figure key={item.name} className="testimonial-card">
                <blockquote>“{item.quote}”</blockquote>
                <figcaption>
                  <strong>{item.name}</strong>
                  {item.role ? <span>{item.role}</span> : null}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      <section className="app-download" id="app">
        <div className="app-download-content">
          <div className="section-heading">
            <h2>{appHeading}</h2>
            <p>{appDescription}</p>
          </div>
          <div className="app-download-actions">
            <a href="#" className="btn-primary">
              {appPrimaryCta}
            </a>
            <a href="#" className="btn-secondary">
              {appSecondaryCta}
            </a>
          </div>
          <ul className="app-download-list">
            {appHighlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        </div>
        <div className="app-download-visual">
          <img src={appScreenshot} alt="FCO App" loading="lazy" />
          <div className="app-download-badge">
            <strong>{appBadgeValue}</strong>
            <span>{appBadgeLabel}</span>
          </div>
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
