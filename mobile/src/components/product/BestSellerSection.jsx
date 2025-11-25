import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import ProductGrid from "./ProductGrid";

const BestSellerSection = ({
  onProductPress,
  onAddToCart,
  products = [],
}) => (
  <View style={styles.container}>
    <View style={styles.headerRow}>
      <View>
        <Text style={styles.title}>Món bán chạy tại FCO</Text>
        <Text style={styles.subtitle}>
          Chọn món yêu thích và thêm vào giỏ trong một chạm.
        </Text>
      </View>
      <TouchableOpacity>
        <Text style={styles.link}>Xem tất cả</Text>
      </TouchableOpacity>
    </View>

    <ProductGrid
      products={products}
      onProductPress={onProductPress}
      onAddToCart={onAddToCart}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1b1b1f",
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: "#4a4a55",
    maxWidth: 220,
  },
  link: {
    fontSize: 14,
    fontWeight: "600",
    color: "#f04e23",
  },
});

export default BestSellerSection;
