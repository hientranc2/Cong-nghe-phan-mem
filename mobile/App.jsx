import React, { useCallback, useEffect, useMemo, useState } from "react";
import { SafeAreaView, StatusBar, View, StyleSheet } from "react-native";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";

import HomeScreen from "./src/screens/HomeScreen.jsx";
import AuthScreen from "./src/features/auth/AuthScreen.jsx";
import CartScreen from "./src/screens/CartScreen.jsx";
import CheckoutScreen from "./src/screens/CheckoutScreen.jsx";
import OrderConfirmationScreen from "./src/screens/OrderConfirmationScreen.jsx";
import OrderTrackingScreen from "./src/screens/OrderTrackingScreen.jsx";
import AdminDashboardScreen from "./src/features/admin/AdminDashboardScreen.jsx";
import RestaurantDashboardScreen from "./src/features/restaurant/RestaurantDashboardScreen.jsx";
import { CartProvider } from "./src/context/CartContext.jsx";
import { createOrder, fetchCollection } from "./src/utils/api";

const SCREENS = {
  home: "home",
  auth: "auth",
  cart: "cart",
  checkout: "checkout",
  orderConfirmation: "orderConfirmation",
  orderTracking: "orderTracking",
  adminDashboard: "adminDashboard",
  restaurantDashboard: "restaurantDashboard",
};

const HOME_TAB = "home";
const ORDERS_TAB = "orders";

const ACTIVE_STATUS = "Đang giao";
const CANCELLED_STATUS = "Đã hủy";
const ACTIVE_STATUS_COLOR = "#f97316";
const CANCELLED_STATUS_COLOR = "#ef4444";
const normalizePhone = (phone) => (phone ?? "").replace(/\D/g, "");
const normalizeEmail = (email) => (email ?? "").trim().toLowerCase();

const DEFAULT_ORDER_ACTIONS = [
  { id: "cancel", label: "Hủy đơn hàng", variant: "secondary" },
  { id: "summary", label: "Xem tóm tắt", variant: "ghost" },
  { id: "track", label: "Theo dõi hành trình", variant: "primary" },
];

const DEFAULT_ADDRESS = "";
const createDefaultCustomer = () => ({
  name: "Bạn thân FoodCourt",
  phone: "0123 456 789",
});

const formatCurrency = (value) => {
  if (typeof value !== "number") {
    return "--";
  }

  try {
    return `${new Intl.NumberFormat("vi-VN").format(value)} đ`;
  } catch (error) {
    return `${value} đ`;
  }
};

const formatDateTimeLabel = (value) => {
  if (!value) {
    return "--";
  }

  try {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return "--";
    }

    return new Intl.DateTimeFormat("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  } catch (error) {
    return "--";
  }
};

const ensureISODate = (value, fallbackDate) => {
  if (value) {
    const parsed = value instanceof Date ? value : new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString();
    }
  }

  const fallback = fallbackDate instanceof Date ? fallbackDate : new Date();
  return fallback.toISOString();
};

const isCancelledStatus = (status) =>
  typeof status === "string" && status.toLowerCase().includes("hủy");

const countOrderItems = (items) => {
  if (!Array.isArray(items)) {
    return 0;
  }

  return items.reduce((sum, item) => sum + (Number(item?.quantity) || 1), 0);
};

const buildOrderViewModel = (rawOrder = {}) => {
  const now = new Date();
  const id = rawOrder.id ?? rawOrder.code ?? `ORD-${now.getTime()}`;
  const createdAtISO = ensureISODate(rawOrder.createdAt ?? rawOrder.placedAt, now);
  const estimatedDeliveryISO = ensureISODate(
    rawOrder.estimatedDelivery,
    new Date(new Date(createdAtISO).getTime() + 45 * 60 * 1000)
  );
  const placedAtLabel = rawOrder.placedAt ?? formatDateTimeLabel(createdAtISO);
  const totalAmountLabel =
    typeof rawOrder.totalAmount === "string"
      ? rawOrder.totalAmount
      : typeof rawOrder.subtotal === "number"
      ? formatCurrency(rawOrder.subtotal)
      : "--";
  const rawStatusLabel =
    typeof rawOrder.status === "string"
      ? rawOrder.status
      : rawOrder.status?.label ?? ACTIVE_STATUS;
  const normalizedStatusLabel = isCancelledStatus(rawStatusLabel)
    ? CANCELLED_STATUS
    : rawStatusLabel;
  const statusColor =
    rawOrder.statusColor ??
    (rawOrder.status && typeof rawOrder.status === "object" ? rawOrder.status.color : undefined) ??
    (normalizedStatusLabel === CANCELLED_STATUS
      ? CANCELLED_STATUS_COLOR
      : ACTIVE_STATUS_COLOR);
  const actions =
    Array.isArray(rawOrder.actions) && rawOrder.actions.length > 0
      ? rawOrder.actions
      : DEFAULT_ORDER_ACTIONS;

  return {
    id,
    code: rawOrder.code ?? id,
    restaurantName: rawOrder.restaurantName ?? "FoodCourt Online",
    placedAt: placedAtLabel,
    totalAmount: totalAmountLabel,
    status: normalizedStatusLabel,
    statusColor,
    actions,
    userId:
      rawOrder.userId ??
      rawOrder.customer?.id ??
      rawOrder.customerId ??
      rawOrder.user?.id,
    contactPhone: rawOrder.customer?.phone,
    contactEmail: rawOrder.customer?.email,
    details: {
      ...rawOrder,
      id,
      code: rawOrder.code ?? id,
      createdAt: createdAtISO,
      estimatedDelivery: estimatedDeliveryISO,
      subtotal: typeof rawOrder.subtotal === "number" ? rawOrder.subtotal : 0,
      address: rawOrder.address ?? DEFAULT_ADDRESS,
      customer: rawOrder.customer ?? createDefaultCustomer(),
      items: Array.isArray(rawOrder.items) ? rawOrder.items : [],
    },
  };
};

