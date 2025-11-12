import React, { useMemo } from "react";
import {
  Dimensions,
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";

import { useCart } from "../../context/CartContext.jsx";

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

const SHEET_MAX_HEIGHT = Math.round(
  Math.min(Dimensions.get("window").height * 0.8, 620)
);

const CartPreviewModal = ({ visible, onClose, onCheckout }) => {
  const { items, subtotal, removeFromCart } = useCart();

  const itemCountLabel = useMemo(() => {
    if (!Array.isArray(items) || items.length === 0) {
      return "Giỏ hàng trống";
    }

    if (items.length === 1) {
      return "1 sản phẩm trong giỏ";
    }

    return `${items.length} sản phẩm trong giỏ`;
  }, [items]);

  const handleCheckout = () => {
    if (typeof onCheckout === "function") {
      onCheckout();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
        <View style={styles.sheetContainer}>
          <View style={styles.sheet}>
            <View style={styles.header}>
              <View>
                <Text style={styles.headerTitle}>Giỏ hàng của bạn</Text>
                <Text style={styles.headerSubtitle}>{itemCountLabel}</Text>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeLabel}>×</Text>
              </TouchableOpacity>
            </View>
            {items.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>🛍️</Text>
                <Text style={styles.emptyTitle}>Giỏ hàng đang trống</Text>
                <Text style={styles.emptyDescription}>
                  Thêm món yêu thích của bạn để bắt đầu đặt hàng nhé!
                </Text>
              </View>
            ) : (
              <ScrollView
                style={styles.itemsList}
                contentContainerStyle={styles.itemsContent}
                showsVerticalScrollIndicator={false}
              >
                {items.map((item) => (
                  <View key={item.product.id} style={styles.itemRow}>
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemName}>{item.product.name}</Text>
                      <Text style={styles.itemQuantity}>Số lượng: x{item.quantity}</Text>
                    </View>
                    <View style={styles.itemMeta}>
                      <Text style={styles.itemPrice}>
                        {formatCurrency(item.product.price)}
                      </Text>
                      <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => removeFromCart(item.product.id)}
                      >
                        <Text style={styles.removeLabel}>Xóa</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </ScrollView>
            )}
            <View style={styles.footer}>
              <View style={styles.subtotalRow}>
                <Text style={styles.subtotalLabel}>Tạm tính</Text>
                <Text style={styles.subtotalValue}>{formatCurrency(subtotal)}</Text>
              </View>
              <View style={styles.actionsRow}>
                <TouchableOpacity
                  style={styles.secondaryButton}
                  activeOpacity={0.85}
                  onPress={onClose}
                >
                  <Text style={styles.secondaryLabel}>Mua thêm món</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.primaryButton, items.length === 0 && styles.primaryButtonDisabled]}
                  activeOpacity={0.85}
                  onPress={handleCheckout}
                  disabled={items.length === 0}
                >
                  <Text style={styles.primaryLabel}>Đi đến thanh toán</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  overlay: {
    flex: 1,
  },
  sheetContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  sheet: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    maxHeight: SHEET_MAX_HEIGHT,
    shadowColor: "#000000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: -8 },
    shadowRadius: 24,
    elevation: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f1f24",
  },
  headerSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: "#6b6b75",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
  },
  closeLabel: {
    fontSize: 22,
    lineHeight: 22,
    color: "#262626",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
    gap: 12,
  },
  emptyIcon: {
    fontSize: 40,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1f1f24",
  },
  emptyDescription: {
    fontSize: 13,
    color: "#6b6b75",
    textAlign: "center",
    paddingHorizontal: 24,
  },
  itemsList: {
    marginTop: 20,
  },
  itemsContent: {
    paddingBottom: 8,
    gap: 16,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  itemInfo: {
    flex: 1,
    gap: 6,
  },
  itemName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1f1f24",
  },
  itemQuantity: {
    fontSize: 13,
    color: "#6b6b75",
  },
  itemMeta: {
    alignItems: "flex-end",
    gap: 8,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1f1f24",
  },
  removeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: "#fee2e2",
  },
  removeLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#b91c1c",
  },
  footer: {
    marginTop: 24,
    gap: 16,
  },
  subtotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  subtotalLabel: {
    fontSize: 15,
    color: "#4a4a55",
  },
  subtotalValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f1f24",
  },
  actionsRow: {
    flexDirection: "row",
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#f97316",
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#f97316",
  },
  primaryButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: "#f97316",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonDisabled: {
    backgroundColor: "#fed7aa",
  },
  primaryLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#ffffff",
  },
});

export default CartPreviewModal;
