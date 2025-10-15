import Menu from "../components/Menu";

function HomePage({
  heroBackground,
  stats,
  categories,
  bestSellers,
  combos,
  promotions,
  addToCart,
  onSelectCategory = () => {},
}) {
  return (
    <main>
      <section className="hero" style={{ backgroundImage: `url(${heroBackground})` }}>
        <div className="hero-overlay" />
        <div className="hero-content">
          <h2>FoodFast Delivery chuẩn vị FCO</h2>
          <p>
            Đặt món nóng hổi từ FCO và nhận ngay trong 15 phút. Các đầu bếp của
            chúng tôi luôn sẵn sàng phục vụ burger bò Mỹ, pizza phô mai, taco
            Mexico và đồ uống mixology chuẩn vị.
          </p>
          <div className="hero-actions">
            <a href="#best-seller" className="btn-primary">
              Đặt món bán chạy
            </a>
            <a href="#combo" className="btn-secondary">
              Xem combo ưu đãi
            </a>
          </div>
          <div className="hero-extra">
            <span>⚡ Miễn phí giao nhanh nội thành</span>
            <span>💳 Thanh toán online & COD</span>
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
          <h2>Khám phá danh mục nổi bật</h2>
          <p>
            Nguyên liệu tuyển chọn mỗi sáng, chế biến tại bếp trung tâm và giao
            đến bạn trong thời gian nhanh nhất.
          </p>
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
                Xem món
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="best-seller" id="best-seller">
        <div className="section-heading">
          <h2>Món bán chạy tại FCO</h2>
          <p>Chọn món yêu thích và thêm vào giỏ trong một chạm.</p>
        </div>
        <Menu items={bestSellers} addToCart={addToCart} />
      </section>

      <section className="combo" id="combo">
        <div className="section-heading">
          <h2>Combo chia sẻ siêu tiết kiệm</h2>
          <p>Thiết kế riêng cho từng bữa ăn của bạn: gia đình, hẹn hò hay văn phòng.</p>
        </div>
        <div className="combo-grid">
          {combos.map((combo) => (
            <article key={combo.name} className="combo-card">
              <div className="combo-badge">{combo.badge}</div>
              <h3>{combo.name}</h3>
              <p>{combo.desc}</p>
              <div className="combo-footer">
                <span>{combo.price}k</span>
                <button type="button">Đặt combo</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="promotion" id="promo">
        <div className="section-heading">
          <h2>Ưu đãi & chương trình thành viên</h2>
          <p>Tham gia FCO Rewards để không bỏ lỡ bất kỳ deal nào.</p>
        </div>
        <div className="promotion-grid">
          {promotions.map((promo) => (
            <article key={promo.title} className="promotion-card">
              <h3>{promo.title}</h3>
              <p>{promo.content}</p>
              <a href="#">Tìm hiểu thêm →</a>
            </article>
          ))}
        </div>
      </section>

      <section className="about" id="about">
        <div className="about-content">
          <h2>FCO - FoodFast Delivery chuẩn chuyên nghiệp</h2>
          <p>
            Thành lập từ 2015, FCO mang tới trải nghiệm ẩm thực nhanh chóng nhưng
            vẫn giữ nguyên sự chỉn chu của một nhà hàng chuyên nghiệp. Hệ thống
            bếp trung tâm và đội ngũ giao nhận nội bộ giúp chúng tôi kiểm soát
            chất lượng từng đơn hàng.
          </p>
          <ul>
            <li>🌟 Chứng nhận vệ sinh an toàn thực phẩm quốc tế HACCP</li>
            <li>🥗 90% nguyên liệu nhập khẩu, truy xuất nguồn gốc rõ ràng</li>
            <li>🛵 Đội ngũ giao nhận chuyên nghiệp, đồng phục nhận diện FCO</li>
          </ul>
        </div>
        <div className="about-visual">
          <img
            src="https://images.unsplash.com/photo-1555992336-cbf3a2862171?auto=format&fit=crop&w=900&q=80"
            alt="FCO Kitchen"
            loading="lazy"
          />
          <div className="about-badge">
            <strong>98%</strong>
            <span>Khách hàng quay lại lần 2</span>
          </div>
        </div>
      </section>
    </main>
  );
}

export default HomePage;