const filterOrdersForUser = (allOrders, user) => {
  if (!user) {
    return [];
  }

  const targetPhone = normalizePhone(user.phone);
  const targetEmail = normalizeEmail(user.email);

  return allOrders.filter((order) => {
    if (!order) {
      return false;
    }

    const source = order.details ?? order;
    const orderUserId =
      order.userId ??
      source.userId ??
      source.customer?.id ??
      source.customerId ??
      source.user?.id;
    const orderPhone = normalizePhone(order.contactPhone ?? source.customer?.phone);
    const orderEmail = normalizeEmail(order.contactEmail ?? source.customer?.email);

    const matchesId = Boolean(user.id && orderUserId && orderUserId === user.id);
    const matchesPhone = Boolean(targetPhone && orderPhone && targetPhone === orderPhone);
    const matchesEmail = Boolean(targetEmail && orderEmail && targetEmail === orderEmail);

    return matchesId || matchesPhone || matchesEmail;
  });
};

export default function App() {
  const [activeScreen, setActiveScreen] = useState(SCREENS.home);
  const [authenticatedUser, setAuthenticatedUser] = useState(null);
  const [lastOrder, setLastOrder] = useState(null);
  const [homeTab, setHomeTab] = useState(HOME_TAB);
  const [orders, setOrders] = useState([]);
  const visibleOrders = useMemo(
    () => filterOrdersForUser(orders, authenticatedUser),
    [orders, authenticatedUser]
  );

  useEffect(() => {
    let active = true;

    const loadOrders = async () => {
      try {
        const serverOrders = await fetchCollection("orders");
        if (!active || !Array.isArray(serverOrders)) {
          return;
        }

        const hydrated = serverOrders.map(buildOrderViewModel);
        setOrders(hydrated);
      } catch (error) {
        console.error("Không thể đồng bộ đơn hàng từ API", error);
      }
    };

    loadOrders();

    return () => {
      active = false;
    };
  }, []);

  const handleLogout = useCallback(() => {
    setAuthenticatedUser(null);
    setActiveScreen(SCREENS.home);
  }, [setActiveScreen, setAuthenticatedUser]);

  const goToAuth = useCallback(
    () => setActiveScreen(SCREENS.auth),
    [setActiveScreen]
  );
  const goHome = useCallback(
    (tab = HOME_TAB) => {
      setHomeTab(tab ?? HOME_TAB);
      setActiveScreen(SCREENS.home);
    },
    [setActiveScreen]
  );
  const goToCart = useCallback(() => setActiveScreen(SCREENS.cart), [setActiveScreen]);
  const goToCheckout = useCallback(() => {
    if (!authenticatedUser) {
      goToAuth();
      return;
    }

    setActiveScreen(SCREENS.checkout);
  }, [authenticatedUser, goToAuth, setActiveScreen]);
  const goToOrderConfirmation = useCallback(
    () => setActiveScreen(SCREENS.orderConfirmation),
    [setActiveScreen]
  );
  const goToOrderTracking = useCallback(
    () => setActiveScreen(SCREENS.orderTracking),
    [setActiveScreen]
  );
  const resolveLandingScreen = useCallback((role) => {
    if (role === "admin") return SCREENS.adminDashboard;
    if (role === "restaurant") return SCREENS.restaurantDashboard;
    return SCREENS.home;
  }, []);

  const handleLoginSuccess = useCallback(
    (user) => {
      if (user) {
        const normalizedUser = {
          id: user.id,
          name: user.name ?? user.fullName,
          fullName: user.fullName ?? user.name,
          phone: user.phone,
          email: user.email,
          role: user.role ?? "customer",
          restaurantId: user.restaurantId,
          restaurantSlug: user.restaurantSlug,
        };
        setAuthenticatedUser(normalizedUser);
        setActiveScreen(resolveLandingScreen(normalizedUser.role));
      } else {
        setAuthenticatedUser(null);
        setActiveScreen(SCREENS.home);
      }
    },
    [resolveLandingScreen]
  );

  const screenHandlers = useMemo(
    () => ({
      goToAuth,
      goHome,
      goToCart,
      goToCheckout,
      handleLoginSuccess,
      goToOrderTracking,
    }),
    [goHome, goToAuth, goToCart, goToCheckout, goToOrderTracking, handleLoginSuccess]
  );

  const handleOrderPlaced = useCallback(
    (order) => {
      if (!order) {
        setLastOrder(null);
        goHome();
        return;
      }

      const enhancedOrder = {
        status: "Chờ xác nhận",
        total: order.subtotal ?? order.total ?? 0,
        itemsCount: countOrderItems(order.items),
        source: order.source ?? "mobile",
        userId:
          authenticatedUser?.id ??
          authenticatedUser?.email ??
          authenticatedUser?.phone,
        ...order,
        customer: {
          id:
            authenticatedUser?.id ??
            order.customer?.id ??
            authenticatedUser?.email ??
            authenticatedUser?.phone,
          name: order.customer?.name ?? authenticatedUser?.fullName,
          phone: order.customer?.phone ?? authenticatedUser?.phone,
          email: order.customer?.email ?? authenticatedUser?.email,
        },
      };

      const optimisticView = buildOrderViewModel(enhancedOrder);
      setLastOrder(enhancedOrder);
      setOrders((previous) => [optimisticView, ...previous.filter((o) => o.id !== optimisticView.id)]);
      goToOrderConfirmation();

      createOrder(enhancedOrder)
        .then((saved) => {
          if (!saved) return;
          const synced = buildOrderViewModel(saved);
          setOrders((previous) => [synced, ...previous.filter((o) => o.id !== synced.id)]);
          setLastOrder(synced.details);
        })
        .catch((error) => {
          console.error("Không thể lưu đơn hàng lên API", error);
        });
    },
    [authenticatedUser, goHome, goToOrderConfirmation]
  );

  const handleTrackOrder = useCallback(() => {
    if (!lastOrder) {
      goHome();
      return;
    }

    goToOrderTracking();
  }, [goHome, goToOrderTracking, lastOrder]);

  const handleOrdersChange = useCallback((nextOrders) => {
    if (!Array.isArray(nextOrders)) {
      return;
    }

    setOrders((previous) => {
      const merged = new Map(
        (Array.isArray(previous) ? previous : []).map((order) => [order?.id, order])
      );

      nextOrders.forEach((order) => {
        if (order?.id) {
          merged.set(order.id, order);
        }
      });

      return Array.from(merged.values());
    });
  }, []);

  const handleOrderAction = useCallback(
    (actionId, order) => {
      if (!order) {
        return;
      }

      const orderDetails = order.details ?? order;

      if (actionId === "track") {
        setLastOrder(orderDetails);
        goToOrderTracking();
        return;
      }

      if (actionId === "summary") {
        setLastOrder(orderDetails);
        goToOrderConfirmation();
      }
    },
    [goToOrderConfirmation, goToOrderTracking]
  );

  const handleHomeTabChange = useCallback((tabId) => {
    setHomeTab(tabId ?? HOME_TAB);
  }, []);

  const handleViewOrders = useCallback(() => {
    goHome(ORDERS_TAB);
  }, [goHome]);

  return (
    <CartProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <ExpoStatusBar style="dark" />
        <View style={styles.screen}>
          {activeScreen === SCREENS.home ? (
            <HomeScreen
              onPressLogin={screenHandlers.goToAuth}
              user={authenticatedUser}
              onViewCart={screenHandlers.goToCart}
              initialTab={homeTab}
              orders={visibleOrders}
              onOrdersChange={handleOrdersChange}
              onOrderAction={handleOrderAction}
              onTabChange={handleHomeTabChange}
              onLogout={handleLogout}
            />
          ) : activeScreen === SCREENS.auth ? (
            <AuthScreen
              onBack={screenHandlers.goHome}
              onLoginSuccess={screenHandlers.handleLoginSuccess}
            />
          ) : activeScreen === SCREENS.cart ? (
            <CartScreen
              onBack={screenHandlers.goHome}
              onCheckout={screenHandlers.goToCheckout}
              isAuthenticated={Boolean(authenticatedUser)}
              
            />
          ) : activeScreen === SCREENS.checkout ? (
            <CheckoutScreen
              onBack={screenHandlers.goHome}
              user={authenticatedUser}
              onOrderPlaced={handleOrderPlaced}
            />
          ) : activeScreen === SCREENS.orderTracking ? (
            <OrderTrackingScreen
              order={lastOrder}
              onBack={goToOrderConfirmation}
              onGoHome={goHome}
            />
          ) : activeScreen === SCREENS.adminDashboard ? (
            <AdminDashboardScreen
              user={authenticatedUser}
              onBack={screenHandlers.goHome}
            />
          ) : activeScreen === SCREENS.restaurantDashboard ? (
            <RestaurantDashboardScreen
              user={authenticatedUser}
              onBack={screenHandlers.goHome}
            />
          ) : (
            <OrderConfirmationScreen
              onBack={screenHandlers.goHome}
              onViewOrders={handleViewOrders}
              onTrackOrder={handleTrackOrder}
              order={lastOrder}
            />
          )}
        </View>
      </SafeAreaView>
    </CartProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff8f2",
  },
  screen: {
    flex: 1,
    backgroundColor: "#fff8f2",
  },
});
