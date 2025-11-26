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
import RestaurantPage from "./pages/RestaurantPage";
import { categories as defaultCategories, menuItems as defaultMenuItems } from "./data/menuData";
import { restaurants as defaultRestaurants } from "./data/restaurants";
import { contentByLanguage } from "./i18n/translations";
import {
  createMenuItem,
  createOrder,
  createRestaurant,
  createUser,
  deleteMenuItem,
  deleteOrder,
  deleteRestaurant,
  fetchAllData,
  fetchOrders,
  fetchUsers,
  updateMenuItem,
  updateOrder,
  updateRestaurant,
} from "./api/client";


const heroBackground =
  "https://images.unsplash.com/photo-1550317138-10000687a72b?auto=format&fit=crop&w=1600&q=80";

const withRestaurantDefaults = (restaurant, fallbackImage = heroBackground) => {
  const safeName = restaurant?.name?.trim() || "Nhà hàng FCO";
  const resolvedAddress = restaurant?.address?.trim() || restaurant?.city || "";
  const resolvedId = restaurant?.id?.trim() || slugify(safeName) || "nh-01";
  const resolvedSlug = restaurant?.slug?.trim() || slugify(safeName) || resolvedId;

  return {
    badge: restaurant?.badge || safeName,
    description:
      restaurant?.description ||
      (resolvedAddress ? `Địa chỉ: ${resolvedAddress}` : "Đang cập nhật"),
    city: restaurant?.city || resolvedAddress || "Đang cập nhật",
    deliveryTime: restaurant?.deliveryTime || "15-30 phút",
    img:
      restaurant?.img ||
      restaurant?.image ||
      restaurant?.photo ||
      restaurant?.imageUrl ||
      fallbackImage,
    tags: restaurant?.tags || [],
    ...restaurant,
    id: resolvedId,
    slug: resolvedSlug,
    address: resolvedAddress,
  };
};

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
const normalizePhone = (phone = "") => phone.replace(/\D/g, "");

const mapUserProfile = (user = {}) => {
  const resolvedName = user.name?.trim() || user.fullName?.trim() || "";

  return {
    ...user,
    name: resolvedName || user.name || user.fullName || "",
    fullName: user.fullName || resolvedName || user.name || "",
  };
};

