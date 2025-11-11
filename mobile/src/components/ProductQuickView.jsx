import React, { useMemo } from "react";
import {
  Modal,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from "react-native";

const currencyFormatter = new Intl.NumberFormat("vi-VN");

const ProductQuickView = ({
  visible,
  product,
  quantity,
  onClose,
  onIncreaseQuantity,
  onDecreaseQuantity,
  onAddToCart,
}) => {
  const totalPrice = useMemo(() => {
    if (!product) {
      return 0;
    }

    return product.price * quantity;
  }, [product, quantity]);

  if (!product) {
    return null;
  }

  const disableDecrease = quantity <= 1;

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.imageWrapper}>
            <Image source={{ uri: product.image }} style={styles.productImage} />
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Đóng xem nhanh sản phẩm"
              onPress={onClose}
              style={styles.closeButton}
              activeOpacity={0.7}
            >
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.content}>
            <Text style={styles.title}>{product.name}</Text>
            <Text style={styles.description}>{product.description}</Text>

            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Số lượng</Text>
              <View style={styles.quantityControls}>
                <TouchableOpacity
                  onPress={onDecreaseQuantity}
                  disabled={disableDecrease}
                  style={[styles.stepperButton, disableDecrease && styles.stepperButtonDisabled]}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  accessibilityLabel="Giảm số lượng"
                >
                  <Text style={[styles.stepperLabel, disableDecrease && styles.stepperLabelDisabled]}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantityValue}>{quantity}</Text>
                <TouchableOpacity
                  onPress={onIncreaseQuantity}
                  style={styles.stepperButton}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  accessibilityLabel="Tăng số lượng"
                >
                  <Text style={styles.stepperLabel}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Thành tiền</Text>
              <Text style={styles.totalPrice}>
                {currencyFormatter.format(totalPrice)} đ
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.addToCartButton}
            onPress={onAddToCart}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Thêm sản phẩm vào giỏ hàng"
          >
            <Text style={styles.addToCartLabel}>Thêm vào giỏ hàng</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
  },
  sheet: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 16,
    gap: 20,
    maxHeight: "88%",
  },
  imageWrapper: {
    position: "relative",
    borderRadius: 20,
    overflow: "hidden",
    height: 220,
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  closeButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(24, 24, 27, 0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  closeIcon: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
  },
  content: {
    gap: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: "#4b5563",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1f2937",
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#f4f4f5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  stepperButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },
  stepperButtonDisabled: {
    backgroundColor: "#e4e4e7",
  },
  stepperLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#f97316",
  },
  stepperLabelDisabled: {
    color: "#a1a1aa",
  },
  quantityValue: {
    minWidth: 28,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: "700",
    color: "#f97316",
  },
  addToCartButton: {
    backgroundColor: "#f97316",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  addToCartLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
    textTransform: "uppercase",
  },
});

export default ProductQuickView;
