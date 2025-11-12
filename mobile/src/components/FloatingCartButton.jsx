import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";

import { useCart } from "../context/CartContext.jsx";

const FloatingCartButton = () => {
  const { totalItems } = useCart();
  const hasItems = totalItems > 0;

  return (
    <TouchableOpacity style={styles.button} activeOpacity={0.85}>
      <Text style={styles.icon}>🛒</Text>
      {hasItems ? (
        <View style={styles.badge}>
          <Text style={styles.badgeLabel}>{totalItems}</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    right: 24,
    bottom: 108,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#f97316",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0a0a0aff",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 24,
    elevation: 8,
  },
  icon: {
    fontSize: 24,
    color: "#161515ff",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#ef4444",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  badgeLabel: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "700",
  },
});

export default FloatingCartButton;
