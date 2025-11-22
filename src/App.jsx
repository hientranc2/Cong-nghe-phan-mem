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
import OrderTrackingPage from "./pages/OrderTrackingPage.jsx";
import OrderHistoryPage from "./pages/OrderHistoryPage.jsx";
import AdminDashboard from "./admin/AdminDashboard";
import RestaurantDashboard from "./pages/RestaurantDashboard";
import { categories as categoryData, menuItems } from "./data/menuData";
import { contentByLanguage } from "./i18n/translations";


const heroBackground =
  "https://images.unsplash.com/photo-1550317138-10000687a72b?auto=format&fit=crop&w=1600&q=80";

const USERS_STORAGE_KEY = "fcoUsers";
const CURRENT_USER_STORAGE_KEY = "fcoCurrentUser";
const ORDER_HISTORY_STORAGE_KEY = "fcoOrderHistory";
const ADMIN_CUSTOMERS_STORAGE_KEY = "fcoAdminCustomers";
const ADMIN_ORDERS_STORAGE_KEY = "fcoAdminOrders";
const RESTAURANTS_STORAGE_KEY = "fcoRestaurants";
const PARTNER_MENU_STORAGE_KEY = "fcoPartnerMenu";
const PARTNER_ORDERS_STORAGE_KEY = "fcoPartnerOrders";
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

const mergeCustomersByEmail = (customers = []) => {
  const byEmail = new Map();

  customers.forEach((customer) => {
    const emailKey = normalizeEmail(customer.email);
    if (!emailKey) return;

    const existing = byEmail.get(emailKey) ?? {};
    byEmail.set(emailKey, { ...existing, ...customer });
  });

  return Array.from(byEmail.values());
};

const defaultRestaurantImage =
  "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80";

const normalizeRestaurantDish = (dish, index = 0) => {
  const id = dish?.id || `dish-${String(index + 1).padStart(2, "0")}`;
  const name = dish?.name?.trim() || "Món mới";
  const description = dish?.description?.trim() || "Món do nhà hàng đối tác thêm.";
  const category = dish?.category?.trim() || "Món mới";
  const baseCategorySlug = slugify(category) || `partner-${index + 1}`;
  const categoryId = `partner-${baseCategorySlug}`;
  const rawPrice = Number(dish?.price) || 0;
  const price = Math.max(1, Math.round(rawPrice / 1000)) || 1;
  const tag = dish?.tag?.trim() || null;
  const calories = Number.isFinite(dish?.calories)
    ? Math.max(50, Math.round(dish.calories))
    : 450;
  const time = Number.isFinite(dish?.time) ? Math.max(5, Math.round(dish.time)) : 15;

  return {
    id,
    name,
    description,
    category,
    categoryId,
    price,
    calories,
    time,
    tag,
    img: dish?.img || defaultRestaurantImage,
    translations: {
      vi: { name, description, tag },
      en: { name, description, tag },
    },
    isBestSeller: String(tag || "")
      .toLowerCase()
      .includes("best"),
  };
};

const collectDynamicCategories = (dishes = []) => {
  const categories = new Map();

  dishes.forEach((dish, index) => {
    if (!dish.category) return;
    const baseSlug = slugify(dish.category) || `partner-${index + 1}`;
    const slug = `partner-${baseSlug}`;

    if (!categories.has(slug)) {
      categories.set(slug, {
        id: `partner-${baseSlug}`,
        slug,
        icon: "🍽️",
        title: dish.category,
        description: "Món mới từ nhà hàng đối tác.",
        heroTitle: dish.category,
        heroDescription: "Khám phá món mới được thêm từ nhà hàng.",
        translations: {
          vi: {
            title: dish.category,
            description: "Món mới từ nhà hàng đối tác.",
            heroTitle: dish.category,
            heroDescription: "Khám phá món mới được thêm từ nhà hàng.",
          },
          en: {
            title: dish.category,
            description: "New dishes from partner restaurants.",
            heroTitle: dish.category,
            heroDescription: "Explore newly added partner dishes.",
          },
        },
      });
    }
  });

  return Array.from(categories.values());
};

