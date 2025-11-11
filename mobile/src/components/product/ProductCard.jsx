import React, { memo } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

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

const ProductCard = ({
  product,
  onPressImage,
  onPressAdd,
  variant = "grid",
}) => {
  const handleImagePress = () => {
    onPressImage?.(product);
  };

  const handleAddPress = () => {
    onPressAdd?.(product);
  };

  const descriptionLines = variant === "menu" ? 3 : 2;
  const imageHeight = variant === "menu" ? 140 : 120;

  return (
    <View style={[styles.card, variant === "menu" && styles.cardMenu]}>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handleImagePress}
        style={[styles.imageWrapper, { height: imageHeight }]}
      >
        <Image source={{ uri: product.image }} style={styles.image} />
      </TouchableOpacity>
      <View style={styles.cardBody}>
        {product.tag ? <Text style={styles.tag}>{product.tag}</Text> : null}
        <Text style={styles.name}>{product.name}</Text>
        {product.description ? (
          <Text numberOfLines={descriptionLines} style={styles.description}>
            {product.description}
          </Text>
        ) : null}
      </View>
      <View style={styles.cardFooter}>
        <Text style={styles.price}>
          {formatCurrency(
            typeof product.price === "number" ? product.price : null
          )}
        </Text>
        <TouchableOpacity
          style={styles.addButton}
          activeOpacity={0.85}
          onPress={handleAddPress}
        >
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
    flexBasis: "48%",
    flexGrow: 1,
  },
  cardMenu: {
    minWidth: 160,
  },
  imageWrapper: {
    width: "100%",
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  cardBody: {
    paddingHorizontal: 14,
    paddingTop: 12,
    gap: 6,
  },
  tag: {
    fontSize: 12,
    fontWeight: "600",
    color: "#f04e23",
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1b1b1f",
  },
  description: {
    marginTop: 2,
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
