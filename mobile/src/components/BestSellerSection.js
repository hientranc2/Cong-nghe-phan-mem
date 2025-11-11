import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { bestSellers } from "../data/homepage";

const BestSellerSection = () => (
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
    <View style={styles.grid}>
      {bestSellers.map((item) => (
        <View key={item.id} style={styles.card}>
          <Image source={{ uri: item.image }} style={styles.image} />
          <View style={styles.cardBody}>
            <Text style={styles.tag}>{item.tag}</Text>
            <Text style={styles.name}>{item.name}</Text>
            <Text numberOfLines={2} style={styles.description}>
              {item.description}
            </Text>
          </View>
          <View style={styles.cardFooter}>
            <Text style={styles.price}>{item.price}k</Text>
            <TouchableOpacity style={styles.addButton}>
              <Text style={styles.addLabel}>Thêm</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
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
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    overflow: "hidden",
    width: "47%",
  },
  image: {
    width: "100%",
    height: 120,
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
    backgroundColor: "#1b1b1f",
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

export default BestSellerSection;
