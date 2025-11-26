import React, { useEffect, useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { fetchCollection } from "../../utils/api";

const normalizeOrders = (orders = []) =>
  orders.map((order, index) => {
    const total =
      Number(order?.totalAmount) ||
      Number(order?.total) ||
      Number(order?.subtotal) ||
      0;
    const status = String(order?.status?.label ?? order?.status ?? "").trim();

    return {
      id: order?.id || order?.code || `ORD-${index + 1}`,
      customer:
        order?.customer?.name || order?.customerName || order?.customer || "Khách",
      total,
      status: status || "Đang xử lý",
      items: Array.isArray(order?.items) ? order.items.length : order?.items || 0,
    };
  });

const normalizeMenu = (items = []) =>
  items.map((item, index) => ({
    id: item?.id || `dish-${index + 1}`,
    name: item?.name || item?.title || "Món mới",
    price: Number(item?.price) || 0,
    status: String(item?.status || "available").toLowerCase(),
    tag: item?.tag || item?.badge || item?.category || "",
  }));

const RestaurantDashboardScreen = ({ user, onBack }) => {
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    let active = true;

    const loadData = async () => {
      try {
        const [orderResponse, menuResponse] = await Promise.all([
          fetchCollection("orders").catch(() => []),
          fetchCollection("menuItems").catch(() => []),
        ]);

        if (!active) return;

        setOrders(normalizeOrders(Array.isArray(orderResponse) ? orderResponse : []));
        setMenuItems(normalizeMenu(Array.isArray(menuResponse) ? menuResponse : []));
      } catch (error) {
        console.warn("Không thể đồng bộ dữ liệu nhà hàng trên mobile", error);
      }
    };

    loadData();

    return () => {
      active = false;
    };
  }, []);

  const activeOrders = useMemo(
    () =>
      orders.filter((order) =>
        String(order.status).toLowerCase().match(/giao|chuẩn|xác nhận/)
      ),
    [orders]
  );

  const availableDishes = useMemo(
    () => menuItems.filter((item) => item.status !== "soldout"),
    [menuItems]
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backIcon}>←</Text>
          <Text style={styles.backLabel}>Quay lại</Text>
        </TouchableOpacity>

        <View>
          <Text style={styles.heading}>Quản lý nhà hàng</Text>
          <Text style={styles.subheading}>{user?.name || "Restaurant"}</Text>
        </View>
      </View>

      <View style={styles.cardGrid}>
        <View style={[styles.card, styles.primaryCard]}>
          <Text style={styles.cardLabel}>Đơn đang xử lý</Text>
          <Text style={styles.cardValue}>{activeOrders.length}</Text>
          <Text style={styles.cardHint}>Từ web và mobile</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Tổng đơn</Text>
          <Text style={styles.cardValue}>{orders.length}</Text>
          <Text style={styles.cardHint}>Bao gồm lịch sử</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Món đang bán</Text>
          <Text style={styles.cardValue}>{availableDishes.length}</Text>
          <Text style={styles.cardHint}>Menu cập nhật theo web</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Đang tạm dừng</Text>
          <Text style={styles.cardValue}>{menuItems.length - availableDishes.length}</Text>
          <Text style={styles.cardHint}>Cần bật bán lại</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Đơn gần nhất</Text>
        {orders.length === 0 ? (
          <Text style={styles.emptyText}>Chưa có đơn hàng.</Text>
        ) : (
          orders.slice(0, 6).map((order) => (
            <View key={order.id} style={styles.listItem}>
              <View style={styles.listTextGroup}>
                <Text style={styles.itemTitle}>{order.id}</Text>
                <Text style={styles.itemSubtitle}>
                  {order.customer} • {order.items} món
                </Text>
              </View>
              <View style={[styles.tag, styles.secondaryTag]}>
                <Text style={[styles.tagLabel, styles.secondaryTagLabel]}>
                  {order.status}
                </Text>
              </View>
              <Text style={styles.itemValue}>
                {new Intl.NumberFormat("vi-VN").format(order.total)} đ
              </Text>
            </View>
          ))
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Menu nổi bật</Text>
        {menuItems.length === 0 ? (
          <Text style={styles.emptyText}>Chưa có món ăn.</Text>
        ) : (
          menuItems.slice(0, 6).map((item) => (
            <View key={item.id} style={styles.listItem}>
              <View style={styles.listTextGroup}>
                <Text style={styles.itemTitle}>{item.name}</Text>
                <Text style={styles.itemSubtitle}>{item.tag}</Text>
              </View>
              <View
                style={[styles.tag, item.status === "soldout" && styles.dangerTag]}
              >
                <Text style={styles.tagLabel}>
                  {item.status === "soldout" ? "Hết hàng" : "Đang bán"}
                </Text>
              </View>
              <Text style={styles.itemValue}>
                {new Intl.NumberFormat("vi-VN").format(item.price)} đ
              </Text>
            </View>
          ))
        )}
      </View>
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
  dangerTag: {
    backgroundColor: "#fee2e2",
    borderWidth: 1,
    borderColor: "#fca5a5",
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
});

export default RestaurantDashboardScreen;

