import { useEffect, useMemo, useRef, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Cart from "./components/Cart";
import HomePage from "./pages/HomePage";
import CategoryPage from "./pages/CategoryPage";
import { categories as categoryData, menuItems } from "./data/menuData";

const heroBackground =
  "https://images.unsplash.com/photo-1550317138-10000687a72b?auto=format&fit=crop&w=1600&q=80";

function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const pendingSectionRef = useRef(null);

  const bestSellers = useMemo(
    () => menuItems.filter((item) => item.isBestSeller),
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

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleNavigateHome = () => {
    pendingSectionRef.current = null;
    navigate("/");
  };

  const handleNavigateSection = (sectionId) => {
    if (location.pathname !== "/") {
      pendingSectionRef.current = sectionId;
      navigate("/");
    } else {
      scrollToSection(sectionId);
    }
  };

  useEffect(() => {
    if (location.pathname === "/" && pendingSectionRef.current) {
      const sectionId = pendingSectionRef.current;
      pendingSectionRef.current = null;
      requestAnimationFrame(() => scrollToSection(sectionId));
    }
  }, [location.pathname]);

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

    setIsCartOpen(true);
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((c) => c.id !== id));
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    window.alert("Đi đến trang thanh toán!");
    setIsCartOpen(false);
  };

  return (
    <div className="app">
      <Header
        cartCount={cartCount}
        onCartOpen={() => setIsCartOpen(true)}
        onNavigateHome={handleNavigateHome}
        onNavigateSection={handleNavigateSection}
      />
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              heroBackground={heroBackground}
              stats={stats}
              categories={categoryData}
              bestSellers={bestSellers}
              combos={combos}
              promotions={promotions}
              addToCart={addToCart}
            />
          }
        />
        <Route
          path="/category/:slug"
          element={
            <CategoryPage
              categories={categoryData}
              menuItems={menuItems}
              addToCart={addToCart}
              onNavigateSection={handleNavigateSection}
            />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
      {isCartOpen && (
        <Cart
          cart={cart}
          removeFromCart={removeFromCart}
          onClose={() => setIsCartOpen(false)}
          onCheckout={handleCheckout}
        />
      )}
    </div>
  );
}

export default App;
