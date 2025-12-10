import React, { useCallback, useEffect } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const AUTO_DISMISS_DURATION = 1600;

const CartSuccessModal = ({
  visible,
  productName,
  quantity,
  onDismiss,
  onClose,
}) => {
  const handleDismiss = useCallback(() => {
    if (typeof onDismiss === "function") {
      onDismiss();
    } else if (typeof onClose === "function") {
      onClose();
    }
  }, [onClose, onDismiss]);

  useEffect(() => {
    if (!visible) {
      return undefined;
    }

    const timeout = setTimeout(() => {
      handleDismiss();
    }, AUTO_DISMISS_DURATION);

    return () => clearTimeout(timeout);
  }, [visible, handleDismiss]);

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={handleDismiss}
    >
      <TouchableWithoutFeedback onPress={handleDismiss}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.container}>
              <View style={styles.iconWrapper}>
                <Text style={styles.icon}>✓</Text>
              </View>
              <Text style={styles.title}>Đã thêm vào giỏ hàng</Text>
              <Text style={styles.message}>
                {quantity} x {productName ?? "Món ăn"}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.25)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  container: {
    width: "100%",
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 20,
    backgroundColor: "#ffffff",
    alignItems: "center",
    gap: 10,
  },
  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#dcfce7",
  },
  icon: {
    fontSize: 28,
    color: "#16a34a",
    fontWeight: "700",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1b1b1f",
    textAlign: "center",
  },
  message: {
    fontSize: 14,
    color: "#4a4a55",
    textAlign: "center",
  },
});

export default CartSuccessModal;