const slugify = (value = "") =>
  value
    .normalize("NFD")
    .replace(/[^\w\s-]/g, "")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

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

  if (/^\/order-tracking$/.test(hash)) {
    return { type: "orderTracking" };
  }

  if (/^\/orders$/.test(hash)) {
    return { type: "orders" };
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
  const [orderHistory, setOrderHistory] = useState([]);
  const [adminCustomers, setAdminCustomers] = useState(DEFAULT_CUSTOMERS);
  const [adminOrders, setAdminOrders] = useState(DEFAULT_ORDERS);
  const [restaurants, setRestaurants] = useState([]);
  const [partnerMenuItems, setPartnerMenuItems] = useState([]);
  const [partnerOrders, setPartnerOrders] = useState(DEFAULT_ORDERS);



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
      const storedCustomers = JSON.parse(
        window.localStorage.getItem(ADMIN_CUSTOMERS_STORAGE_KEY) ?? "[]"
      );
      const mergedCustomers = mergeCustomersByEmail([
        ...DEFAULT_CUSTOMERS,
        ...(Array.isArray(storedCustomers) ? storedCustomers : []),
      ]);
      setAdminCustomers(mergedCustomers);
    } catch (error) {
      setAdminCustomers(DEFAULT_CUSTOMERS);
    }

    try {
      const storedAdminOrders = JSON.parse(
        window.localStorage.getItem(ADMIN_ORDERS_STORAGE_KEY) ?? "[]"
      );
      setAdminOrders(
        Array.isArray(storedAdminOrders) && storedAdminOrders.length > 0
          ? storedAdminOrders
          : DEFAULT_ORDERS
      );
    } catch (error) {
      setAdminOrders(DEFAULT_ORDERS);
    }

    try {
      const storedRestaurants = JSON.parse(
        window.localStorage.getItem(RESTAURANTS_STORAGE_KEY) ?? "[]"
      );
      setRestaurants(Array.isArray(storedRestaurants) ? storedRestaurants : []);
    } catch (error) {
      setRestaurants([]);
    }

    try {
      const storedPartnerMenu = JSON.parse(
        window.localStorage.getItem(PARTNER_MENU_STORAGE_KEY) ?? "[]"
      );
      setPartnerMenuItems(
        Array.isArray(storedPartnerMenu) ? storedPartnerMenu : []
      );
    } catch (error) {
      setPartnerMenuItems([]);
    }

    try {
      const storedPartnerOrders = JSON.parse(
        window.localStorage.getItem(PARTNER_ORDERS_STORAGE_KEY) ?? "[]"
      );
      setPartnerOrders(
        Array.isArray(storedPartnerOrders) && storedPartnerOrders.length > 0
          ? storedPartnerOrders
          : DEFAULT_ORDERS
      );
    } catch (error) {
      setPartnerOrders(DEFAULT_ORDERS);
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
      const storedHistory = JSON.parse(
        window.localStorage.getItem(ORDER_HISTORY_STORAGE_KEY) ?? "[]"
      );
      if (Array.isArray(storedHistory)) {
        setOrderHistory(storedHistory);
      }
    } catch (error) {
      setOrderHistory([]);
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

    try {
      window.localStorage.setItem(
        ADMIN_CUSTOMERS_STORAGE_KEY,
        JSON.stringify(adminCustomers)
      );
    } catch (error) {
      /* ignore persistence errors */
    }
  }, [adminCustomers]);

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

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      window.localStorage.setItem(
        ORDER_HISTORY_STORAGE_KEY,
        JSON.stringify(orderHistory)
      );
    } catch (error) {
      /* ignore persistence errors */
    }
  }, [orderHistory]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      window.localStorage.setItem(
        ADMIN_ORDERS_STORAGE_KEY,
        JSON.stringify(adminOrders)
      );
    } catch (error) {
      /* ignore persistence errors */
    }
  }, [adminOrders]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      window.localStorage.setItem(
        RESTAURANTS_STORAGE_KEY,
        JSON.stringify(restaurants)
      );
    } catch (error) {
      /* ignore persistence errors */
    }
  }, [restaurants]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      window.localStorage.setItem(
        PARTNER_MENU_STORAGE_KEY,
        JSON.stringify(partnerMenuItems)
      );
    } catch (error) {
      /* ignore persistence errors */
    }
  }, [partnerMenuItems]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      window.localStorage.setItem(
        PARTNER_ORDERS_STORAGE_KEY,
        JSON.stringify(partnerOrders)
      );
    } catch (error) {
      /* ignore persistence errors */
    }
  }, [partnerOrders]);

  useEffect(() => {
    const derivedCustomers = users
      .filter((user) => user.role === "customer")
      .map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: "",
        tier: "Tiêu chuẩn",
        active: true,
        joinedAt: new Date().toISOString().slice(0, 10),
      }));

    setAdminCustomers((prev) => mergeCustomersByEmail([...prev, ...derivedCustomers]));
  }, [users]);

  const content = useMemo(
    () => contentByLanguage[language] ?? contentByLanguage.vi,
    [language]
  );

  const partnerMenuForDisplay = useMemo(
    () => partnerMenuItems.map((dish, index) => normalizeRestaurantDish(dish, index)),
    [partnerMenuItems]
  );

  const dynamicCategories = useMemo(
    () => collectDynamicCategories(partnerMenuForDisplay),
    [partnerMenuForDisplay]
  );

  const mergedCategories = useMemo(() => {
    const categories = [...categoryData, ...dynamicCategories];
    const seen = new Set();

    return categories.filter((category) => {
      const slug = category.slug || slugify(category.title);
      if (seen.has(slug)) return false;
      seen.add(slug);
      return true;
    });
  }, [dynamicCategories]);

  const translatedCategories = useMemo(
    () => translateCategories(mergedCategories, language),
    [language, mergedCategories]
  );

  const mergedMenuItems = useMemo(
    () => [...menuItems, ...partnerMenuForDisplay],
    [partnerMenuForDisplay]
  );

  const translatedMenuItems = useMemo(
    () => translateMenuItems(mergedMenuItems, language),
    [language, mergedMenuItems]
  );

  const customerOrders = useMemo(() => {
    if (!currentUser || currentUser.role !== "customer") {
      return [];
    }

    const customerEmail = normalizeEmail(currentUser.email);
    if (!customerEmail) {
      return [];
    }

    const filtered = orderHistory.filter((order) => {
      const orderEmail = normalizeEmail(
        order.ownerEmail ?? order.customer?.email ?? ""
      );
      return orderEmail === customerEmail;
    });

    return filtered
      .slice()
      .sort((a, b) => {
        const aTime = new Date(a.confirmedAt ?? a.createdAt ?? 0).getTime();
        const bTime = new Date(b.confirmedAt ?? b.createdAt ?? 0).getTime();
        return bTime - aTime;
      });
  }, [currentUser, orderHistory]);
    const activeCustomerOrdersCount = useMemo(() => {
    if (customerOrders.length === 0) {
      return 0;
    }

    return customerOrders.filter((order) => {
      const statusText = String(order.status ?? "").toLowerCase();
      const isCancelled =
        statusText.includes("hủy") ||
        statusText.includes("huy") ||
        statusText.includes("cancel") ||
        Boolean(order.cancelledAt);

      return !isCancelled;
    }).length;
  }, [customerOrders]);
  const canViewOrderHistory = useMemo(() => {
    if (!currentUser || currentUser.role !== "customer") {
      return false;
    }

    return Boolean(pendingOrder || recentReceipt || customerOrders.length > 0);
  }, [currentUser, pendingOrder, recentReceipt, customerOrders]);

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

  const combos = useMemo(() => {
    const rawCombos = content.combos ?? [];

    return rawCombos.map((combo, index) => {
      const safeName = combo.name ?? `Combo ${index + 1}`;
      const generatedId = slugify(safeName);
      const id =
        combo.id ??
        (generatedId ? `combo-${generatedId}` : `combo-${index + 1}`);
      const description = combo.desc ?? combo.description ?? "";
      const price =
        typeof combo.price === "number"
          ? combo.price
          : Number.parseFloat(combo.price) || 0;
      const image = combo.img ?? combo.image ?? null;

      return {
        ...combo,
        id,
        name: safeName,
        desc: description,
        description,
        price,
        img: image,
        type: combo.type ?? "combo",
      };
    });
  }, [content.combos]);
  const promotions = content.promotions ?? [];
  const stats = content.stats ?? [];
  const loginTexts = content.login ?? content.auth?.login ?? {};
  const registerTexts = content.register ?? content.auth?.register ?? {};
  const orderConfirmationTexts =
    content.orderConfirmation ?? content.auth?.orderConfirmation ?? {};
  const orderHistoryTexts = content.orderHistory ?? {};
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

      if (nextDestination === "orders") {
        if (typeof window !== "undefined") {
          window.location.hash = "/orders";
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
      view.type === "orderTracking" ||
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
    if (view.type === "orders") {
      if (!currentUser || currentUser.role !== "customer") {
        setAuthRedirect("orders");
        setAuthMessage(
          !currentUser
            ? "Vui lòng đăng nhập để xem đơn hàng của bạn."
            : "Tài khoản hiện tại không thể xem lịch sử đơn hàng."
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
    if (
      view.type === "orderTracking" &&
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

  const handleAdminCustomersChange = useCallback((nextCustomers = []) => {
    setAdminCustomers(mergeCustomersByEmail(nextCustomers));
  }, []);

  const handleAdminOrdersChange = useCallback((nextOrders = []) => {
    setAdminOrders(Array.isArray(nextOrders) ? nextOrders : []);
  }, []);

  const handleRestaurantsChange = useCallback((nextRestaurants = []) => {
    setRestaurants(Array.isArray(nextRestaurants) ? nextRestaurants : []);
  }, []);

  const handlePartnerMenuChange = useCallback((nextMenuItems = []) => {
    setPartnerMenuItems(Array.isArray(nextMenuItems) ? nextMenuItems : []);
  }, []);

  const handlePartnerOrdersChange = useCallback((nextOrders = []) => {
    setPartnerOrders(Array.isArray(nextOrders) ? nextOrders : []);
  }, []);

  

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

    if (normalizedRole === "customer") {
      const customerProfile = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: "",
        tier: "Tiêu chuẩn",
        active: true,
        joinedAt: new Date().toISOString().slice(0, 10),
      };
      setAdminCustomers((prev) =>
        mergeCustomersByEmail([...prev, customerProfile])
      );
    }
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

    const normalizedCustomerEmail = normalizeEmail(email);
    const ownerEmail = normalizedCustomerEmail
      || normalizeEmail(currentUser?.email ?? "");

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
    ownerEmail,
  };

  const itemsCount = receipt.items?.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0
  );
  const orderTotalVnd = Math.max(0, Number(receipt.total || 0) * 1000);

  const adminOrderEntry = {
    id: receipt.id,
    customer: receipt.customer.name,
    destination: receipt.customer.address,
    droneId: "dr-01",
    total: orderTotalVnd,
    status: "Đang chuẩn bị",
  };

  const restaurantOrderEntry = {
    id: receipt.id,
    customer: receipt.customer.name,
    items: itemsCount,
    total: orderTotalVnd,
    status: "Chờ xác nhận",
    placedAt: receipt.confirmedAt,
    address: receipt.customer.address,
  };

  setAdminOrders((prev) => {
    const filtered = prev.filter((order) => order.id !== adminOrderEntry.id);
    return [adminOrderEntry, ...filtered];
  });

  setPartnerOrders((prev) => {
    const filtered = prev.filter((order) => order.id !== restaurantOrderEntry.id);
    return [restaurantOrderEntry, ...filtered];
  });

  setRecentReceipt(receipt);
  setPendingOrder(null);
  setCart([]);

    setOrderHistory((prevHistory) => {
      const filtered = prevHistory.filter((order) => order.id !== receipt.id);
      const updated = [receipt, ...filtered];

      return updated.sort((a, b) => {
        const aTime = new Date(a.confirmedAt ?? a.createdAt ?? 0).getTime();
        const bTime = new Date(b.confirmedAt ?? b.createdAt ?? 0).getTime();
        return bTime - aTime;
      });
    });

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

  const handleViewTracking = () => {
    if (typeof window !== "undefined") {
      window.location.hash = "/order-tracking";
    }
  };

  const handleBackToOrderSummary = () => {
    if (typeof window !== "undefined") {
      window.location.hash = "/order-confirmation";
    }
  };

  const handleViewOrdersPage = () => {
    pendingSectionRef.current = null;
    setIsCartOpen(false);
    if (typeof window !== "undefined") {
      window.location.hash = "/orders";
    }
  };

  const handleSelectOrderFromHistory = (orderId) => {
    const order = customerOrders.find((entry) => entry.id === orderId);
    if (!order) {
      return;
    }

    const clonedOrder = {
      ...order,
      items: (order.items ?? []).map((item) => ({ ...item })),
      customer: order.customer ? { ...order.customer } : order.customer,
    };

    setPendingOrder(null);
    setRecentReceipt(clonedOrder);

    if (typeof window !== "undefined") {
      window.location.hash = "/order-confirmation";
    }
  };

  const handleTrackOrderFromHistory = (orderId) => {
    const order = customerOrders.find((entry) => entry.id === orderId);
    if (!order) {
      return;
    }

    const clonedOrder = {
      ...order,
      items: (order.items ?? []).map((item) => ({ ...item })),
      customer: order.customer ? { ...order.customer } : order.customer,
    };

    setPendingOrder(null);
    setRecentReceipt(clonedOrder);

    if (typeof window !== "undefined") {
      window.location.hash = "/order-tracking";
    }
  };
  const handleCancelOrderFromHistory = (orderId) => {
    const order = customerOrders.find((entry) => entry.id === orderId);
    if (!order) {
      return;
    }

    setOrderHistory((prevHistory) =>
      prevHistory.map((entry) => {
        if (entry.id !== orderId) {
          return entry;
        }

        const progress =
          typeof entry.deliveryProgress === "number"
            ? entry.deliveryProgress
            : typeof entry.progress === "number"
              ? entry.progress
              : null;

        const statusText = String(entry.status ?? "").toLowerCase();
        const isCompleted =
          (typeof progress === "number" && progress >= 0.99) ||
          statusText.includes("hoàn") ||
          statusText.includes("complete") ||
          statusText.includes("done");
        const isCancelled =
          statusText.includes("hủy") ||
          statusText.includes("huy") ||
          statusText.includes("cancel");

        if (isCompleted || isCancelled) {
          return entry;
        }

        return {
          ...entry,
          status: orderHistoryTexts.statusCancelled ?? "Đã hủy",
          cancelledAt: new Date().toISOString(),
        };
      })
    );
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
        onViewTracking={handleViewTracking}
      />
    );
  } else if (view.type === "orderTracking") {
    const trackingTexts =
      orderConfirmationTexts.trackingPage ?? orderConfirmationTexts;

    pageContent = (
      <OrderTrackingPage
        receipt={recentReceipt}
        pendingOrder={pendingOrder}
        texts={trackingTexts}
        onBackToOrder={handleBackToOrderSummary}
        onBackHome={handleOrderConfirmationClose}
      />
    );
  } else if (view.type === "orders") {
    pageContent = (
      <OrderHistoryPage
        user={currentUser}
        orders={customerOrders}
        texts={orderHistoryTexts}
        onSelectOrder={handleSelectOrderFromHistory}
        onTrackOrder={handleTrackOrderFromHistory}
        onCancelOrder={handleCancelOrderFromHistory}

        
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
        restaurants={restaurants}
        addToCart={addToCart}
        onSelectCategory={handleSelectCategory}
        onViewProduct={handleViewProduct}
        texts={content.home}
        menuLabels={content.menuLabels}
      />
    );
  }

  if (view.type === "admin") {
    return (
      <AdminDashboard
        customers={adminCustomers}
        orders={adminOrders}
        restaurants={restaurants}
        onCustomersChange={handleAdminCustomersChange}
        onOrdersChange={handleAdminOrdersChange}
        onRestaurantsChange={handleRestaurantsChange}
      />
    );
  }
  if (view.type === "restaurant") {
    return (
      <RestaurantDashboard
        user={currentUser}
        texts={restaurantTexts}
        onBackHome={handleNavigateHome}
        menuItems={partnerMenuItems}
        orders={partnerOrders}
        onMenuItemsChange={handlePartnerMenuChange}
        onOrdersChange={handlePartnerOrdersChange}
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

        language={language}
        onLanguageChange={setLanguage}
        user={currentUser}
        onShowLogin={handleShowLogin}
        onLogout={handleLogout}
        onViewOrders={handleViewOrdersPage}
        canViewOrders={canViewOrderHistory}
        orderCount={activeCustomerOrdersCount}
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
