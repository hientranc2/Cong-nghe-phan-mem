import React from "react";
import { View, StyleSheet } from "react-native";

import ProductCard from "./ProductCard";

const ProductGrid = ({ products, onProductPress, variant = "grid" }) => (
  <View style={styles.grid}>
    {products.map((product) => (
      <ProductCard
        key={product.id}
        product={product}
        onPressImage={onProductPress}
        variant={variant}
      />
    ))}
  </View>
);

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
});

export default ProductGrid;
