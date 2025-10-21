import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Cart from "./components/Cart";
import HomePage from "./pages/HomePage";
import CategoryPage from "./pages/CategoryPage";
import CheckoutPage from "./pages/CheckoutPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import AdminDashboard from "./pages/AdminDashboard";
import RestaurantDashboard from "./pages/RestaurantDashboard";
import { categories as categoryData, menuItems } from "./data/menuData";
import { contentByLanguage } from "./i18n/translations";


const heroBackground =
  "https://images.unsplash.com/photo-1550317138-10000687a72b?auto=format&fit=crop&w=1600&q=80";

const USERS_STORAGE_KEY = "fcoUsers";
const CURRENT_USER_STORAGE_KEY = "fcoCurrentUser";
const DEFAULT_USERS = [
  {
    id: "admin",
    name: "Quản trị viên FCO",
    email: "admin@fco.vn",
    password: "admin123",
    role: "admin",
  },
  {
    id: "restaurant",
    name: "Nhà hàng FCO",
    email: "restaurant@fco.vn",
    password: "fco123",
    role: "restaurant",
  },
];

const normalizeEmail = (email = "") => email.trim().toLowerCase();

const mergeUsersByEmail = (users = []) => {
  const byEmail = new Map();

  users.forEach((user) => {
    const key = normalizeEmail(user.email);
    if (!key) {
      return;
    }

    const existing = byEmail.get(key) ?? {};
    byEmail.set(key, { ...existing, ...user });
  });

  return Array.from(byEmail.values());
};

