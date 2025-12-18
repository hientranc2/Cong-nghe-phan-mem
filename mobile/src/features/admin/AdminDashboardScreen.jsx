import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import OrderTrackingScreen from "../../screens/OrderTrackingScreen.jsx";
import {
  createRestaurant,
  createUser,
  deleteOrder,
  deleteRestaurant,
  deleteUser,
  deleteDrone,
  fetchDrones,
  fetchCollection,
  updateOrder,
  updateRestaurant,
  updateUser,
  createDrone,
  updateDrone,
} from "../../utils/api";

const normalizeStatus = (value) =>
  String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d");

const normalizeName = (value) => String(value ?? "").trim().toLowerCase();

const isActiveOrderStatus = (status) => {
  const normalized = normalizeStatus(status);
  return (
    normalized.includes("dang cho") ||
    normalized.includes("cho xac nhan") ||
    normalized.includes("dang giao") ||
    normalized.includes("dang chuan") ||
    normalized.includes("chuan bi") ||
    normalized.includes("dang xu ly")
  );
};

const normalizeOrders = (orders = []) => {
  return orders.map((order, index) => {
    const base = order || {};
    const total =
      Number(base?.totalAmount) ||
      Number(base?.total) ||
      Number(base?.subtotal) ||
      0;

    const status = String(base?.status?.label ?? base?.status ?? "").trim();
    const restaurantName =
      base?.restaurantName ||
      base?.restaurant?.name ||
      base?.restaurant ||
      base?.vendor ||
      "FCO";
    const address =
      base?.address ||
      base?.customer?.address ||
      base?.deliveryAddress ||
      base?.shippingAddress ||
      base?.customerAddress ||
      "";

    return {
      ...base,
      id: base?.id || base?.code || `ORD-${index + 1}`,
      code: base?.code || base?.id || `ORD-${index + 1}`,
      customer:
        base?.customer?.name ||
        base?.customerName ||
        base?.customer ||
        "Khach le",
      total,
      status: status || "Đang chờ",
      restaurant: restaurantName,
      restaurantName,
      restaurantAddress:
        base?.restaurantAddress ||
        base?.restaurant?.address ||
        base?.restaurantCity ||
        base?.city ||
        "",
      address,
    };
  });
};

const calculateRevenue = (orders = []) =>
  orders.reduce((sum, order) => sum + (Number(order.total) || 0), 0);

const hasMobileSource = (source) => {
  if (!source) return false;
  return String(source).toLowerCase().includes("mobile");
};

const isMobileOrder = (order) => hasMobileSource(order?.source);

const formatDate = (value) => {
  if (!value) return "Vừa đăng ký";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(parsed);
};

const DEFAULT_RESTAURANT_IMAGE =
  "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1000&q=80";

const normalizeRestaurantPayload = (restaurant = {}) => {
  const safeName = restaurant?.name?.trim() || "Nhà hàng FCO";
  const safeAddress = restaurant?.address?.trim() || restaurant?.city || "";
  const normalizedId = restaurant?.id?.trim() || `nh-${Date.now()}`;
  const normalizedSlug =
    restaurant?.slug?.trim() ||
    safeName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") ||
    normalizedId;

  return {
    id: normalizedId,
    slug: normalizedSlug,
    name: safeName,
    badge: restaurant?.badge?.trim() || safeName,
    address: safeAddress,
    city: restaurant?.city?.trim() || safeAddress || "Đang cập nhật",
    hotline: restaurant?.hotline?.trim() || "",
    deliveryTime: restaurant?.deliveryTime?.trim() || "15-30 phút",
    description:
      restaurant?.description?.trim() ||
      (safeAddress ? `Địa chỉ: ${safeAddress}` : "Đang cập nhật"),
    img:
      restaurant?.img ||
      restaurant?.image ||
      restaurant?.photo ||
      restaurant?.imageUrl ||
      DEFAULT_RESTAURANT_IMAGE,
    tags: restaurant?.tags || [],
  };
};

const normalizeDronePayload = (drone = {}) => {
  const normalizedId = drone?.id?.trim() || `dr-${Date.now()}`;
  const normalizedName = drone?.name?.trim() || `Drone ${normalizedId}`;
  const parsedBattery = Number(drone?.battery ?? 100);

  return {
    id: normalizedId,
    name: normalizedName,
    status: drone?.status?.trim() || "Sẵn sàng",
    battery: Number.isFinite(parsedBattery) ? Math.max(0, Math.min(100, parsedBattery)) : 100,
    lastMission: drone?.lastMission?.trim() || "Chờ nhiệm vụ",
  };
};

const normalizeCustomerPayload = (customer = {}) => {
  const normalizedId = customer?.id?.trim() || `kh-${Date.now()}`;
  const safeName = customer?.fullName?.trim() || customer?.name?.trim();
  const today = new Date().toISOString().slice(0, 10);

  return {
    id: normalizedId,
    name: safeName || "Khách hàng",
    fullName: safeName || "Khách hàng",
    email: customer?.email?.trim() || "dangcapnhat@fco.vn",
    phone: customer?.phone?.trim() || "",
    tier: customer?.tier?.trim() || "Tiêu chuẩn",
    active: customer?.active ?? true,
    joinedAt: customer?.joinedAt || today,
    role: "customer",
  };
};

const findRestaurantFromOrderItems = (items = []) => {
  if (!Array.isArray(items)) {
    return {};
  }

  for (const item of items) {
    if (!item) continue;

    const candidates = [
      item.restaurantId,
      item.restaurantSlug,
      item.restaurant?.id,
      item.restaurant?.slug,
      item.restaurant?.name,
      item.vendor,
      item.restaurantName,
    ];

    const matched = candidates.find(
      (value) => typeof value === "string" && value.trim()
    );

    if (matched) {
      return { id: matched };
    }

    if (item.restaurant?.slug || item.restaurant?.id) {
      return {
        id: item.restaurant.slug || item.restaurant.id,
      };
    }
  }

  return {};
};

