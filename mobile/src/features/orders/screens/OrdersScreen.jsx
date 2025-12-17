import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

import OrderCard from "../components/OrderCard.jsx";

const ACTIVE_STATUS = "Đang chờ";
const CANCELLED_STATUS = "Đã hủy";

const getStatusColor = (status) =>
  status === CANCELLED_STATUS ? "#ef4444" : "#f97316";

const getStatusLabel = (status) => {
  if (typeof status === "string") {
    return status;
  }

  if (status && typeof status === "object" && typeof status.label === "string") {
    return status.label;
  }

  return undefined;
};

const isCancelledStatus = (status) =>
  typeof status === "string" && status.toLowerCase().includes("hủy");

const buildActionsForStatus = (status) => {
  const actions = [
    { id: "cancel", label: "Hủy đơn hàng", variant: "secondary" },
    { id: "summary", label: "Xem tóm tắt", variant: "ghost" },
    { id: "track", label: "Theo dõi hành trình", variant: "primary" },
  ];

  if (status === CANCELLED_STATUS) {
    return actions.filter((action) => action.id === "summary");
  }

  return actions;
};

const normalizeOrders = (incomingOrders) =>
  (Array.isArray(incomingOrders) ? incomingOrders : [])
    .map((order) => {
      if (!order) {
        return null;
      }

      const statusLabel = getStatusLabel(order.status) ?? order.status;
      const isCancelled = isCancelledStatus(statusLabel);
      const status = isCancelled ? CANCELLED_STATUS : statusLabel ?? ACTIVE_STATUS;
      const hasCustomActions = Array.isArray(order.actions) && order.actions.length > 0;
      const baseActions = buildActionsForStatus(isCancelled ? CANCELLED_STATUS : ACTIVE_STATUS);

      return {
        ...order,
        status,
        statusColor:
          order.statusColor ??
          (order.status && typeof order.status === "object"
            ? order.status.color
            : undefined) ??
          getStatusColor(isCancelled ? CANCELLED_STATUS : ACTIVE_STATUS),
        actions: isCancelled ? baseActions : hasCustomActions ? order.actions : baseActions,
      };
    })
    .filter(Boolean);

const OrdersScreen = ({
  onBackToHome,
  onActionPress,
  orders: initialOrders = [],
  onOrdersChange,
}) => {
  const normalizedInitialOrders = useMemo(
    () => normalizeOrders(initialOrders),
    [initialOrders]
  );

  const [orders, setOrders] = useState(normalizedInitialOrders);

  useEffect(() => {
    setOrders(normalizedInitialOrders);
  }, [normalizedInitialOrders]);

  const updateOrdersState = useCallback(
    (updater) => {
      setOrders((previous) => {
        const nextState =
          typeof updater === "function" ? updater(previous) : updater;
        const safeNextState = Array.isArray(nextState)
          ? nextState
          : previous;

        if (typeof onOrdersChange === "function") {
          onOrdersChange(safeNextState);
        }

        return safeNextState;
      });
    },
    [onOrdersChange]
  );

  const handleBack = () => {
    if (typeof onBackToHome === "function") {
      onBackToHome();
    }
  };

  const handleAction = useCallback(
    (actionId, order) => {
      if (!order) {
        return;
      }

      if (actionId === "cancel") {
        let nextOrderSnapshot = order;

        updateOrdersState((prevOrders) =>
          prevOrders.map((item) => {
            if (item.id !== order.id) {
              return item;
            }

            if (item.status === CANCELLED_STATUS) {
              nextOrderSnapshot = item;
              return item;
            }

            const nextItem = {
              ...item,
              status: CANCELLED_STATUS,
              statusColor: getStatusColor(CANCELLED_STATUS),
              actions: buildActionsForStatus(CANCELLED_STATUS),
            };

            nextOrderSnapshot = nextItem;
            return nextItem;
          })
        );

        if (nextOrderSnapshot) {
          const codeLabel = nextOrderSnapshot.code ?? nextOrderSnapshot.id;
          Alert.alert(
            "Đơn hàng đã được hủy",
            codeLabel
              ? `Đơn ${codeLabel} đã được hủy thành công.`
              : "Đơn hàng của bạn đã được hủy thành công."
          );
        }

        if (typeof onActionPress === "function") {
          onActionPress(actionId, nextOrderSnapshot);
        }

        return;
      }

      if (typeof onActionPress === "function") {
        onActionPress(actionId, order);
      }
    },
    [onActionPress, updateOrdersState]
  );

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
            Theo dõi các đơn đã xác nhận và trạng thái drone giao hàng trong thời gian thực.
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
        {orders.length > 0 ? (
          orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onActionPress={handleAction}
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