const parseViewFromHash = () => {
  if (typeof window === "undefined") {
    return { type: "home" };
  }

  const hash = window.location.hash.replace(/^#/, "");

  if (/^\/login$/.test(hash)) {
    return { type: "login" };
  }

  if (/^\/register$/.test(hash)) {
    return { type: "register" };
  }

  if (/^\/order-confirmation$/.test(hash)) {
    return { type: "orderConfirmation" };
  }

  if (/^\/admin$/.test(hash)) {
    return { type: "admin" };
  }

  if (/^\/restaurant$/.test(hash)) {
    return { type: "restaurant" };
  }

  if (/^\/checkout$/.test(hash)) {
    return { type: "checkout" };
  }

  const match = hash.match(/^\/category\/([\w-]+)/);

  if (match && match[1]) {
    return { type: "category", slug: match[1] };
  }

  const productMatch = hash.match(/^\/product\/([\w-]+)/);

  if (productMatch && productMatch[1]) {
    return { type: "product", id: productMatch[1] };
  }

  return { type: "home" };
};

const translateCategories = (categories, language) =>
  categories.map((category) => {
    const translation =
      category.translations?.[language] ?? category.translations?.vi ?? {};

    return {
      ...category,
      title: translation.title ?? category.title ?? "",
      description: translation.description ?? category.description ?? "",
      heroTitle:
        translation.heroTitle ??
        translation.title ??
        category.heroTitle ??
        category.title ??
        "",
      heroDescription:
        translation.heroDescription ??
        translation.description ??
        category.heroDescription ??
        category.description ??
        "",
    };
  });

const translateMenuItems = (items, language) =>
  items.map((item) => {
    const translation =
      item.translations?.[language] ?? item.translations?.vi ?? {};
    return {
      ...item,
      name: translation.name ?? item.name ?? "",
      description: translation.description ?? item.description ?? "",
      tag: translation.tag ?? item.tag ?? null,
    };
  });

function App() {
  const [language, setLanguage] = useState("vi");
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const pendingSectionRef = useRef(null);
  const [view, setView] = useState(() => parseViewFromHash());
  const parseHash = useCallback(() => parseViewFromHash(), []);
  const [users, setUsers] = useState(DEFAULT_USERS);
  const [currentUser, setCurrentUser] = useState(null);
  const [authRedirect, setAuthRedirect] = useState(null);
  const [authMessage, setAuthMessage] = useState("");
  const [pendingOrder, setPendingOrder] = useState(null);
  const [recentReceipt, setRecentReceipt] = useState(null);



  useEffect(() => {
    const handleHashChange = () => {
      setView(parseHash());
    };

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [parseHash]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const storedUsers = JSON.parse(
        window.localStorage.getItem(USERS_STORAGE_KEY) ?? "[]"
      );
      const merged = mergeUsersByEmail([
        ...DEFAULT_USERS,
        ...(Array.isArray(storedUsers) ? storedUsers : []),
      ]);
      setUsers(merged);
    } catch (error) {
      setUsers(DEFAULT_USERS);
    }

    try {
      const storedCurrent = JSON.parse(
        window.localStorage.getItem(CURRENT_USER_STORAGE_KEY) ?? "null"
      );
      if (storedCurrent?.email) {
        setCurrentUser(storedCurrent);
      }
    } catch (error) {
      setCurrentUser(null);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (error) {
      /* ignore persistence errors */
    }
  }, [users]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (currentUser?.email) {
      window.localStorage.setItem(
        CURRENT_USER_STORAGE_KEY,
        JSON.stringify(currentUser)
      );
    } else {
      window.localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
    }
  }, [currentUser]);

  const content = useMemo(
    () => contentByLanguage[language] ?? contentByLanguage.vi,
    [language]
  );

  const translatedCategories = useMemo(
    () => translateCategories(categoryData, language),
    [language]
  );

  const translatedMenuItems = useMemo(
    () => translateMenuItems(menuItems, language),
    [language]
  );

  useEffect(() => {
    setCart((prevCart) =>
      prevCart.map((cartItem) => {
        const latest = translatedMenuItems.find((item) => item.id === cartItem.id);
        if (!latest) {
          return cartItem;
        }

        return {
          ...cartItem,
          name: latest.name,
          description: latest.description,
          tag: latest.tag,
        };
      })
    );
  }, [translatedMenuItems]);

  const bestSellers = useMemo(
    () => translatedMenuItems.filter((item) => item.isBestSeller),
    [translatedMenuItems]
  );

  const combos = content.combos ?? [];
  const promotions = content.promotions ?? [];
  const stats = content.stats ?? [];
  const loginTexts = content.login ?? content.auth?.login ?? {};
  const registerTexts = content.register ?? content.auth?.register ?? {};
  const orderConfirmationTexts =
    content.orderConfirmation ?? content.auth?.orderConfirmation ?? {};
  const adminTexts = content.admin ?? {};
  const restaurantTexts = content.restaurant ?? {};

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const redirectToHome = useCallback(() => {
    if (typeof window !== "undefined") {
      window.location.hash = "/";
    }
  }, []);

  const redirectAfterAuth = useCallback(
    (user, nextDestination = authRedirect) => {
      if (!user) {
        redirectToHome();
        return;
      }

      if (user.role === "admin") {
        if (typeof window !== "undefined") {
          window.location.hash = "/admin";
        }
        return;
      }

      if (user.role === "restaurant") {
        if (typeof window !== "undefined") {
          window.location.hash = "/restaurant";
        }
        return;
      }

      if (nextDestination === "checkout" && cart.length > 0) {
        if (typeof window !== "undefined") {
          window.location.hash = "/checkout";
        }
        return;
      }

      redirectToHome();
    },
    [authRedirect, cart.length, redirectToHome]
  );

  const handleNavigateHome = () => {
    pendingSectionRef.current = null;
    if (view.type !== "home") {
      redirectToHome();
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNavigateSection = (sectionId) => {
    if (view.type !== "home") {
      pendingSectionRef.current = sectionId;
      redirectToHome();
    } else {
      scrollToSection(sectionId);
    }
  };

  useEffect(() => {
    if (view.type === "home" && pendingSectionRef.current) {
      const sectionId = pendingSectionRef.current;
      pendingSectionRef.current = null;
      requestAnimationFrame(() => scrollToSection(sectionId));
    }
  }, [view]);

  const handleSelectCategory = (slug) => {
    pendingSectionRef.current = null;
    if (typeof window !== "undefined") {
      window.location.hash = `/category/${slug}`;
    }
  };

  

  const addToCart = (item) => {
    setCart((prevCart) => {
      const exists = prevCart.find((c) => c.id === item.id);
      if (exists) {
        return prevCart.map((c) =>
          c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }

      return [...prevCart, { ...item, quantity: 1 }];
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((c) => c.id !== id));
  };

  const updateCartQuantity = (id, quantity) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    pendingSectionRef.current = null;
    setIsCartOpen(false);
    if (!currentUser || currentUser.role !== "customer") {
      setAuthRedirect("checkout");
      setAuthMessage(
        currentUser?.role === "customer"
          ? ""
          : currentUser
          ? "Tài khoản hiện tại không thể thanh toán ở giao diện khách hàng."
          : "Vui lòng đăng nhập để tiếp tục thanh toán."
      );
      if (typeof window !== "undefined") {
        window.location.hash = "/login";
      }
      return;
    }

    if (typeof window !== "undefined") {
      window.location.hash = "/checkout";
    }
  };

  const activeCategory = useMemo(() => {
    if (view.type !== "category") {
      return null;
    }

    return (
      translatedCategories.find((category) => category.slug === view.slug) ??
      null
    );
  }, [view, translatedCategories]);

  useEffect(() => {
    if (view.type === "category" && !activeCategory) {
      redirectToHome();
    }
  }, [view, activeCategory, redirectToHome]);

  const categoryItems = useMemo(() => {
    if (!activeCategory) {
      return [];
    }

    return translatedMenuItems.filter(
      (item) => item.categoryId === activeCategory.id
    );
  }, [activeCategory, translatedMenuItems]);

  const activeProduct = useMemo(() => {
    if (view.type !== "product") {
      return null;
    }

    return (
      translatedMenuItems.find((item) => item.id === view.id) ?? null
    );
  }, [view, translatedMenuItems]);

  const activeProductCategory = useMemo(() => {
    if (!activeProduct) {
      return null;
    }

    return (
      translatedCategories.find(
        (category) => category.id === activeProduct.categoryId
      ) ?? null
    );
  }, [activeProduct, translatedCategories]);

  useEffect(() => {
    if (
      view.type === "category" ||
      view.type === "checkout" ||
      view.type === "product" ||
      view.type === "login" ||
      view.type === "register" ||
      view.type === "orderConfirmation" ||
      view.type === "admin" ||
      view.type === "restaurant"
    ) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [view]);

  useEffect(() => {
    if (view.type === "product" && !activeProduct) {
      redirectToHome();
    }
  }, [view, activeProduct, redirectToHome]);

  useEffect(() => {
    if (view.type === "checkout") {
      if (!currentUser || currentUser.role !== "customer") {
        setAuthRedirect("checkout");
        setAuthMessage(
          !currentUser
            ? "Vui lòng đăng nhập để tiếp tục thanh toán."
            : "Tài khoản hiện tại không thể thanh toán ở giao diện khách hàng."
        );
        if (typeof window !== "undefined") {
          window.location.hash = "/login";
        }
      }
    }
  }, [view, currentUser]);

  useEffect(() => {
    if (
      view.type === "admin" &&
      currentUser &&
      currentUser.role !== "admin"
    ) {
      redirectToHome();
    }
  }, [view, currentUser, redirectToHome]);

  useEffect(() => {
    if (
      view.type === "restaurant" &&
      currentUser &&
      currentUser.role !== "restaurant"
    ) {
      redirectToHome();
    }
  }, [view, currentUser, redirectToHome]);

  useEffect(() => {
    if (
      view.type === "orderConfirmation" &&
      !pendingOrder &&
      !recentReceipt
    ) {
      redirectToHome();
    }
  }, [view, pendingOrder, recentReceipt, redirectToHome]);

  useEffect(() => {
    if (view.type !== "login") {
      setAuthMessage("");
    }
  }, [view]);
  const handleViewProduct = (item) => {
    if (!item?.id) {
      return;
    }

    pendingSectionRef.current = null;
    if (typeof window !== "undefined") {
      window.location.hash = `/product/${item.id}`;
    }
  };

  const presetAccounts = useMemo(
    () =>
      DEFAULT_USERS.map((user) => ({
        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role,
      })),
    []
  );

  const handleLogin = ({ email = "", password = "" }) => {
    const normalizedEmail = normalizeEmail(email);
    if (!normalizedEmail || !password) {
      return {
        success: false,
        message: "Vui lòng nhập email và mật khẩu.",
      };
    }

    const matchedUser = users.find(
      (candidate) =>
        normalizeEmail(candidate.email) === normalizedEmail &&
        candidate.password === password
    );

    if (!matchedUser) {
      return {
        success: false,
        message: "Email hoặc mật khẩu không chính xác.",
      };
    }

    const { password: _password, ...safeUser } = matchedUser;
    setCurrentUser(safeUser);
    setIsCartOpen(false);
    redirectAfterAuth(safeUser, authRedirect);
    setAuthRedirect(null);
    setAuthMessage("");
    return { success: true, user: safeUser };
  };

  const handleRegister = ({
    name = "",
    email = "",
    password = "",
    role = "customer",
  }) => {
    const trimmedName = name.trim();
    const normalizedEmail = normalizeEmail(email);
    const allowedRoles = ["customer", "admin", "restaurant"];
    const normalizedRole = allowedRoles.includes(role) ? role : "customer";

    if (!trimmedName || !normalizedEmail || !password) {
      return {
        success: false,
        message: "Vui lòng điền đầy đủ thông tin đăng ký.",
      };
    }

    const exists = users.some(
      (candidate) => normalizeEmail(candidate.email) === normalizedEmail
    );

    if (exists) {
      return {
        success: false,
        message: "Email đã được đăng ký. Vui lòng sử dụng email khác.",
      };
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name: trimmedName,
      email: normalizedEmail,
      password,
      role: normalizedRole,
    };

    setUsers((prevUsers) => mergeUsersByEmail([...prevUsers, newUser]));
    const { password: _password, ...safeUser } = newUser;
    setCurrentUser(safeUser);
    setIsCartOpen(false);
    redirectAfterAuth(safeUser, authRedirect);
    setAuthRedirect(null);
    setAuthMessage("");

    return {
      success: true,
      user: safeUser,
    };
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setAuthRedirect(null);
    setAuthMessage("");
    setPendingOrder(null);
    setRecentReceipt(null);
    setCart([]);
    setIsCartOpen(false);
    redirectToHome();
  };

  const handleShowLogin = () => {
    pendingSectionRef.current = null;
    setIsCartOpen(false);
    setAuthRedirect(null);
    setAuthMessage("");
    if (typeof window !== "undefined") {
      window.location.hash = "/login";
    }
  };

  const handleShowRegister = () => {
    pendingSectionRef.current = null;
    setIsCartOpen(false);
    setAuthRedirect(null);
    setAuthMessage("");
    if (typeof window !== "undefined") {
      window.location.hash = "/register";
    }
  };

  const handlePlaceOrder = (orderDetails) => {
    if (!orderDetails?.items || orderDetails.items.length === 0) {
      return;
    }

    const itemsCopy = orderDetails.items.map((item) => ({ ...item }));
    setPendingOrder({
      ...orderDetails,
      items: itemsCopy,
      createdAt: new Date().toISOString(),
    });
    setRecentReceipt(null);
    if (typeof window !== "undefined") {
      window.location.hash = "/order-confirmation";
    }
  };

  const handleConfirmOrderDetails = (customerInfo) => {
    if (!pendingOrder) {
      return {
        success: false,
        message: "Không tìm thấy đơn hàng để xác nhận.",
      };
    }

    const name = customerInfo?.name?.trim() ?? "";
    const phone = customerInfo?.phone?.trim() ?? "";
    const email = customerInfo?.email?.trim() ?? "";
    const address = customerInfo?.address?.trim() ?? "";
    const paymentMethod = customerInfo?.paymentMethod ?? "cash";

    if (!name || !phone || !email || !address) {
      return {
        success: false,
        message:
          "Vui lòng điền đầy đủ họ tên, số điện thoại, email và địa chỉ giao hàng.",
      };
    }

    const receipt = {
      ...pendingOrder,
      customer: {
        name,
        phone,
        email,
        address,
        paymentMethod,
      },
      id: `ORD-${Date.now()}`,
      confirmedAt: new Date().toISOString(),
    };

    setRecentReceipt(receipt);
    setPendingOrder(null);
    setCart([]);

    return {
      success: true,
      receipt,
    };
  };

  const handleOrderConfirmationClose = () => {
    setPendingOrder(null);
    setRecentReceipt(null);
    redirectToHome();
  };

  const handleBackToCheckout = () => {
    if (typeof window !== "undefined") {
      window.location.hash = "/checkout";
    }
  };

  let pageContent;

  if (view.type === "checkout") {
    pageContent = (
      <CheckoutPage
        cart={cart}
        texts={content.checkout}
        removeFromCart={removeFromCart}
        onUpdateQuantity={updateCartQuantity}
        onContinueShopping={handleNavigateHome}
        onPlaceOrder={handlePlaceOrder}
      />
    );
  } else if (view.type === "product" && activeProduct) {
    pageContent = (
      <ProductDetailPage
        item={activeProduct}
        category={activeProductCategory}
        addToCart={addToCart}
        onNavigateHome={handleNavigateHome}
        onNavigateCategory={handleSelectCategory}
        texts={content.productDetail}
        menuLabels={content.menuLabels}
      />
    );
  } else if (view.type === "category" && activeCategory) {
    pageContent = (
      <CategoryPage
        category={activeCategory}
        items={categoryItems}
        addToCart={addToCart}
        onNavigateHome={handleNavigateHome}
        onNavigateMenu={() => handleNavigateSection("menu")}
        texts={content.categoryPage}
        menuLabels={content.menuLabels}
        onViewProduct={handleViewProduct}
      />
    );
  } else if (view.type === "login") {
    pageContent = (
      <LoginPage
        onLogin={handleLogin}
        onNavigateRegister={handleShowRegister}
        texts={loginTexts}
        presetAccounts={presetAccounts}
        message={authMessage}
      />
    );
  } else if (view.type === "register") {
    pageContent = (
      <RegisterPage
        onRegister={handleRegister}
        onNavigateLogin={handleShowLogin}
        texts={registerTexts}
      />
    );
  } else if (view.type === "orderConfirmation") {
    pageContent = (
      <OrderConfirmationPage
        pendingOrder={pendingOrder}
        receipt={recentReceipt}
        user={currentUser}
        texts={orderConfirmationTexts}
        onConfirm={handleConfirmOrderDetails}
        onBackHome={handleOrderConfirmationClose}
        onBackToCheckout={handleBackToCheckout}
      />
    );
  } else if (view.type === "admin") {
    pageContent = (
      <AdminDashboard
        user={currentUser}
        texts={adminTexts}
        onBackHome={handleNavigateHome}
      />
    );
  } else if (view.type === "restaurant") {
    pageContent = (
      <RestaurantDashboard
        user={currentUser}
        texts={restaurantTexts}
        onBackHome={handleNavigateHome}
      />
    );
  } else {
    pageContent = (
      <HomePage
        heroBackground={heroBackground}
        stats={stats}
        categories={translatedCategories}
        bestSellers={bestSellers}
        combos={combos}
        promotions={promotions}
        addToCart={addToCart}
        onSelectCategory={handleSelectCategory}
        onViewProduct={handleViewProduct}
        texts={content.home}
        menuLabels={content.menuLabels}
      />
    );
  }

  return (
    <div className="app">
      <Header
        cartCount={cartCount}
        onCartOpen={() => setIsCartOpen(true)}
        onNavigateHome={handleNavigateHome}
        onNavigateSection={handleNavigateSection}
        texts={content.header}
        brandTagline={
          content.header?.brandTagline ??
          content.footer?.description ??
          ""
        }
        language={language}
        onLanguageChange={setLanguage}
        user={currentUser}
        onShowLogin={handleShowLogin}
        onShowRegister={handleShowRegister}
        onLogout={handleLogout}
      />
      {pageContent}
      <Footer texts={content.footer} />
      {isCartOpen && (
        <Cart
          cart={cart}
          removeFromCart={removeFromCart}
          onClose={() => setIsCartOpen(false)}
          onCheckout={handleCheckout}
          texts={content.cart}
        />
      )}
    </div>
  );
}

export default App;
