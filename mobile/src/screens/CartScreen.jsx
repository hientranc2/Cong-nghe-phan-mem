import React, { useCallback, useMemo } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useCart } from "../context/CartContext.jsx";

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

const CartScreen = ({ onBack, onCheckout }) => {
  const { items, subtotal, totalItems, updateQuantity, removeFromCart } = useCart();
  const hasItems = items.length > 0;

  const handleIncrease = useCallback(
    (productId, currentQuantity) => {
      updateQuantity(productId, currentQuantity + 1);
    },
    [updateQuantity]
  );

  const handleDecrease = useCallback(
    (productId, currentQuantity) => {
      if (currentQuantity > 1) {
        updateQuantity(productId, currentQuantity - 1);
        return;
      }

      removeFromCart(productId);
    },
    [removeFromCart, updateQuantity]
  );

  const handleCheckout = useCallback(() => {
    if (!hasItems) {
      return;
    }

    onCheckout?.();
  }, [hasItems, onCheckout]);

  const summary = useMemo(
    () => ({
      subtotal,
      totalItems,
    }),
    [subtotal, totalItems]
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onBack}
          style={styles.backButton}
          activeOpacity={0.85}
        >
          <Text style={styles.backLabel}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Giỏ hàng của bạn</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {!hasItems ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Giỏ hàng đang trống</Text>
            <Text style={styles.emptyDescription}>
              Hãy quay lại chọn món ngon và thêm vào giỏ hàng nhé!
            </Text>
          </View>
        ) : (
          items.map((item) => {
            const price = Number(item?.product?.price ?? 0);
            const lineTotal = price * (item?.quantity ?? 0);

            return (
              <View key={item.product.id} style={styles.itemRow}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.product.name}</Text>
                  <Text style={styles.itemPrice}>{formatCurrency(price)}</Text>
                </View>
                <View style={styles.itemActions}>
                  <View style={styles.quantityControl}>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => handleDecrease(item.product.id, item.quantity)}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.quantityLabel}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantityValue}>{item.quantity}</Text>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => handleIncrease(item.product.id, item.quantity)}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.quantityLabel}>+</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.lineTotalWrapper}>
                    <Text style={styles.lineTotal}>{formatCurrency(lineTotal)}</Text>
                    <TouchableOpacity
                      onPress={() => removeFromCart(item.product.id)}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.removeLabel}>Xóa</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      <View style={styles.summaryBar}>
        <View>
          <Text style={styles.summaryLabel}>Tổng {summary.totalItems} món</Text>
          <Text style={styles.summaryValue}>{formatCurrency(summary.subtotal)}</Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={onBack}
            activeOpacity={0.9}
          >
            <Text style={[styles.actionLabel, styles.secondaryLabel]}>Mua thêm món</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, !hasItems && styles.disabledButton]}
            onPress={handleCheckout}
            disabled={!hasItems}
            activeOpacity={0.9}
          >
            <Text style={styles.actionLabel}>Đi đến thanh toán</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff8f2",
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0a0a0a",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },
  backLabel: {
    fontSize: 20,
    color: "#111827",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  headerPlaceholder: {
    width: 40,
    height: 40,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 140,
  },
  emptyState: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginTop: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    color: "#6b7280",
  },
  itemRow: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#0a0a0a",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 2,
  },
  itemInfo: {
    marginBottom: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    color: "#f97316",
    fontWeight: "600",
  },
  itemActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  quantityControl: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 999,
    backgroundColor: "#fff1e6",
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityLabel: {
    fontSize: 18,
    fontWeight: "700",
    color: "#f97316",
  },
  quantityValue: {
    width: 36,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  lineTotalWrapper: {
    alignItems: "flex-end",
  },
  lineTotal: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  removeLabel: {
    fontSize: 14,
    color: "#ef4444",
    fontWeight: "600",
  },
  summaryBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: "#0a0a0a",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: -4 },
    shadowRadius: 12,
    elevation: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f97316",
  },
  actionLabel: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  secondaryButton: {
    backgroundColor: "#fff1e6",
  },
  secondaryLabel: {
    color: "#f97316",
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default CartScreen;
