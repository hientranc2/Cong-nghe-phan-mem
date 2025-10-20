import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Cart from "./components/Cart";
import HomePage from "./pages/HomePage";
import CategoryPage from "./pages/CategoryPage";
import CheckoutPage from "./pages/CheckoutPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import { categories as categoryData, menuItems } from "./data/menuData";
import { contentByLanguage } from "./i18n/translations";


const heroBackground =
  "https://images.unsplash.com/photo-1550317138-10000687a72b?auto=format&fit=crop&w=1600&q=80";

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



  useEffect(() => {
    const handleHashChange = () => {
      setView(parseHash());
    };

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [parseHash]);

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
      view.type === "product"
    ) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [view]);

  useEffect(() => {
    if (view.type === "product" && !activeProduct) {
      redirectToHome();
    }
  }, [view, activeProduct, redirectToHome]);

  const handlePlaceOrder = () => {
    setCart([]);
  };

  const handleViewProduct = (item) => {
    if (!item?.id) {
      return;
    }

    pendingSectionRef.current = null;
    if (typeof window !== "undefined") {
      window.location.hash = `/product/${item.id}`;
    }
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
      ) : view.type === "product" && activeProduct ? (
        <ProductDetailPage
          item={activeProduct}
          category={activeProductCategory}
          addToCart={addToCart}
          onNavigateHome={handleNavigateHome}
          onNavigateCategory={handleSelectCategory}
          texts={content.productDetail}
          menuLabels={content.menuLabels}
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
          onViewProduct={handleViewProduct}
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
          onViewProduct={handleViewProduct}
          texts={content.home}
          menuLabels={content.menuLabels}
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
    </div>
  );
}

export default App;
