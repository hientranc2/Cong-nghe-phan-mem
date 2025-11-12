import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const buttonVariants = StyleSheet.create({
  primary: {
    backgroundColor: "#f97316",
    borderColor: "#f97316",
  },
  secondary: {
    backgroundColor: "#ffe8d9",
    borderColor: "#ffe8d9",
  },
  ghost: {
    backgroundColor: "transparent",
    borderColor: "#f97316",
  },
});

const textVariants = StyleSheet.create({
  primary: {
    color: "#ffffff",
  },
  secondary: {
    color: "#f97316",
  },
  ghost: {
    color: "#f97316",
  },
});

const OrderCard = ({ order, onActionPress }) => {
  if (!order) {
    return null;
  }

  const statusColor = order.status?.color ?? "#f97316";

  const handlePress = (actionId) => {
    if (typeof onActionPress === "function") {
      onActionPress(actionId, order);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.orderCode}>{order.code}</Text>
        <View
          style={[
            styles.statusPill,
            { backgroundColor: `${statusColor}1a` },
          ]}
        >
          <View
            style={[styles.statusDot, { backgroundColor: statusColor }]}
          />
          <Text style={[styles.statusText, { color: statusColor }]}>
            Trạng thái: {order.status?.label ?? ""}
          </Text>
        </View>
      </View>
      <View style={styles.infoGroup}>
        <Text style={styles.infoLabel}>
          Đơn đặt tại: <Text style={styles.infoValue}>{order.restaurantName}</Text>
        </Text>
        <Text style={styles.infoLabel}>
          Ngày đặt: <Text style={styles.infoValue}>{order.placedAt}</Text>
        </Text>
        <Text style={styles.infoLabel}>
          Tổng thanh toán: <Text style={styles.infoValue}>{order.totalAmount}</Text>
        </Text>
        {order.status?.description ? (
          <Text style={styles.statusDescription}>{order.status.description}</Text>
        ) : null}
      </View>
      <View style={styles.actionsRow}>
        {order.actions?.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={[styles.actionButton, buttonVariants[action.variant] ?? buttonVariants.secondary]}
            onPress={() => handlePress(action.id)}
            activeOpacity={0.85}
          >
            <Text
              style={[styles.actionText, textVariants[action.variant] ?? textVariants.secondary]}
            >
              {action.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 20,
    shadowColor: "#f97316",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 18 },
    shadowRadius: 28,
    elevation: 6,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  orderCode: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1f1f23",
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
  },
  statusText: {
    fontSize: 13,
    fontWeight: "600",
  },
  infoGroup: {
    gap: 8,
    marginBottom: 20,
  },
  infoLabel: {
    fontSize: 14,
    color: "#4b5563",
    lineHeight: 20,
  },
  infoValue: {
    color: "#1f1f23",
    fontWeight: "600",
  },
  statusDescription: {
    marginTop: 4,
    fontSize: 13,
    color: "#f97316",
    fontWeight: "500",
  },
  actionsRow: {
    flexDirection: "row",
    gap: 12,
    flexWrap: "wrap",
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 999,
    borderWidth: 1,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },
});

export default OrderCard;
