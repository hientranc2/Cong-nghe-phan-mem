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

const DEFAULT_ACTIVE_COLOR = "#f97316";
const CANCELLED_COLOR = "#ef4444";

const OrderCard = ({ order, onActionPress }) => {
  if (!order) {
    return null;
  }

  const statusLabel = order.status ?? "";
  const statusColor =
    order.statusColor ??
    (statusLabel === "Đã hủy" ? CANCELLED_COLOR : DEFAULT_ACTIVE_COLOR);
  const hasActions = Array.isArray(order.actions) && order.actions.length > 0;

  const handlePress = (actionId) => {
    if (typeof onActionPress === "function") {
      onActionPress(actionId, order);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerSection}>
        <View style={styles.statusWrapper}>
          <View
            style={[
              styles.statusPill,
              { borderColor: `${statusColor}33` },
            ]}
          >
            <View
              style={[styles.statusDot, { backgroundColor: statusColor }]}
            />
            <Text style={styles.statusText}>
              Trạng thái:
              <Text style={[styles.statusValue, { color: statusColor }]}> {statusLabel}</Text>
            </Text>
          </View>
        </View>
        <Text style={styles.orderCode}>{order.code ?? ""}</Text>
      </View>
      <View style={styles.infoGroup}>
        <Text style={styles.infoLabel}>
          Đơn đặt tại: <Text style={styles.infoValue}>{order.restaurantName ?? "—"}</Text>
        </Text>
        <Text style={styles.infoLabel}>
          Ngày đặt: <Text style={styles.infoValue}>{order.placedAt ?? "—"}</Text>
        </Text>
        <Text style={styles.infoLabel}>
          Tổng thanh toán: <Text style={styles.infoValue}>{order.totalAmount ?? "—"}</Text>
        </Text>
      </View>
      {hasActions ? (
        <View style={styles.actionsRow}>
          {order.actions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={[
                styles.actionButton,
                buttonVariants[action.variant] ?? buttonVariants.secondary,
              ]}
              onPress={() => handlePress(action.id)}
              activeOpacity={0.85}
            >
              <Text
                style={[
                  styles.actionText,
                  textVariants[action.variant] ?? textVariants.secondary,
                ]}
              >
                {action.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : null}
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
  headerSection: {
    marginBottom: 16,
  },
  statusWrapper: {
    alignItems: "flex-end",
    marginBottom: 10,
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
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    backgroundColor: "#ffffff",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
  },
  statusText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
  },
  statusValue: {
    fontWeight: "700",
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
