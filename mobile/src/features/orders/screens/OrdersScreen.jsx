import React from "react";
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from "react-native";

import OrderCard from "../components/OrderCard.jsx";
import { activeOrders } from "../data/orders.js";

const OrdersScreen = ({ onBackToHome, onActionPress }) => {
  const handleBack = () => {
    if (typeof onBackToHome === "function") {
      onBackToHome();
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.hero}>
        <View style={styles.heroTextGroup}>
          <Text style={styles.title}>Đơn hàng đã đặt</Text>
          <Text style={styles.subtitle}>
            Theo dõi các đơn đã xác nhận và xem hành trình giao hàng trực tiếp.
          </Text>
        </View>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.85}
        >
          <Text style={styles.backButtonText}>Về trang chủ</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        {activeOrders.length > 0 ? (
          activeOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onActionPress={onActionPress}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>Bạn chưa có đơn hàng nào</Text>
            <Text style={styles.emptyStateSubtitle}>
              Khi đặt món, thông tin đơn sẽ xuất hiện tại đây để bạn tiện theo dõi.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff8f2",
  },
  content: {
    padding: 24,
    paddingBottom: 160,
    gap: 20,
  },
  hero: {
    backgroundColor: "#fff0e6",
    padding: 24,
    borderRadius: 28,
    shadowColor: "#f97316",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 16 },
    shadowRadius: 28,
    elevation: 5,
    gap: 18,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  heroTextGroup: {
    gap: 8,
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#a63b05",
  },
  subtitle: {
    fontSize: 14,
    color: "#fb923c",
    lineHeight: 20,
  },
  backButton: {
    alignSelf: "flex-start",
    backgroundColor: "#ffffff",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#f97316",
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#f97316",
  },
  section: {
    gap: 18,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 32,
    borderWidth: 1,
    borderColor: "#ffe8d9",
    gap: 8,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#a63b05",
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: "#fb923c",
    textAlign: "center",
    lineHeight: 20,
  },
});

export default OrdersScreen;
