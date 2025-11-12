import React, { memo } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

import { resolveImageSource } from "../../utils/image";

const ProductCard = ({ product, onPressImage }) => {
  const handleImagePress = () => {
    onPressImage?.(product);
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handleImagePress}
        style={styles.imageWrapper}
      >
        <Image
          source={resolveImageSource(product.image)}
          style={styles.image}
        />
      </TouchableOpacity>
      <View style={styles.cardBody}>
        <Text style={styles.tag}>{product.tag}</Text>
        <Text style={styles.name}>{product.name}</Text>
        <Text numberOfLines={2} style={styles.description}>
          {product.description}
        </Text>
      </View>
      <View style={styles.cardFooter}>
        <Text style={styles.price}>{product.price}k</Text>
        <TouchableOpacity style={styles.addButton} activeOpacity={0.85}>
          <Text style={styles.addLabel}>Thêm</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    overflow: "hidden",
    width: "47%",
  },
  imageWrapper: {
    width: "100%",
    height: 120,
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  cardBody: {
    paddingHorizontal: 14,
    paddingTop: 12,
  },
  tag: {
    fontSize: 12,
    fontWeight: "600",
    color: "#f04e23",
  },
  name: {
    marginTop: 6,
    fontSize: 16,
    fontWeight: "700",
    color: "#1b1b1f",
  },
  description: {
    marginTop: 8,
    fontSize: 13,
    color: "#4a4a55",
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  price: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1b1b1f",
  },
  addButton: {
    backgroundColor: "#ff5a1f",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  addLabel: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default memo(ProductCard);
