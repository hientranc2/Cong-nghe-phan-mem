import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Cart from "./components/Cart";
import AuthModal from "./components/AuthModal";
import HomePage from "./pages/HomePage";
import CategoryPage from "./pages/CategoryPage";
import CheckoutPage from "./pages/CheckoutPage";
import { categories as categoryData, menuItems } from "./data/menuData";
import { contentByLanguage } from "./i18n/translations";


const heroBackground =
  "https://images.unsplash.com/photo-1550317138-10000687a72b?auto=format&fit=crop&w=1600&q=80";

const STORAGE_KEYS = {
  users: "fcoUsers",
  currentUser: "fcoCurrentUser",
};

const readStorage = (key, fallback) => {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const rawValue = window.localStorage.getItem(key);
    return rawValue ? JSON.parse(rawValue) : fallback;
  } catch (error) {
    return fallback;
  }
};

const normalizeEmail = (value = "") => value.trim().toLowerCase();

const parseViewFromHash = () => {
  if (typeof window === "undefined") {
    return { type: "home" };
  }

  const hash = window.location.hash.replace(/^#/, "");

  if (/^\/checkout$/.test(hash)) {
    return { type: "checkout" };
  }

  const match = hash.match(/^\/category\/([\w-]+)/);

  if (match && match[1]) {
    return { type: "category", slug: match[1] };
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
  const [registeredUsers, setRegisteredUsers] = useState(() =>
    readStorage(STORAGE_KEYS.users, [])
  );
  const [user, setUser] = useState(() =>
    readStorage(STORAGE_KEYS.currentUser, null)
  );
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [pendingItem, setPendingItem] = useState(null);
  const pendingSectionRef = useRef(null);
  const [view, setView] = useState(() => parseViewFromHash());
  const parseHash = useCallback(() => parseViewFromHash(), []);



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

    window.localStorage.setItem(
      STORAGE_KEYS.users,
      JSON.stringify(registeredUsers)
    );
  }, [registeredUsers]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (user) {
      window.localStorage.setItem(
        STORAGE_KEYS.currentUser,
        JSON.stringify({ name: user.name, email: user.email })
      );
    } else {
      window.localStorage.removeItem(STORAGE_KEYS.currentUser);
    }
  }, [user]);

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
  const authTexts = content.auth ?? {};
  const authErrors = authTexts.errors ?? {};
  const missingFieldsError =
    authErrors.missingFields ?? "Vui lòng nhập đầy đủ thông tin.";
  const invalidCredentialsError =
    authErrors.invalidCredentials ?? "Email hoặc mật khẩu không đúng.";
  const emailTakenError =
    authErrors.emailTaken ?? "Email đã được đăng ký.";

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


  const openAuthModal = (mode = "login", item = null) => {
    setPendingItem(item);
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleRequireAuth = (item = null) => {
    openAuthModal("login", item);
  };

  const handleLoginClick = () => {
    openAuthModal("login");
  };

  const handleAuthClose = () => {
    setIsAuthModalOpen(false);
    setPendingItem(null);
  };

  const handleLogout = () => {
    setUser(null);
    setPendingItem(null);
    setIsAuthModalOpen(false);
    setAuthMode("login");
  };

  const performAddToCart = (item) => {
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

  const completeAuthSuccess = (account) => {
    const safeUser = { name: account.name, email: account.email };
    setUser(safeUser);
    setIsAuthModalOpen(false);

    if (pendingItem) {
      performAddToCart(pendingItem);
      setPendingItem(null);
    } else {
      setPendingItem(null);
    }
  };

  const handleLogin = ({ email = "", password = "" }) => {
    const normalizedEmail = normalizeEmail(email);
    const sanitizedPassword = password.trim();

    if (!normalizedEmail || !sanitizedPassword) {
      return { success: false, error: missingFieldsError };
    }

    const account = registeredUsers.find(
      (entry) =>
        entry.email === normalizedEmail && entry.password === sanitizedPassword
    );

    if (!account) {
      return { success: false, error: invalidCredentialsError };
    }

    completeAuthSuccess(account);
    return { success: true };
  };

  const handleRegister = ({ name = "", email = "", password = "" }) => {
    const trimmedName = name.trim();
    const normalizedEmail = normalizeEmail(email);
    const sanitizedPassword = password.trim();

    if (!trimmedName || !normalizedEmail || !sanitizedPassword) {
      return { success: false, error: missingFieldsError };
    }

    const exists = registeredUsers.some(
      (entry) => entry.email === normalizedEmail
    );

    if (exists) {
      return { success: false, error: emailTakenError };
    }

    const newAccount = {
      name: trimmedName,
      email: normalizedEmail,
      password: sanitizedPassword,
    };

    setRegisteredUsers((prev) => [...prev, newAccount]);
    completeAuthSuccess(newAccount);
    return { success: true };
  };



  const addToCart = (item) => {
    if (!user) {
      handleRequireAuth(item);
      return;
    }

    performAddToCart(item);
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

  useEffect(() => {
    if (view.type === "category" || view.type === "checkout") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [view]);

  const handlePlaceOrder = () => {
    setCart([]);
  };

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
        user={user}
        onLoginClick={handleLoginClick}
        onLogout={handleLogout}
      />
      {view.type === "checkout" ? (
        <CheckoutPage
          cart={cart}
          texts={content.checkout}
          removeFromCart={removeFromCart}
          onUpdateQuantity={updateCartQuantity}
          onContinueShopping={handleNavigateHome}
          onPlaceOrder={handlePlaceOrder}
        />
      ) : view.type === "category" && activeCategory ? (
        <CategoryPage
          category={activeCategory}
          items={categoryItems}
          addToCart={addToCart}
          onNavigateHome={handleNavigateHome}
          onNavigateMenu={() => handleNavigateSection("menu")}
          texts={content.categoryPage}
          menuLabels={content.menuLabels}
          canAddToCart={Boolean(user)}
          onRequireAuth={handleRequireAuth}
        />
      ) : (
        <HomePage
          heroBackground={heroBackground}
          stats={stats}
          categories={translatedCategories}
          bestSellers={bestSellers}
          combos={combos}
          promotions={promotions}
          addToCart={addToCart}
          onSelectCategory={handleSelectCategory}
          texts={content.home}
          menuLabels={content.menuLabels}
          canAddToCart={Boolean(user)}
          onRequireAuth={handleRequireAuth}
        />
      )}
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
      <AuthModal
        isOpen={isAuthModalOpen}
        mode={authMode}
        texts={authTexts}
        onModeChange={setAuthMode}
        onClose={handleAuthClose}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
    </div>
  );
}

export default App;