const AdminDashboardScreen = ({ user, onBack }) => {
  const [orders, setOrders] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [users, setUsers] = useState([]);
  const [drones, setDrones] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);
  const [orderForm, setOrderForm] = useState({
    id: "",
    customer: "",
    restaurant: "",
    status: "Đang chờ",
    total: "",
  });
  const [restaurantFormMode, setRestaurantFormMode] = useState(null);
  const [restaurantForm, setRestaurantForm] = useState({
    id: "",
    name: "",
    address: "",
    hotline: "",
    city: "",
    deliveryTime: "",
  });
  const [isSavingRestaurant, setIsSavingRestaurant] = useState(false);
  const [customerFormMode, setCustomerFormMode] = useState(null);
  const [customerForm, setCustomerForm] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    tier: "Tiêu chuẩn",
    active: true,
    joinedAt: "",
  });
  const [isSavingCustomer, setIsSavingCustomer] = useState(false);
  const [trackingOrder, setTrackingOrder] = useState(null);
  const [droneFormMode, setDroneFormMode] = useState(null);
  const [droneForm, setDroneForm] = useState({
    id: "",
    name: "",
    status: "Sẵn sàng",
    battery: "",
    lastMission: "",
  });
  const [isSavingDrone, setIsSavingDrone] = useState(false);
  const [isDroneStatusMenuOpen, setIsDroneStatusMenuOpen] = useState(false);

  const refreshData = useCallback(() => {
    let active = true;

    const loadData = async () => {
      try {
      const [orderResponse, restaurantResponse, userResponse, droneResponse] =
        await Promise.all([
          fetchCollection("orders").catch(() => []),
          fetchCollection("restaurants").catch(() => []),
          fetchCollection("users").catch(() => []),
          fetchDrones().catch(() => []),
        ]);

        if (!active) return;

        setOrders(
          normalizeOrders(Array.isArray(orderResponse) ? orderResponse : [])
        );
        setRestaurants(
          Array.isArray(restaurantResponse) ? restaurantResponse : []
        );
        setUsers(Array.isArray(userResponse) ? userResponse : []);
        setDrones(Array.isArray(droneResponse) ? droneResponse : []);
      } catch (error) {
        console.warn("Không thể đồng bộ dữ liệu quản trị trên mobile", error);
      }
    };

    loadData();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const cleanup = refreshData();
    const interval = setInterval(() => {
      refreshData();
    }, 5000);

    return () => {
      if (cleanup) cleanup();
      clearInterval(interval);
    };
  }, [refreshData]);

  const activeOrders = useMemo(
    () => orders.filter((order) => isActiveOrderStatus(order.status)),
    [orders]
  );

  const revenue = useMemo(() => calculateRevenue(orders), [orders]);

  const revenueByRestaurant = useMemo(() => {
    const map = new Map();
    const restaurantIndex = new Map();
    const restaurantNameIndex = new Map();
    const filteredOrders = orders.filter((order) => !isMobileOrder(order));

    restaurants.forEach((restaurant) => {
      if (restaurant?.id) restaurantIndex.set(restaurant.id, restaurant);
      if (restaurant?.slug) restaurantIndex.set(restaurant.slug, restaurant);
      if (restaurant?.name) {
        restaurantNameIndex.set(normalizeName(restaurant.name), restaurant.id);
      }
    });

    filteredOrders.forEach((order) => {
      const amount = Number(order?.total || 0);
      if (!Number.isFinite(amount)) return;

      const derived = findRestaurantFromOrderItems(order.items ?? []);

      const directKey = order?.restaurantId || order?.restaurantSlug;
      let matched = directKey ? restaurantIndex.get(directKey) : null;

      if (!matched) {
        const nameKey = normalizeName(order?.restaurantName || order?.restaurant);
        const byNameId = nameKey ? restaurantNameIndex.get(nameKey) : null;
        if (byNameId) {
          matched = restaurantIndex.get(byNameId) || null;
        }
      }

      if (!matched && derived.id) {
        matched = restaurantIndex.get(derived.id) || null;
      }

      if (!matched) return;

      const key = matched.id || matched.slug || normalizeName(matched.name);
      if (!key) return;

      const name =
        matched.name || order?.restaurantName || order?.restaurant || "Nha hang";
      const city =
        matched.address ||
        matched.city ||
        order?.restaurantAddress ||
        order?.restaurantCity ||
        order?.city ||
        "";

      const existing = map.get(key) || { key, name, total: 0, count: 0, city };
      existing.total += amount;
      existing.count += 1;
      existing.city = existing.city || city;
      map.set(key, existing);
    });

    return Array.from(map.values()).sort((a, b) => b.total - a.total);
  }, [orders, restaurants]);

  const statusOptions = [
    "Đang chờ",
    "Đang chuẩn bị",
    "Đang giao",
    "Hoàn tất",
    "Tạm hoãn",
    "Đang xử lý",
  ];

  const droneStatusOptions = [
    "Sẵn sàng",
    "Đang hoạt động",
    "Đang bảo trì",
    "Tạm dừng",
    "Cần sạc",
  ];

  const handleStartCreateDrone = () => {
    setDroneFormMode("create");
    setDroneForm({
      id: "",
      name: "",
      status: "Sẵn sàng",
      battery: "",
      lastMission: "",
    });
    setIsDroneStatusMenuOpen(false);
  };

  const handleEditDrone = (drone) => {
    if (!drone) return;
    setDroneFormMode("edit");
    setDroneForm({
      id: drone.id ?? "",
      name: drone.name ?? "",
      status: drone.status ?? "Sẵn sàng",
      battery: drone.battery != null ? String(drone.battery) : "",
      lastMission: drone.lastMission ?? "",
    });
    setIsDroneStatusMenuOpen(false);
  };

  const resetDroneForm = () => {
    setDroneFormMode(null);
    setDroneForm({
      id: "",
      name: "",
      status: "Sẵn sàng",
      battery: "",
      lastMission: "",
    });
    setIsDroneStatusMenuOpen(false);
  };

  const upsertDroneState = (payload) => {
    const normalized = normalizeDronePayload(payload);
    setDrones((prev) => {
      const exists = prev.some((entry) => entry.id === normalized.id);
      return exists
        ? prev.map((entry) =>
            entry.id === normalized.id ? { ...entry, ...normalized } : entry
          )
        : [...prev, normalized];
    });
  };

  const handleSaveDrone = async () => {
    if (!droneForm.name.trim()) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập tên drone.");
      return;
    }

    const payload = normalizeDronePayload({
      ...droneForm,
      battery: Number(droneForm.battery || 0),
    });

    setIsSavingDrone(true);

    try {
      if (droneFormMode === "edit" && payload.id) {
        const saved =
          (await updateDrone(payload.id, payload).catch(() => null)) ?? payload;
        upsertDroneState(saved);
      } else {
        const tempId = payload.id || `dr-${Date.now()}`;
        upsertDroneState({ ...payload, id: tempId });
        const saved =
          (await createDrone({ ...payload, id: tempId }).catch(() => null)) ??
          null;
        if (saved) {
          upsertDroneState(saved);
        }
      }

      resetDroneForm();
      refreshData();
    } catch (error) {
      console.warn("Không thể lưu drone", error);
    } finally {
      setIsSavingDrone(false);
    }
  };

  const handleDeleteDrone = (droneId) => {
    Alert.alert("Xóa drone", "Bạn có chắc muốn xóa drone này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteDrone(droneId);
          } catch (error) {
            console.warn("Không thể xóa drone", error);
          }

          setDrones((prev) => prev.filter((drone) => drone.id !== droneId));
          if (droneForm.id === droneId) {
            resetDroneForm();
          }

          refreshData();
        },
      },
    ]);
  };

  const handleEditOrder = (order) => {
    setEditingOrderId(order.id);
    setIsStatusMenuOpen(false);
    setOrderForm({
      id: order.id,
      customer: order.customer ?? "",
      restaurant: order.restaurant ?? "",
      status: order.status ?? "Đang chờ",
      total: order.total ? String(order.total) : "",
    });
  };

  const resetOrderForm = () => {
    setEditingOrderId(null);
    setOrderForm({
      id: "",
      customer: "",
      restaurant: "",
      status: "Đang chờ",
      total: "",
    });
    setIsStatusMenuOpen(false);
  };

  const resetRestaurantForm = () => {
    setRestaurantForm({
      id: "",
      name: "",
      address: "",
      hotline: "",
      city: "",
      deliveryTime: "",
    });
    setRestaurantFormMode(null);
  };

  const resetCustomerForm = () => {
    setCustomerForm({
      id: "",
      name: "",
      email: "",
      phone: "",
      tier: "Tiêu chuẩn",
      active: true,
      joinedAt: "",
    });
    setCustomerFormMode(null);
  };

  const handleSaveOrder = async () => {
    if (!orderForm.id) {
      Alert.alert("Chưa chọn đơn", "Vui lòng chọn đơn cần chỉnh sửa.");
      return;
    }

    const payload = {
      ...orderForm,
      total: Math.max(Number(orderForm.total) || 0, 0),
    };

    try {
      await updateOrder(orderForm.id, payload);
    } catch (error) {
      console.warn("Không thể cập nhật đơn hàng", error);
    }

    setOrders((prev) =>
      prev.map((order) =>
        order.id === payload.id
          ? { ...order, ...payload, total: payload.total }
          : order
      )
    );

    resetOrderForm();
    refreshData();
    setIsStatusMenuOpen(false);
  };

  const handleDeleteOrder = (orderId) => {
    Alert.alert("Xóa đơn hàng", "Bạn có chắc muốn xóa đơn này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteOrder(orderId);
          } catch (error) {
            console.warn("Không thể xóa đơn hàng", error);
          }

          setOrders((prev) => prev.filter((order) => order.id !== orderId));
          if (editingOrderId === orderId) {
            resetOrderForm();
          }

          refreshData();
        },
      },
    ]);
  };

  const handleTrackOrder = (order) => {
    if (!order) return;
    setTrackingOrder(order);
  };

  const handleCloseTracking = () => {
    setTrackingOrder(null);
  };

  const handleTrackingComplete = async (order) => {
    const completedStatus = statusOptions.find((item) => item.toLowerCase().includes("ho")) || "Hoan tat";
    const id = order?.id;
    if (!id) return;

    setOrders((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: completedStatus, statusColor: "#16a34a" }
          : item
      )
    );

    try {
      await updateOrder(id, { ...order, status: completedStatus });
    } catch (error) {
      console.warn("Khong the cap nhat trang thai hoan tat", error);
    }
  };

  const handleStartCreateRestaurant = () => {
    setRestaurantFormMode("create");
    setRestaurantForm({
      id: "",
      name: "",
      address: "",
      hotline: "",
      city: "",
      deliveryTime: "",
    });
  };

  const handleEditRestaurant = (restaurant) => {
    setRestaurantFormMode("edit");
    setRestaurantForm({
      id: restaurant?.id ?? "",
      name: restaurant?.name ?? "",
      address: restaurant?.address ?? restaurant?.city ?? "",
      hotline: restaurant?.hotline ?? "",
      city: restaurant?.city ?? "",
      deliveryTime: restaurant?.deliveryTime ?? "",
    });
  };

  const upsertRestaurantState = (payload) => {
    const normalized = normalizeRestaurantPayload(payload);
    setRestaurants((prev) => {
      const exists = prev.some((entry) => entry.id === normalized.id);
      return exists
        ? prev.map((entry) =>
            entry.id === normalized.id ? { ...entry, ...normalized } : entry
          )
        : [normalized, ...prev];
    });
  };

  const handleSaveRestaurant = async () => {
    if (!restaurantForm.name?.trim()) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập tên nhà hàng.");
      return;
    }

    const payload = normalizeRestaurantPayload(restaurantForm);
    setIsSavingRestaurant(true);

    try {
      if (restaurantFormMode === "edit" && payload.id) {
        const saved = await updateRestaurant(payload.id, payload).catch(() =>
          null
        );
        upsertRestaurantState(saved ?? payload);
      } else {
        const tempId = payload.id || `nh-${Date.now()}`;
        upsertRestaurantState({ ...payload, id: tempId });
        const saved = await createRestaurant({ ...payload, id: tempId }).catch(
          () => null
        );
        if (saved) {
          upsertRestaurantState(saved);
        }
      }

      resetRestaurantForm();
      refreshData();
    } catch (error) {
      console.warn("Không thể lưu nhà hàng", error);
    } finally {
      setIsSavingRestaurant(false);
    }
  };

  const handleDeleteRestaurant = (restaurantId) => {
    Alert.alert("Xóa nhà hàng", "Bạn có chắc muốn xóa nhà hàng này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteRestaurant(restaurantId);
          } catch (error) {
            console.warn("Không thể xóa nhà hàng", error);
          }

          setRestaurants((prev) =>
            prev.filter((restaurant) => restaurant.id !== restaurantId)
          );
          if (restaurantForm.id === restaurantId) {
            resetRestaurantForm();
          }

          refreshData();
        },
      },
    ]);
  };

  const handleStartCreateCustomer = () => {
    setCustomerFormMode("create");
    setCustomerForm({
      id: "",
      name: "",
      email: "",
      phone: "",
      tier: "Tiêu chuẩn",
      active: true,
      joinedAt: "",
    });
  };

  const handleEditCustomer = (customer) => {
    setCustomerFormMode("edit");
    setCustomerForm({
      id: customer?.id ?? "",
      name: customer?.name ?? customer?.fullName ?? "",
      email: customer?.email ?? "",
      phone: customer?.phone ?? "",
      tier: customer?.tier ?? "Tiêu chuẩn",
      active: customer?.active ?? true,
      joinedAt: customer?.joinedAt ?? "",
    });
  };

  const upsertCustomerState = (payload) => {
    const normalized = normalizeCustomerPayload(payload);
    setUsers((prev) => {
      const exists = prev.some((entry) => entry.id === normalized.id);
      return exists
        ? prev.map((entry) =>
            entry.id === normalized.id ? { ...entry, ...normalized } : entry
          )
        : [...prev, normalized];
    });
  };

  const handleSaveCustomer = async () => {
    if (!customerForm.name?.trim()) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập tên khách hàng.");
      return;
    }

    if (!customerForm.email?.trim()) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập email liên hệ.");
      return;
    }

    const payload = normalizeCustomerPayload(customerForm);
    setIsSavingCustomer(true);

    try {
      if (customerFormMode === "edit" && payload.id) {
        const saved = await updateUser(payload.id, payload).catch(() => null);
        upsertCustomerState(saved ?? payload);
      } else {
        const tempId = payload.id || `kh-${Date.now()}`;
        upsertCustomerState({ ...payload, id: tempId });
        const saved = await createUser({ ...payload, id: tempId }).catch(() =>
          null
        );
        if (saved) {
          upsertCustomerState(saved);
        }
      }

      resetCustomerForm();
      refreshData();
    } catch (error) {
      console.warn("Không thể lưu khách hàng", error);
    } finally {
      setIsSavingCustomer(false);
    }
  };

  const handleDeleteCustomer = (customerId) => {
    Alert.alert("Xóa khách hàng", "Bạn có chắc muốn xóa khách này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteUser(customerId);
          } catch (error) {
            console.warn("Không thể xóa khách hàng", error);
          }

          setUsers((prev) => prev.filter((user) => user.id !== customerId));
          if (customerForm.id === customerId) {
            resetCustomerForm();
          }

          refreshData();
        },
      },
    ]);
  };

  const customerAccounts = useMemo(
    () =>
      users
        .filter((account) => (account.role ?? "customer") === "customer")
        .map((account, index) => ({
          id: account.id || `kh-${index + 1}`,
          name: account.fullName || account.name || "Khách hàng",
          email: account.email || "Đang cập nhật",
          phone: account.phone || "Chưa có",
          tier: account.tier || "Tiêu chuẩn",
          joinedAt: account.joinedAt || account.createdAt || null,
        })),
    [users]
  );

  const tabs = [
    { key: "overview", label: "Tổng quan" },
    { key: "orders", label: "Đơn hàng" },
    { key: "fleet", label: "Đội bay" },
    { key: "restaurants", label: "Nhà hàng" },
    { key: "customers", label: "Khách hàng" },
  ];

  return (
    <View style={styles.page}>
      <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backIcon}>←</Text>
          <Text style={styles.backLabel}>Quay lại</Text>
        </TouchableOpacity>

        <View>
          <Text style={styles.heading}>Bảng điều khiển Admin</Text>
          <Text style={styles.subheading}>
            {user?.name || user?.fullName || "Quản trị viên"}
          </Text>
        </View>
      </View>

      <View style={styles.tabBar}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tabButton, activeTab === tab.key && styles.activeTab]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text
              style={[styles.tabLabel, activeTab === tab.key && styles.activeTabLabel]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === "overview" && (
        <>
          <View style={styles.cardGrid}>
            <View style={[styles.card, styles.primaryCard]}>
              <Text style={styles.cardLabel}>Tong don</Text>
              <Text style={styles.cardValue}>{orders.length}</Text>
              <Text style={styles.cardHint}>{activeOrders.length} dang xu ly</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Doanh thu</Text>
              <Text style={styles.cardValue}>
                {new Intl.NumberFormat('vi-VN').format(revenue)} đ
              </Text>
              <Text style={styles.cardHint}>Tu web & mobile</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Nha hang</Text>
              <Text style={styles.cardValue}>{restaurants.length}</Text>
              <Text style={styles.cardHint}>Dang hoat dong</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Khach hang</Text>
              <Text style={styles.cardValue}>{customerAccounts.length}</Text>
              <Text style={styles.cardHint}>Dang ky web & mobile</Text>
            </View>
          </View>

          {revenueByRestaurant.length > 0 ? (
            <View style={[styles.section, styles.chartSection]}>
              <View style={styles.sectionHeaderRow}>
                <View>
                  <Text style={styles.sectionTitle}>Doanh thu theo nha hang</Text>
                  <Text style={styles.sectionSubTitle}>Moi cot la tong doanh thu va so don cua tung nha hang.</Text>
                </View>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chartList}
              >
                {revenueByRestaurant.map((item, index) => {
                  const maxRevenue = revenueByRestaurant[0]?.total || 1;
                  const height = Math.max(10, (item.total / maxRevenue) * 100);
                  return (
                    <View key={`${item.name}-${index}`} style={styles.chartItem}>
                      <View style={styles.chartBarShell}>
                        <View style={styles.chartValueBadge}>
                          <Text style={styles.chartValueText}>
                            {new Intl.NumberFormat("vi-VN").format(item.total)} đ
                          </Text>
                        </View>
                               <View style={[styles.chartBar, { height: `${height}%` }]} />
                      </View>
                      <Text style={styles.chartName} numberOfLines={1}>
                        {item.name}
                      </Text>
                      <Text style={styles.chartMeta} numberOfLines={2}>
                        {item.count} don  {item.city}
                      </Text>
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          ) : null}
        </>
      )}

      {activeTab === "orders" && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Đơn hàng mới nhất</Text>
          {editingOrderId && (
            <View style={[styles.section, styles.formCard]}>
              <Text style={styles.formTitle}>Chỉnh sửa đơn {orderForm.id}</Text>
              <View style={styles.formField}>
                <Text style={styles.formLabel}>Khách hàng</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Tên khách"
                  value={orderForm.customer}
                  onChangeText={(text) =>
                    setOrderForm((prev) => ({ ...prev, customer: text }))
                  }
                />
              </View>
              <View style={styles.formField}>
                <Text style={styles.formLabel}>Nhà hàng</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nhà hàng"
                  value={orderForm.restaurant}
                  onChangeText={(text) =>
                    setOrderForm((prev) => ({ ...prev, restaurant: text }))
                  }
                />
              </View>
              <View style={styles.formField}>
                <Text style={styles.formLabel}>Trạng thái</Text>
                <View>
                  <TouchableOpacity
                    style={[styles.input, styles.selectInput]}
                    onPress={() => setIsStatusMenuOpen((prev) => !prev)}
                  >
                    <Text style={styles.selectValue}>
                      {orderForm.status || "Chọn trạng thái"}
                    </Text>
                    <Text style={styles.chevron}>⌄</Text>
                  </TouchableOpacity>
                  {isStatusMenuOpen && (
                    <View style={styles.selectMenu}>
                      {statusOptions.map((status) => (
                        <TouchableOpacity
                          key={status}
                          style={styles.selectOption}
                          onPress={() => {
                            setOrderForm((prev) => ({ ...prev, status }));
                            setIsStatusMenuOpen(false);
                          }}
                        >
                          <Text
                            style={[
                              styles.optionLabel,
                              orderForm.status === status && styles.selectedOption,
                            ]}
                          >
                            {status}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              </View>
              <View style={styles.formField}>
                <Text style={styles.formLabel}>Tổng tiền (đ)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="69000"
                  keyboardType="numeric"
                  value={orderForm.total}
                  onChangeText={(text) =>
                    setOrderForm((prev) => ({ ...prev, total: text }))
                  }
                />
              </View>
              <View style={styles.formActions}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.ghostButton]}
                  onPress={resetOrderForm}
                >
                  <Text style={[styles.actionButtonLabel, styles.ghostLabel]}>Huỷ</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={handleSaveOrder}>
                  <Text style={styles.actionButtonLabel}>Lưu thay đổi</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          {orders.length === 0 ? (
            <Text style={styles.emptyText}>Chưa có đơn hàng.</Text>
          ) : (
            orders.map((order) => (
              <View key={order.id} style={styles.listItem}>
                <View style={styles.listTextGroup}>
                  <Text style={styles.itemTitle}>{order.id}</Text>
                  <Text style={styles.itemSubtitle}>
                    {order.customer} • {order.restaurant}
                  </Text>
                </View>
                <View style={styles.tag}>
                  <Text style={styles.tagLabel}>{order.status}</Text>
                </View>
              <Text style={styles.itemValue}>
                {new Intl.NumberFormat("vi-VN").format(order.total)} đ
              </Text>
              <View style={styles.inlineActions}>
                <TouchableOpacity onPress={() => handleTrackOrder(order)}>
                  <Text style={styles.link}>Theo dõi</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleEditOrder(order)}>
                  <Text style={styles.link}>Sửa</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteOrder(order.id)}>
                  <Text style={[styles.link, styles.dangerLink]}>Xóa</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      )}

      {activeTab === "fleet" && (
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Đội bay</Text>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleStartCreateDrone}
            >
              <Text style={styles.secondaryButtonLabel}>+ Thêm drone</Text>
            </TouchableOpacity>
          </View>

          {droneFormMode && (
            <View style={[styles.section, styles.formCard]}>
              <Text style={styles.formTitle}>
                {droneFormMode === "edit"
                  ? `Chỉnh sửa ${droneForm.name || droneForm.id}`
                  : "Tạo drone mới"}
              </Text>

              <View style={styles.formField}>
                <Text style={styles.formLabel}>Mã (tùy chọn)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="dr-01"
                  value={droneForm.id}
                  onChangeText={(text) =>
                    setDroneForm((prev) => ({ ...prev, id: text }))
                  }
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.formLabel}>Tên drone</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Aquila X1"
                  value={droneForm.name}
                  onChangeText={(text) =>
                    setDroneForm((prev) => ({ ...prev, name: text }))
                  }
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.formLabel}>Trạng thái</Text>
                <View>
                  <TouchableOpacity
                    style={[styles.input, styles.selectInput]}
                    onPress={() =>
                      setIsDroneStatusMenuOpen((prev) => !prev)
                    }
                  >
                    <Text style={styles.selectValue}>{droneForm.status}</Text>
                    <Text style={styles.chevron}>⌄</Text>
                  </TouchableOpacity>
                  {isDroneStatusMenuOpen && (
                    <View style={styles.selectMenu}>
                      {droneStatusOptions.map((status) => (
                        <TouchableOpacity
                          key={status}
                          style={styles.selectOption}
                          onPress={() => {
                            setDroneForm((prev) => ({ ...prev, status }));
                            setIsDroneStatusMenuOpen(false);
                          }}
                        >
                          <Text
                            style={[
                              styles.optionLabel,
                              droneForm.status === status &&
                                styles.selectedOption,
                            ]}
                          >
                            {status}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              </View>

              <View style={styles.formField}>
                <Text style={styles.formLabel}>Pin (%)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="82"
                  keyboardType="numeric"
                  value={droneForm.battery}
                  onChangeText={(text) =>
                    setDroneForm((prev) => ({ ...prev, battery: text }))
                  }
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.formLabel}>Nhiệm vụ gần nhất</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Giao cà phê Quận 1"
                  value={droneForm.lastMission}
                  onChangeText={(text) =>
                    setDroneForm((prev) => ({ ...prev, lastMission: text }))
                  }
                />
              </View>

              <View style={styles.formActions}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.ghostButton]}
                  onPress={resetDroneForm}
                  disabled={isSavingDrone}
                >
                  <Text style={[styles.actionButtonLabel, styles.ghostLabel]}>
                    Hủy
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={handleSaveDrone}
                  disabled={isSavingDrone}
                >
                  <Text style={styles.actionButtonLabel}>
                    {isSavingDrone ? "Đang lưu..." : "Lưu"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {drones.length === 0 ? (
            <Text style={styles.emptyText}>Chưa có drone nào.</Text>
          ) : (
            drones.map((drone) => (
              <View key={drone.id} style={styles.listItem}>
                <View style={styles.listTextGroup}>
                  <Text style={styles.itemTitle}>{drone.name}</Text>
                  <Text style={styles.itemSubtitle}>{drone.id}</Text>
                  <Text style={styles.itemSubtitle}>
                    {drone.lastMission || "Chưa có nhiệm vụ"}
                  </Text>
                </View>
                <View style={styles.listSideActions}>
                  <View style={[styles.tag, styles.secondaryTag]}>
                    <Text style={[styles.tagLabel, styles.secondaryTagLabel]}>
                      {drone.status}
                    </Text>
                  </View>
                  <Text style={styles.itemValue}>{drone.battery || 0}% Pin</Text>
                  <View style={styles.inlineActions}>
                    <TouchableOpacity onPress={() => handleEditDrone(drone)}>
                      <Text style={styles.link}>Sửa</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDeleteDrone(drone.id)}
                    >
                      <Text style={[styles.link, styles.dangerLink]}>Xóa</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
      )}

      {activeTab === "restaurants" && (
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Nhà hàng</Text>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleStartCreateRestaurant}
            >
              <Text style={styles.secondaryButtonLabel}>+ Thêm nhà hàng</Text>
            </TouchableOpacity>
          </View>

          {restaurantFormMode && (
            <View style={[styles.section, styles.formCard]}>
              <Text style={styles.formTitle}>
                {restaurantFormMode === "edit"
                  ? `Chỉnh sửa ${restaurantForm.name || restaurantForm.id}`
                  : "Tạo nhà hàng"}
              </Text>

              <View style={styles.formField}>
                <Text style={styles.formLabel}>Mã (tùy chọn)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="nh-01"
                  value={restaurantForm.id}
                  onChangeText={(text) =>
                    setRestaurantForm((prev) => ({ ...prev, id: text }))
                  }
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.formLabel}>Tên nhà hàng</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Tên hiển thị"
                  value={restaurantForm.name}
                  onChangeText={(text) =>
                    setRestaurantForm((prev) => ({ ...prev, name: text }))
                  }
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.formLabel}>Địa chỉ</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Địa chỉ hoặc khu vực"
                  value={restaurantForm.address}
                  onChangeText={(text) =>
                    setRestaurantForm((prev) => ({ ...prev, address: text }))
                  }
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.formLabel}>Hotline</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Số điện thoại liên hệ"
                  keyboardType="phone-pad"
                  value={restaurantForm.hotline}
                  onChangeText={(text) =>
                    setRestaurantForm((prev) => ({ ...prev, hotline: text }))
                  }
                />
              </View>

              <View style={styles.formRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.formLabel}>Khu vực</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="VD: Quận 1, TP.HCM"
                    value={restaurantForm.city}
                    onChangeText={(text) =>
                      setRestaurantForm((prev) => ({ ...prev, city: text }))
                    }
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.formLabel}>Thời gian giao</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="15-30 phút"
                    value={restaurantForm.deliveryTime}
                    onChangeText={(text) =>
                      setRestaurantForm((prev) => ({ ...prev, deliveryTime: text }))
                    }
                  />
                </View>
              </View>

              <View style={styles.formActions}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.ghostButton]}
                  onPress={resetRestaurantForm}
                >
                  <Text style={[styles.actionButtonLabel, styles.ghostLabel]}>
                    Hủy
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={handleSaveRestaurant}
                  disabled={isSavingRestaurant}
                >
                  <Text style={styles.actionButtonLabel}>
                    {isSavingRestaurant ? "Đang lưu..." : "Lưu"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {restaurants.length === 0 ? (
            <Text style={styles.emptyText}>Chưa có dữ liệu nhà hàng.</Text>
          ) : (
            restaurants.map((restaurant) => (
              <View key={restaurant.id} style={styles.listItem}>
                <View style={styles.listTextGroup}>
                  <Text style={styles.itemTitle}>{restaurant.name}</Text>
                  <Text style={styles.itemSubtitle}>
                    {restaurant.address || restaurant.city}
                  </Text>
                  {!!restaurant.hotline && (
                    <Text style={styles.itemSubtitle}>{restaurant.hotline}</Text>
                  )}
                </View>
                <View style={styles.listSideActions}>
                  <View style={[styles.tag, styles.secondaryTag]}>
                    <Text style={[styles.tagLabel, styles.secondaryTagLabel]}>
                      {restaurant.deliveryTime || "15-30 phút"}
                    </Text>
                  </View>
                  <View style={styles.inlineActions}>
                    <TouchableOpacity
                      onPress={() => handleEditRestaurant(restaurant)}
                    >
                      <Text style={styles.link}>Sửa</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDeleteRestaurant(restaurant.id)}
                    >
                      <Text style={[styles.link, styles.dangerLink]}>Xóa</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
      )}

      {activeTab === "customers" && (
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Khách hàng</Text>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleStartCreateCustomer}
            >
              <Text style={styles.secondaryButtonLabel}>+ Thêm khách</Text>
            </TouchableOpacity>
          </View>

          {customerFormMode && (
            <View style={[styles.section, styles.formCard]}>
              <Text style={styles.formTitle}>
                {customerFormMode === "edit"
                  ? `Chỉnh sửa ${customerForm.name || customerForm.id}`
                  : "Tạo khách hàng"}
              </Text>

              <View style={styles.formField}>
                <Text style={styles.formLabel}>Mã (tùy chọn)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="kh-01"
                  value={customerForm.id}
                  onChangeText={(text) =>
                    setCustomerForm((prev) => ({ ...prev, id: text }))
                  }
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.formLabel}>Họ tên</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Tên khách hàng"
                  value={customerForm.name}
                  onChangeText={(text) =>
                    setCustomerForm((prev) => ({ ...prev, name: text }))
                  }
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.formLabel}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="example@gmail.com"
                  keyboardType="email-address"
                  value={customerForm.email}
                  onChangeText={(text) =>
                    setCustomerForm((prev) => ({ ...prev, email: text }))
                  }
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.formLabel}>Số điện thoại</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0909..."
                  keyboardType="phone-pad"
                  value={customerForm.phone}
                  onChangeText={(text) =>
                    setCustomerForm((prev) => ({ ...prev, phone: text }))
                  }
                />
              </View>

              <View style={styles.formRow}>
                <View style={[styles.formField, { flex: 1 }]}>
                  <Text style={styles.formLabel}>Hạng</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Tiêu chuẩn"
                    value={customerForm.tier}
                    onChangeText={(text) =>
                      setCustomerForm((prev) => ({ ...prev, tier: text }))
                    }
                  />
                </View>
                <View style={[styles.formField, { flex: 1 }]}>
                  <Text style={styles.formLabel}>Ngày tham gia</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="YYYY-MM-DD"
                    value={customerForm.joinedAt}
                    onChangeText={(text) =>
                      setCustomerForm((prev) => ({ ...prev, joinedAt: text }))
                    }
                  />
                </View>
              </View>

              <View style={styles.formField}>
                <Text style={styles.formLabel}>Trạng thái</Text>
                <View style={styles.inlineActions}>
                  <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={() =>
                      setCustomerForm((prev) => ({ ...prev, active: true }))
                    }
                  >
                    <Text
                      style={[
                        styles.secondaryButtonLabel,
                        customerForm.active && { color: "#15803d" },
                      ]}
                    >
                      Nhận ưu đãi
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={() =>
                      setCustomerForm((prev) => ({ ...prev, active: false }))
                    }
                  >
                    <Text
                      style={[
                        styles.secondaryButtonLabel,
                        !customerForm.active && { color: "#dc2626" },
                      ]}
                    >
                      Tạm ngưng
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.formActions}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.ghostButton]}
                  onPress={resetCustomerForm}
                  disabled={isSavingCustomer}
                >
                  <Text style={[styles.actionButtonLabel, styles.ghostLabel]}>
                    Hủy
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={handleSaveCustomer}
                  disabled={isSavingCustomer}
                >
                  <Text style={styles.actionButtonLabel}>
                    {isSavingCustomer ? "Đang lưu..." : "Lưu"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {customerAccounts.length === 0 ? (
            <Text style={styles.emptyText}>Chưa có khách hàng nào.</Text>
          ) : (
            customerAccounts.map((customer) => (
              <View key={customer.id} style={styles.listItem}>
                <View style={styles.listTextGroup}>
                  <Text style={styles.itemTitle}>{customer.name}</Text>
                  <Text style={styles.itemSubtitle}>{customer.email}</Text>
                  <Text style={styles.itemSubtitle}>{customer.phone}</Text>
                </View>
                <View style={styles.listSideActions}>
                  <View style={[styles.tag, styles.secondaryTag]}>
                    <Text style={[styles.tagLabel, styles.secondaryTagLabel]}>
                      {customer.tier}
                    </Text>
                  </View>
                  <Text style={styles.itemValue}>
                    {formatDate(customer.joinedAt)}
                  </Text>
                  <View style={styles.inlineActions}>
                    <TouchableOpacity onPress={() => handleEditCustomer(customer)}>
                      <Text style={styles.link}>Sửa</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDeleteCustomer(customer.id)}
                    >
                      <Text style={[styles.link, styles.dangerLink]}>Xóa</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
      )}
      </ScrollView>

      <Modal
        visible={!!trackingOrder}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={handleCloseTracking}
      >
        <OrderTrackingScreen
          order={trackingOrder}
          onBack={handleCloseTracking}
          onGoHome={handleCloseTracking}
          onComplete={handleTrackingComplete}
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#fff8f2",
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: "#fff8f2",
    gap: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingRight: 12,
  },
  backIcon: {
    fontSize: 18,
    marginRight: 8,
    color: "#f97316",
  },
  backLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#f97316",
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: "#7c2d12",
    textAlign: "right",
  },
  subheading: {
    fontSize: 14,
    color: "#a16207",
    textAlign: "right",
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#fff1e6",
    padding: 6,
    borderRadius: 999,
    gap: 6,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 999,
    alignItems: "center",
  },
  tabLabel: {
    fontSize: 13,
    color: "#c2410c",
    fontWeight: "600",
  },
  activeTab: {
    backgroundColor: "#f97316",
    shadowColor: "#f97316",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  activeTabLabel: {
    color: "#ffffff",
  },
  cardGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  card: {
    flexGrow: 1,
    minWidth: "45%",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#f97316",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  primaryCard: {
    backgroundColor: "#fef3c7",
    borderWidth: 1,
    borderColor: "#fcd34d",
  },
  cardLabel: {
    fontSize: 13,
    color: "#a16207",
    marginBottom: 8,
    fontWeight: "600",
  },
  cardValue: {
    fontSize: 22,
    fontWeight: "800",
    color: "#7c2d12",
  },
  cardHint: {
    fontSize: 12,
    color: "#a16207",
    marginTop: 4,
  },
  section: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#f97316",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#7c2d12",
    marginBottom: 12,
  },
  sectionSubTitle: {
    fontSize: 12,
    color: "#a16207",
    marginBottom: 8,
  },
  secondaryButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#fff1e6",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#fdba74",
  },
  secondaryButtonLabel: {
    color: "#c2410c",
    fontWeight: "700",
  },
  emptyText: {
    color: "#a16207",
  },
  listItem: {
    borderTopWidth: 1,
    borderTopColor: "#f5d0c5",
    paddingVertical: 10,
    gap: 6,
  },
  listTextGroup: {
    gap: 2,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#7c2d12",
  },
  itemSubtitle: {
    fontSize: 13,
    color: "#a16207",
  },
  itemValue: {
    fontSize: 14,
    color: "#7c2d12",
    fontWeight: "700",
  },
  listSideActions: {
    alignItems: "flex-end",
    gap: 8,
  },
  tag: {
    alignSelf: "flex-start",
    backgroundColor: "#f97316",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  tagLabel: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "700",
  },
  secondaryTag: {
    backgroundColor: "#fff1e6",
    borderWidth: 1,
    borderColor: "#fdba74",
  },
  secondaryTagLabel: {
    color: "#c2410c",
  },
  inlineActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginTop: 6,
  },
  link: {
    color: "#f97316",
    fontWeight: "700",
  },
  dangerLink: {
    color: "#dc2626",
  },
  formCard: {
    backgroundColor: "#fff7ed",
    borderWidth: 1,
    borderColor: "#fed7aa",
    borderRadius: 14,
    padding: 14,
    gap: 12,
    marginBottom: 12,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#7c2d12",
  },
  formField: {
    gap: 6,
  },
  formRow: {
    flexDirection: "row",
    gap: 12,
  },
  formLabel: {
    color: "#92400e",
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#fed7aa",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#7c2d12",
  },
  selectInput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  selectValue: {
    color: "#7c2d12",
    fontWeight: "600",
  },
  chevron: {
    color: "#a16207",
    fontWeight: "700",
    fontSize: 16,
  },
  selectMenu: {
    marginTop: 6,
    borderWidth: 1,
    borderColor: "#fed7aa",
    borderRadius: 10,
    backgroundColor: "#ffffff",
    overflow: "hidden",
    shadowColor: "#f97316",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  selectOption: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#fff1e6",
  },
  optionLabel: {
    color: "#7c2d12",
    fontWeight: "600",
  },
  selectedOption: {
    color: "#f97316",
  },
  formActions: {
    flexDirection: "row",
    gap: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: "#f97316",
    borderRadius: 12,
    alignItems: "center",
  },
  ghostButton: {
    backgroundColor: "#fff1e6",
    borderWidth: 1,
    borderColor: "#fdba74",
  },
  actionButtonLabel: {
    color: "#ffffff",
    fontWeight: "700",
  },
  ghostLabel: {
    color: "#c2410c",
  },
  chartSection: {
    marginTop: 16,
  },
  chartList: {
    paddingVertical: 8,
    gap: 14,
  },
  chartItem: {
    width: 120,
    marginRight: 14,
    alignItems: "center",
    gap: 8,
  },
  chartBarShell: {
    height: 180,
    width: "100%",
    borderRadius: 16,
    backgroundColor: "#fff7ed",
    borderWidth: 1,
    borderColor: "#fed7aa",
    justifyContent: "flex-end",
    padding: 10,
      position: "relative",
    overflow: "visible",
    alignItems: "center",
  },
  chartBar: {
    width: "100%",
    borderRadius: 12,
    backgroundColor: "#f97316",
    justifyContent: "flex-end",
    paddingBottom: 6,
    alignItems: "center",
    shadowColor: "#f97316",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 4,
  },
   chartValueBadge: {
    position: "absolute",
    top: -10,
    paddingHorizontal: 8,
    paddingVertical: 4,
        backgroundColor: "#7c2d12",
    borderRadius: 10,
     shadowColor: "#7c2d12",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 2,
  },
  chartValueText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 12,
  },
  chartName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#7c2d12",
    textAlign: "center",
  },
  chartMeta: {
    fontSize: 12,
    color: "#a16207",
    textAlign: "center",
  },
});

export default AdminDashboardScreen;
