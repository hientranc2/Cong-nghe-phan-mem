import { useMemo, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Menu from "./components/Menu";
import Cart from "./components/Cart";

const heroBackground =
  "https://images.unsplash.com/photo-1550317138-10000687a72b?auto=format&fit=crop&w=1600&q=80";

function App() {
  const [cart, setCart] = useState([]);

  const bestSellers = useMemo(
    () => [
      {
        id: "fco-burger-blaze",
        name: "Burger Blaze Bò Mỹ",
        description: "Bánh burger bò Mỹ nướng than, sốt phô mai cheddar và bacon giòn.",
        price: 69,
        img: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80",
        calories: 520,
        time: 12,
        tag: "Best Seller",
      },
      {
        id: "fco-pizza-lava",
        name: "Pizza Phô Mai Lava",
        description: "Đế mỏng kiểu Ý, phủ phô mai mozzarella lava và pepperoni cay.",
        price: 119,
        img: "https://images.unsplash.com/photo-1548365328-9f5473428b37?auto=format&fit=crop&w=800&q=80",
        calories: 730,
        time: 15,
        tag: "FCO Signature",
      },
      {
        id: "fco-chicken-crispy",
        name: "Gà Rán Cay Đậm",
        description: "Gà rán sốt cay Nashville, phục vụ cùng salad bắp cải và khoai tây nghiền.",
        price: 82,
        img: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80",
        calories: 610,
        time: 10,
        tag: "Hot",
      },
      {
        id: "fco-taco-fiesta",
        name: "Taco Fiesta Mexico",
        description: "Taco bò kéo sợi, salsa xoài và sốt kem chua đặc biệt của FCO.",
        price: 65,
        img: "https://images.unsplash.com/photo-1612874478396-5d81e27e4d11?auto=format&fit=crop&w=800&q=80",
        calories: 450,
        time: 9,
        tag: "Món mới",
      },
    ],
    []
  );

  const categories = useMemo(
    () => [
      {
        id: "cat-burger",
        icon: "🍔",
        title: "Burger Artisan",
        description: "Bánh burger nướng than cùng nguyên liệu nhập khẩu tươi mới.",
      },
      {
        id: "cat-pizza",
        icon: "🍕",
        title: "Pizza 18 inch",
        description: "Đế mỏng kiểu Ý, phô mai nhập khẩu và sốt signature FCO.",
      },
      {
        id: "cat-fried",
        icon: "🍗",
        title: "Gà rán & Snack",
        description: "Các món chiên giòn tan, sốt pha chuẩn vị chuyên gia.",
      },
      {
        id: "cat-drink",
        icon: "🥤",
        title: "Đồ uống mixology",
        description: "Trà trái cây, soda signature và cà phê cold brew làm mới mỗi ngày.",
      },
    ],
    []
  );

  const combos = useMemo(
    () => [
      {
        name: "Combo Gia đình FCO",
        desc: "01 Pizza Lava + 02 Burger Blaze + Khoai tây lốc xoáy + 4 nước ép",
        price: 399,
        badge: "Tiết kiệm 26%",
      },
      {
        name: "Combo Couple Night",
        desc: "02 Taco Fiesta + 02 Gà rán cay + 2 Trà đào cam sả",
        price: 249,
        badge: "Tặng kèm dessert",
      },
      {
        name: "Combo Văn phòng",
        desc: "03 Burger Blaze + 03 Khoai xoắn parmesan + 6 lon soda",
        price: 319,
        badge: "Free ship giờ trưa",
      },
    ],
    []
  );

  const promotions = useMemo(
    () => [
      {
        title: "Thứ 3 Giảm 30%",
        content: "Áp dụng cho tất cả burger và pizza size M khi đặt qua app FCO.",
      },
      {
        title: "FCO Rewards",
        content: "Tích điểm đổi voucher 200k và nhận ưu đãi sinh nhật độc quyền.",
      },
      {
        title: "Happy Hour 14h-17h",
        content: "Mua 1 tặng 1 đồ uống mixology, áp dụng tất cả chi nhánh.",
      },
    ],
    []
  );

  const stats = [
    { label: "Đơn hàng mỗi ngày", value: "2.5K+" },
    { label: "Thời gian giao trung bình", value: "12 phút" },
    { label: "Đánh giá 5 sao", value: "18.4K" },
    { label: "Chi nhánh toàn quốc", value: "32" },
  ];

  // Thêm sản phẩm vào giỏ
  const addToCart = (item) => {
    const exists = cart.find((c) => c.id === item.id);
    if (exists) {
      setCart(
        cart.map((c) =>
          c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
        )
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  // Xóa sản phẩm
  const removeFromCart = (id) => {
    setCart(cart.filter((c) => c.id !== id));
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="app">
      <Header cartCount={cartCount} />
      <main>
        <section className="hero" style={{ backgroundImage: `url(${heroBackground})` }}>
          <div className="hero-overlay" />
          <div className="hero-content">
            <h2>FoodFast Delivery chuẩn vị FCO</h2>
            <p>
              Đặt món nóng hổi từ FCO và nhận ngay trong 15 phút. Các đầu bếp
              của chúng tôi luôn sẵn sàng phục vụ burger bò Mỹ, pizza phô mai,
              taco Mexico và đồ uống mixology chuẩn vị.
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
                <a href="#best-seller">Xem món</a>
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
              src="https://images.unsplash.com/photo-1528198020673-6cbb3a68bd33?auto=format&fit=crop&w=900&q=80"
              alt="FCO Kitchen"
              loading="lazy"
            />
            <div className="about-badge">
              <strong>98%</strong>
              <span>Khách hàng quay lại lần 2</span>
            </div>
          </div>
        </section>

        <section className="cart-section" id="cart">
          <div className="section-heading">
            <h2>Giỏ hàng FCO của bạn</h2>
            <p>Kiểm tra lại món và hoàn tất đơn ngay.</p>
          </div>
          <Cart cart={cart} removeFromCart={removeFromCart} />
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default App;
