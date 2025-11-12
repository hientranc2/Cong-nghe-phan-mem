import React from "react";
import { View, StyleSheet } from "react-native";

import ProductCard from "./ProductCard";

const ProductGrid = ({ products, onProductPress, onAddToCart, variant = "grid" }) => (
  <View style={styles.grid}>
    {products.map((product) => (
      <ProductCard
        key={product.id}
        product={product}
        onPressImage={onProductPress}
        onPressAdd={(item) => onAddToCart?.(item, 1)}
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
