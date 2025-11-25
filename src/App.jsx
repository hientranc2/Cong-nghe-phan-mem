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
import { categories as defaultCategories, menuItems as defaultMenuItems } from "./data/menuData";
import { restaurants as defaultRestaurants } from "./data/restaurants";
import { contentByLanguage } from "./i18n/translations";
import { createMenuItem, createOrder, fetchAllData } from "./api/client";


const heroBackground =
  "https://images.unsplash.com/photo-1550317138-10000687a72b?auto=format&fit=crop&w=1600&q=80";

const USERS_STORAGE_KEY = "fcoUsers";
const CURRENT_USER_STORAGE_KEY = "fcoCurrentUser";
const ORDER_HISTORY_STORAGE_KEY = "fcoOrderHistory";
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

const translateRestaurants = (restaurants, language) =>
  restaurants.map((restaurant) => {
    const translation =
      restaurant.translations?.[language] ?? restaurant.translations?.vi ?? {};

    return {
      ...restaurant,
      name: translation.name ?? restaurant.name ?? "",
      description: translation.description ?? restaurant.description ?? "",
      story: translation.story ?? restaurant.story ?? "",
      city: translation.city ?? restaurant.city ?? "",
      deliveryTime: translation.deliveryTime ?? restaurant.deliveryTime ?? "",
    };
  });

function App() {
  const [language, setLanguage] = useState("vi");
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const pendingSectionRef = useRef(null);
  const [view, setView] = useState(() => parseViewFromHash());
  const parseHash = useCallback(() => parseViewFromHash(), []);
  const [categories, setCategories] = useState(defaultCategories);
  const [menuItemList, setMenuItemList] = useState(defaultMenuItems);
  const [restaurantList, setRestaurantList] = useState(defaultRestaurants);
  const [users, setUsers] = useState(DEFAULT_USERS);
  const [currentUser, setCurrentUser] = useState(null);
  const [authRedirect, setAuthRedirect] = useState(null);
  const [authMessage, setAuthMessage] = useState("");
  const [pendingOrder, setPendingOrder] = useState(null);
  const [recentReceipt, setRecentReceipt] = useState(null);
  const [orderHistory, setOrderHistory] = useState([]);
  const [adminOrders, setAdminOrders] = useState([]);



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
    let active = true;

    const loadRemoteContent = async () => {
      try {
        const data = await fetchAllData();
        if (!active || !data) return;

        if (Array.isArray(data.categories) && data.categories.length > 0) {
          setCategories(data.categories);
        }

        if (Array.isArray(data.menuItems) && data.menuItems.length > 0) {
          setMenuItemList(
            data.menuItems.map((item) => ({
              ...item,
              img: item.img ?? item.image ?? item.imageUrl ?? item.photo,
              image: item.image ?? item.img ?? item.imageUrl ?? item.photo,
            }))
          );
        }

        if (Array.isArray(data.restaurants) && data.restaurants.length > 0) {
          setRestaurantList(
            data.restaurants.map((restaurant) => ({
              ...restaurant,
              img: restaurant.img ?? restaurant.image ?? restaurant.photo,
            }))
          );
        }

        if (Array.isArray(data.orders) && data.orders.length > 0) {
          setAdminOrders(data.orders);
          setOrderHistory(data.orders);
        }
      } catch (error) {
        console.error("Không thể đồng bộ dữ liệu từ json-server", error);
      }
    };

    loadRemoteContent();

    return () => {
      active = false;
    };
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

  const content = useMemo(
    () => contentByLanguage[language] ?? contentByLanguage.vi,
    [language]
  );

  const translatedCategories = useMemo(
    () => translateCategories(categories, language),
    [categories, language]
  );

  const translatedMenuItems = useMemo(
    () => translateMenuItems(menuItemList, language),
    [menuItemList, language]
  );

  const translatedRestaurants = useMemo(
    () => translateRestaurants(restaurantList, language),
    [restaurantList, language]
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

  const appendMenuItem = (item) => {
    if (!item?.id) return;

    setMenuItemList((prev) => {
      const normalized = {
        ...item,
        img: item.img ?? item.image ?? item.imageUrl ?? item.photo,
        image: item.image ?? item.img ?? item.imageUrl ?? item.photo,
      };

      const exists = prev.some((entry) => entry.id === normalized.id);
      return exists ? prev : [...prev, normalized];
    });
  };

  const syncMenuItemToServer = async (item) => {
    const tempId = item.id || `temp-${Date.now()}`;
    appendMenuItem({ ...item, id: tempId });

    try {
      const saved = await createMenuItem(item);
      if (saved) {
        setMenuItemList((prev) => {
          const normalized = {
            ...saved,
            img: saved.img ?? saved.image ?? saved.imageUrl ?? saved.photo,
            image: saved.image ?? saved.img ?? saved.imageUrl ?? saved.photo,
          };

          const withoutTemp = prev.filter((entry) => entry.id !== tempId);
          const exists = withoutTemp.some((entry) => entry.id === normalized.id);
          return exists ? withoutTemp : [...withoutTemp, normalized];
        });
      }
    } catch (error) {
      console.error("Không thể lưu món ăn lên json-server", error);
    }
  };

  const syncOrderToServer = async (order) => {
    try {
      const saved = await createOrder(order);
      if (saved) {
        setAdminOrders((prev) => [saved, ...prev.filter((o) => o.id !== saved.id)]);
        setOrderHistory((prev) => [saved, ...prev.filter((o) => o.id !== saved.id)]);
      }
    } catch (error) {
      console.error("Không thể lưu đơn hàng lên json-server", error);
    }
  };

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

    setRecentReceipt(receipt);
    setPendingOrder(null);
    setCart([]);

    syncOrderToServer(receipt);

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
        restaurants={translatedRestaurants}
        menuItems={translatedMenuItems}
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

  if (view.type === "admin") {
    return <AdminDashboard orders={adminOrders} restaurants={restaurantList} />;
  }
  if (view.type === "restaurant") {
    return (
      <RestaurantDashboard
        user={currentUser}
        texts={restaurantTexts}
        menuItems={menuItemList}
        categories={categories}
        onCreateMenuItem={syncMenuItemToServer}
        onBackHome={handleNavigateHome}
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
