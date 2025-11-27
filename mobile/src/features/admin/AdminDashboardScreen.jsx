import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { deleteOrder, fetchCollection, updateOrder } from "../../utils/api";

const normalizeOrders = (orders = []) => {
  return orders.map((order, index) => {
    const total =
      Number(order?.totalAmount) ||
      Number(order?.total) ||
      Number(order?.subtotal) ||
      0;

    const status = String(order?.status?.label ?? order?.status ?? "").trim();

    return {
      id: order?.id || order?.code || `ORD-${index + 1}`,
      customer:
        order?.customer?.name ||
        order?.customerName ||
        order?.customer ||
        "Khách lẻ",
      total,
      status: status || "Đang xử lý",
      restaurant:
        order?.restaurantName || order?.restaurant || order?.vendor || "FCO",
    };
  });
};

const calculateRevenue = (orders = []) =>
  orders.reduce((sum, order) => sum + (Number(order.total) || 0), 0);

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

const AdminDashboardScreen = ({ user, onBack }) => {
  const [orders, setOrders] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [orderForm, setOrderForm] = useState({
    id: "",
    customer: "",
    restaurant: "",
    status: "Đang xử lý",
    total: "",
  });

  const refreshData = useCallback(() => {
    let active = true;

    const loadData = async () => {
      try {
        const [orderResponse, restaurantResponse, userResponse] =
          await Promise.all([
            fetchCollection("orders").catch(() => []),
            fetchCollection("restaurants").catch(() => []),
            fetchCollection("users").catch(() => []),
          ]);

        if (!active) return;

        setOrders(
          normalizeOrders(Array.isArray(orderResponse) ? orderResponse : [])
        );
        setRestaurants(
          Array.isArray(restaurantResponse) ? restaurantResponse : []
        );
        setUsers(Array.isArray(userResponse) ? userResponse : []);
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
    }, 15000);

    return () => {
      if (cleanup) cleanup();
      clearInterval(interval);
    };
  }, [refreshData]);

  const activeOrders = useMemo(
    () =>
      orders.filter((order) =>
        String(order.status).toLowerCase().match(/giao|chuẩn|xác nhận/)
      ),
    [orders]
  );

  const revenue = useMemo(() => calculateRevenue(orders), [orders]);

  const handleEditOrder = (order) => {
    setEditingOrderId(order.id);
    setOrderForm({
      id: order.id,
      customer: order.customer ?? "",
      restaurant: order.restaurant ?? "",
      status: order.status ?? "Đang xử lý",
      total: order.total ? String(order.total) : "",
    });
  };

  const resetOrderForm = () => {
    setEditingOrderId(null);
    setOrderForm({
      id: "",
      customer: "",
      restaurant: "",
      status: "Đang xử lý",
      total: "",
    });
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
    { key: "restaurants", label: "Nhà hàng" },
    { key: "customers", label: "Khách hàng" },
  ];

  return (
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
        <View style={styles.cardGrid}>
          <View style={[styles.card, styles.primaryCard]}>
            <Text style={styles.cardLabel}>Tổng đơn</Text>
            <Text style={styles.cardValue}>{orders.length}</Text>
            <Text style={styles.cardHint}>{activeOrders.length} đang xử lý</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Doanh thu</Text>
            <Text style={styles.cardValue}>
              {new Intl.NumberFormat("vi-VN").format(revenue)} đ
            </Text>
            <Text style={styles.cardHint}>Từ web & mobile</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Nhà hàng</Text>
            <Text style={styles.cardValue}>{restaurants.length}</Text>
            <Text style={styles.cardHint}>Đang hoạt động</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Khách hàng</Text>
            <Text style={styles.cardValue}>{customerAccounts.length}</Text>
            <Text style={styles.cardHint}>Đăng ký web & mobile</Text>
          </View>
        </View>
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
                <TextInput
                  style={styles.input}
                  placeholder="Đang xử lý"
                  value={orderForm.status}
                  onChangeText={(text) =>
                    setOrderForm((prev) => ({ ...prev, status: text }))
                  }
                />
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
            orders.slice(0, 6).map((order) => (
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

      {activeTab === "restaurants" && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nhà hàng</Text>
          {restaurants.length === 0 ? (
            <Text style={styles.emptyText}>Chưa có dữ liệu nhà hàng.</Text>
          ) : (
            restaurants.slice(0, 5).map((restaurant) => (
              <View key={restaurant.id} style={styles.listItem}>
                <View style={styles.listTextGroup}>
                  <Text style={styles.itemTitle}>{restaurant.name}</Text>
                  <Text style={styles.itemSubtitle}>{restaurant.city}</Text>
                </View>
                <View style={[styles.tag, styles.secondaryTag]}>
                  <Text style={[styles.tagLabel, styles.secondaryTagLabel]}>
                    {restaurant.deliveryTime || "15-30 phút"}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>
      )}

      {activeTab === "customers" && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Khách hàng mới</Text>
          {customerAccounts.length === 0 ? (
            <Text style={styles.emptyText}>Chưa có khách hàng nào.</Text>
          ) : (
            customerAccounts.slice(0, 6).map((customer) => (
              <View key={customer.id} style={styles.listItem}>
                <View style={styles.listTextGroup}>
                  <Text style={styles.itemTitle}>{customer.name}</Text>
                  <Text style={styles.itemSubtitle}>{customer.email}</Text>
                  <Text style={styles.itemSubtitle}>{customer.phone}</Text>
                </View>
                <View style={[styles.tag, styles.secondaryTag]}>
                  <Text style={[styles.tagLabel, styles.secondaryTagLabel]}>
                    {customer.tier}
                  </Text>
                </View>
                <Text style={styles.itemValue}>{formatDate(customer.joinedAt)}</Text>
              </View>
            ))
          )}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#7c2d12",
    marginBottom: 12,
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
});

export default AdminDashboardScreen;
