import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const FloatingCartButton = () => (
  <TouchableOpacity style={styles.button}>
    <Text style={styles.icon}>🛒</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    right: 24,
    bottom: 108,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#1b1b1f",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 24,
    elevation: 8,
  },
  icon: {
    fontSize: 24,
    color: "#ffffff",
  },
});

export default FloatingCartButton;