const mergeUsersByEmail = (users = []) => {
  const byEmail = new Map();

  users.forEach((user) => {
    const normalized = mapUserProfile(user);
    const key = normalizeEmail(normalized.email);
    if (!key) {
      return;
    }

    const existing = byEmail.get(key) ?? {};
    byEmail.set(key, { ...existing, ...normalized });
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

  const restaurantDetailMatch = hash.match(/^\/restaurants\/([\w-]+)/);

  if (restaurantDetailMatch && restaurantDetailMatch[1]) {
    return { type: "restaurantDetail", slug: restaurantDetailMatch[1] };
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

const normalizeMenuItemForClient = (item) => {
  const rawPrice =
    typeof item.price === "number" ? item.price : Number.parseFloat(item.price);
  const normalizedPrice = Number.isFinite(rawPrice) ? rawPrice : 0;
  const calories = Number(item.calories);
  const time = Number(item.time);

  const resolvedImage =
    item.img ?? item.image ?? item.imageUrl ?? item.photo ?? item.imageBase64;

  return {
    ...item,
    price: normalizedPrice,
    calories: Number.isFinite(calories) && calories > 0 ? calories : 450,
    time: Number.isFinite(time) && time > 0 ? time : 15,
    img: resolvedImage,
    image: resolvedImage,
  };
};

function App() {
  const [language, setLanguage] = useState("vi");
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const pendingSectionRef = useRef(null);
  const [view, setView] = useState(() => parseViewFromHash());
  const parseHash = useCallback(() => parseViewFromHash(), []);
  const [categories, setCategories] = useState(defaultCategories);
  const [menuItemList, setMenuItemList] = useState(defaultMenuItems);
  const [restaurantList, setRestaurantList] = useState(() =>
    defaultRestaurants.map((restaurant) => withRestaurantDefaults(restaurant))
  );
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

  const syncUsersFromServer = useCallback(async () => {
    try {
      const remoteUsers = await fetchUsers();
      if (Array.isArray(remoteUsers)) {
        setUsers((prev) => mergeUsersByEmail([...prev, ...remoteUsers]));
        return remoteUsers;
      }
    } catch (error) {
      console.error("Không thể đồng bộ tài khoản từ server", error);
    }

    return [];
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
          setMenuItemList(data.menuItems.map(normalizeMenuItemForClient));
        }

        if (Array.isArray(data.restaurants) && data.restaurants.length > 0) {
          setRestaurantList(
            data.restaurants.map((restaurant) =>
              withRestaurantDefaults(restaurant)
            )
          );
        }

        if (Array.isArray(data.orders)) {
          setAdminOrders(data.orders);
          setOrderHistory(data.orders);
        }

        if (Array.isArray(data.users) && data.users.length > 0) {
          setUsers((prev) => mergeUsersByEmail([...prev, ...data.users]));
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
    setCart((prevCart) => {
      const availableIds = new Set(translatedMenuItems.map((item) => item.id));

      const filteredCart = prevCart.filter((cartItem) =>
        availableIds.has(cartItem.id)
      );

      return filteredCart.map((cartItem) => {
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
      });
    });
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

  const customerProfiles = useMemo(
    () =>
      users
        .filter((user) => (user.role ?? "customer") === "customer")
        .map((user, index) => {
          const safeName = user.fullName || user.name || "Khách hàng";
          const joinedAt = (user.joinedAt || "").toString().slice(0, 10);
          const fallbackJoinedAt = new Date().toISOString().slice(0, 10);

          return {
            id: user.id || `kh-${String(index + 1).padStart(2, "0")}`,
            name: safeName,
            email: normalizeEmail(user.email) || "Đang cập nhật",
            phone: user.phone || "Chưa có",
            tier: user.tier || "Tiêu chuẩn",
            active: user.active ?? true,
            joinedAt: joinedAt || fallbackJoinedAt,
          };
        }),
    [users]
  );

  const appendMenuItem = (item) => {
    if (!item?.id) return;

    setMenuItemList((prev) => {
      const normalized = normalizeMenuItemForClient(item);

      const exists = prev.some((entry) => entry.id === normalized.id);
      return exists ? prev : [...prev, normalized];
    });
  };

  const upsertMenuItemLocally = (item) => {
    if (!item?.id) return;

    setMenuItemList((prev) => {
      const normalized = normalizeMenuItemForClient(item);
      const exists = prev.some((entry) => entry.id === normalized.id);
      return exists
        ? prev.map((entry) =>
            entry.id === normalized.id ? { ...entry, ...normalized } : entry
          )
        : [...prev, normalized];
    });
  };

  const syncMenuItemToServer = async (item) => {
    const tempId = item.id || `temp-${Date.now()}`;
    appendMenuItem({ ...item, id: tempId });

    try {
      const saved = await createMenuItem(item);
      if (saved) {
        const normalized = normalizeMenuItemForClient(saved);
        setMenuItemList((prev) => {
          const withoutTemp = prev.filter((entry) => entry.id !== tempId);
          const exists = withoutTemp.some((entry) => entry.id === normalized.id);
          return exists
            ? withoutTemp.map((entry) =>
                entry.id === normalized.id ? { ...entry, ...normalized } : entry
              )
            : [...withoutTemp, normalized];
        });
      }
    } catch (error) {
      console.error("Không thể lưu món ăn lên json-server", error);
    }
  };

  const syncUpdatedMenuItem = async (item) => {
    upsertMenuItemLocally(item);

    if (!item?.id) return;

    try {
      const saved = await updateMenuItem(item.id, item);
      if (saved) {
        upsertMenuItemLocally(saved);
      }
    } catch (error) {
      console.error("Không thể cập nhật món ăn trên json-server", error);
    }
  };

  const syncDeletedMenuItem = async (itemId) => {
    setMenuItemList((prev) => prev.filter((entry) => entry.id !== itemId));

    if (!itemId) return;

    try {
      await deleteMenuItem(itemId);
    } catch (error) {
      console.error("Không thể xóa món ăn trên json-server", error);
    }
  };

  const upsertRestaurantState = (restaurant) => {
    if (!restaurant) return;

    const normalized = withRestaurantDefaults(restaurant);

    setRestaurantList((prev) => {
      const exists = prev.some((entry) => entry.id === normalized.id);
      return exists
        ? prev.map((entry) =>
            entry.id === normalized.id ? { ...entry, ...normalized } : entry
          )
        : [...prev, normalized];
    });
  };

  const syncCreatedRestaurant = async (restaurant) => {
    if (!restaurant) return;

    const tempId = restaurant.id || `temp-${Date.now()}`;
    upsertRestaurantState({ ...restaurant, id: tempId });

    try {
      const payload = withRestaurantDefaults({ ...restaurant, id: tempId });
      const saved = await createRestaurant(payload);
      const normalized = withRestaurantDefaults(saved ?? payload);

      setRestaurantList((prev) => {
        const withoutTemp = prev.filter((entry) => entry.id !== tempId);
        const exists = withoutTemp.some((entry) => entry.id === normalized.id);
        return exists
          ? withoutTemp.map((entry) =>
              entry.id === normalized.id ? { ...entry, ...normalized } : entry
            )
          : [...withoutTemp, normalized];
      });
    } catch (error) {
      console.error("Không thể tạo nhà hàng trên json-server", error);
    }
  };

  const syncUpdatedRestaurant = async (restaurant) => {
    if (!restaurant?.id) return;

    const normalized = withRestaurantDefaults(restaurant);
    upsertRestaurantState(normalized);

    try {
      const saved = await updateRestaurant(normalized.id, normalized);
      if (saved) {
        upsertRestaurantState(saved);
      }
    } catch (error) {
      console.error("Không thể cập nhật nhà hàng trên json-server", error);
    }
  };

  const syncDeletedRestaurant = async (restaurantId) => {
    setRestaurantList((prev) => prev.filter((entry) => entry.id !== restaurantId));

    if (!restaurantId) return;

    try {
      await deleteRestaurant(restaurantId);
    } catch (error) {
      console.error("Không thể xóa nhà hàng trên json-server", error);
    }
  };

  const upsertOrderState = (order) => {
    if (!order) return;

    setAdminOrders((prev) => {
      if (!order?.id) return prev;
      const exists = prev.some((entry) => entry.id === order.id);
      return exists
        ? prev.map((entry) => (entry.id === order.id ? { ...entry, ...order } : entry))
        : [order, ...prev];
    });

    setOrderHistory((prev) => {
      if (!order?.id) return prev;
      const exists = prev.some((entry) => entry.id === order.id);
      return exists
        ? prev.map((entry) => (entry.id === order.id ? { ...entry, ...order } : entry))
        : [order, ...prev];
    });
  };

  const removeOrderState = (orderId) => {
    if (!orderId) return;
    setAdminOrders((prev) => prev.filter((entry) => entry.id !== orderId));
    setOrderHistory((prev) => prev.filter((entry) => entry.id !== orderId));
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

  const syncUpdatedOrder = async (order) => {
    upsertOrderState(order);

    if (!order?.id) return;

    try {
      const saved = await updateOrder(order.id, order);
      if (saved) {
        upsertOrderState(saved);
      }
    } catch (error) {
      console.error("Không thể cập nhật đơn hàng trên json-server", error);
    }
  };

  const syncDeletedOrder = async (orderId) => {
    removeOrderState(orderId);

    if (!orderId) return;

    try {
      await deleteOrder(orderId);
    } catch (error) {
      console.error("Không thể xóa đơn hàng trên json-server", error);
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

  const handleViewRestaurant = (slug) => {
    if (!slug) return;
    pendingSectionRef.current = null;
    if (typeof window !== "undefined") {
      window.location.hash = `/restaurants/${slug}`;
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

  useEffect(() => {
    if (view.type === "restaurantDetail" && !activeRestaurantDetail) {
      redirectToHome();
    }
  }, [view, activeRestaurantDetail, redirectToHome]);

  const categoryItems = useMemo(() => {
    if (!activeCategory) {
      return [];
    }

    return translatedMenuItems.filter(
      (item) => item.categoryId === activeCategory.id
    );
  }, [activeCategory, translatedMenuItems]);

  const activeRestaurantDetail = useMemo(() => {
    if (view.type !== "restaurantDetail") {
      return null;
    }

    return (
      translatedRestaurants.find((restaurant) => restaurant.slug === view.slug) ??
      null
    );
  }, [view, translatedRestaurants]);

  const restaurantMenuItems = useMemo(() => {
    if (!activeRestaurantDetail) return [];
    const ids = new Set(activeRestaurantDetail.menuItemIds ?? []);
    return translatedMenuItems.filter((item) => ids.has(item.id));
  }, [activeRestaurantDetail, translatedMenuItems]);

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
      view.type === "restaurant" ||
      view.type === "restaurantDetail"
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

  

  const handleLogin = async ({ email = "", phone = "", password = "" }) => {
    const normalizedEmail = normalizeEmail(email);
    const normalizedPhone = normalizePhone(phone);

    if ((!normalizedEmail && !normalizedPhone) || !password) {
      return {
        success: false,
        message: "Vui lòng nhập email, số điện thoại và mật khẩu.",
      };
    }

    let mergedUsers = users;
    const remoteUsers = await syncUsersFromServer();
    if (remoteUsers.length > 0) {
      mergedUsers = mergeUsersByEmail([...mergedUsers, ...remoteUsers]);
    }

    const matchedUser = mergedUsers.find((candidate) => {
      const emailMatch =
        normalizedEmail && normalizeEmail(candidate.email) === normalizedEmail;
      const phoneMatch =
        normalizedPhone && normalizePhone(candidate.phone ?? "") === normalizedPhone;

      return (emailMatch || phoneMatch) && candidate.password === password;
    });

    if (!matchedUser) {
      return {
        success: false,
        message: "Thông tin đăng nhập chưa chính xác. Vui lòng thử lại.",
      };
    }

    const { password: _password, ...safeUser } = matchedUser;
    const normalizedUser = mapUserProfile(safeUser);
    setCurrentUser(normalizedUser);
    setIsCartOpen(false);
    redirectAfterAuth(safeUser, authRedirect);
    setAuthRedirect(null);
    setAuthMessage("");
    return { success: true, user: normalizedUser };
  };

  const handleRegister = async ({
    name = "",
    email = "",
    phone = "",
    password = "",
    role = "customer",
  }) => {
    const trimmedName = name.trim();
    const normalizedEmail = normalizeEmail(email);
    const normalizedPhone = normalizePhone(phone);
    const allowedRoles = ["customer", "admin", "restaurant"];
    const normalizedRole = allowedRoles.includes(role) ? role : "customer";
    const joinedAt = new Date().toISOString().slice(0, 10);

    if (!trimmedName || !normalizedEmail || !password) {
      return {
        success: false,
        message: "Vui lòng điền đầy đủ thông tin đăng ký.",
      };
    }

    let mergedUsers = users;
    const remoteUsers = await syncUsersFromServer();
    if (remoteUsers.length > 0) {
      mergedUsers = mergeUsersByEmail([...mergedUsers, ...remoteUsers]);
    }

    const exists = mergedUsers.some((candidate) => {
      const sameEmail = normalizeEmail(candidate.email) === normalizedEmail;
      const samePhone =
        normalizedPhone &&
        normalizePhone(candidate.phone ?? "") === normalizedPhone;
      return sameEmail || samePhone;
    });

    if (exists) {
      return {
        success: false,
        message:
          "Email hoặc số điện thoại đã được đăng ký. Vui lòng sử dụng thông tin khác.",
      };
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name: trimmedName,
      fullName: trimmedName,
      email: normalizedEmail,
      phone: normalizedPhone,
      password,
      role: normalizedRole,
      tier: "Tiêu chuẩn",
      active: true,
      joinedAt,
    };

    try {
      const created = await createUser(newUser);
      if (created?.id) {
        newUser.id = created.id;
      }
    } catch (error) {
      console.error("Không thể lưu tài khoản mới lên server", error);
    }

    setUsers((prevUsers) => mergeUsersByEmail([...prevUsers, newUser]));

    const { password: _password, ...safeUser } = newUser;
    const normalizedUser = mapUserProfile(safeUser);
    setAuthMessage(
      "Đăng ký thành công! Vui lòng đăng nhập bằng tài khoản vừa tạo."
    );
    setAuthRedirect(null);
    setCurrentUser(null);
    setIsCartOpen(false);
    if (typeof window !== "undefined") {
      window.location.hash = "/login";
    }

    return {
      success: true,
      user: normalizedUser,
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

  useEffect(() => {
    if (view.type !== "admin" && view.type !== "restaurant") {
      return;
    }

    let active = true;

    const reloadOrders = async () => {
      try {
        const orders = await fetchOrders();
        if (!active || !Array.isArray(orders)) return;

        setAdminOrders(orders);
        setOrderHistory(orders);
      } catch (error) {
        console.error("Không thể tải danh sách đơn hàng", error);
      }
    };

    reloadOrders();

    return () => {
      active = false;
    };
  }, [view]);

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
  } else if (view.type === "restaurantDetail" && activeRestaurantDetail) {
    pageContent = (
      <RestaurantPage
        restaurant={activeRestaurantDetail}
        menuItems={restaurantMenuItems}
        addToCart={addToCart}
        onNavigateHome={handleNavigateHome}
        onNavigateRestaurants={() => handleNavigateSection("restaurants")}
        texts={content.restaurantPage ?? {}}
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
        combos={combos}
        promotions={promotions}
        addToCart={addToCart}
        onSelectCategory={handleSelectCategory}
        onViewProduct={handleViewProduct}
        onViewRestaurant={handleViewRestaurant}
        texts={content.home}
        menuLabels={content.menuLabels}
      />
    );
  }

  if (view.type === "admin") {
    return (
      <AdminDashboard
        orders={adminOrders}
        restaurants={restaurantList}
        customers={customerProfiles}
        onCreateRestaurant={syncCreatedRestaurant}
        onUpdateRestaurant={syncUpdatedRestaurant}
        onDeleteRestaurant={syncDeletedRestaurant}
      />
    );
  }
  if (view.type === "restaurant") {
    return (
      <RestaurantDashboard
        user={currentUser}
        texts={restaurantTexts}
        menuItems={menuItemList}
        categories={categories}
        orders={adminOrders}
        onCreateMenuItem={syncMenuItemToServer}
        onUpdateMenuItem={syncUpdatedMenuItem}
        onDeleteMenuItem={syncDeletedMenuItem}
        onCreateOrder={syncOrderToServer}
        onUpdateOrder={syncUpdatedOrder}
        onDeleteOrder={syncDeletedOrder}
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
