import React, { useMemo, useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import { menuCategories, menuItems } from "../data/menu";

const currencyFormatter = new Intl.NumberFormat("vi-VN");

const MenuItemCard = ({ item }) => (
  <View style={styles.card}>
    <Image source={{ uri: item.image }} style={styles.cardImage} />
    <View style={styles.cardBody}>
      <Text style={styles.cardTitle}>{item.name}</Text>
      <Text numberOfLines={2} style={styles.cardDescription}>
        {item.description}
      </Text>
    </View>
    <View style={styles.cardFooter}>
      <Text style={styles.cardPrice}>
        {currencyFormatter.format(item.price)} đ
      </Text>
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonLabel}>Thêm</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const MenuScreen = () => {
  const [activeCategory, setActiveCategory] = useState(
    menuCategories[0]?.id ?? null
  );

  const filteredItems = useMemo(() => {
    if (!activeCategory || activeCategory === "all") {
      return menuItems;
    }
    return menuItems.filter((item) =>
      Array.isArray(item.categories)
        ? item.categories.includes(activeCategory)
        : item.categories === activeCategory
    );
  }, [activeCategory]);

  return (
    <FlatList
      data={filteredItems}
      keyExtractor={(item) => item.id}
      numColumns={2}
      showsVerticalScrollIndicator={false}
      columnWrapperStyle={styles.cardRow}
      contentContainerStyle={styles.listContent}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.sectionTitle}>Danh mục</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryRow}
          >
            {menuCategories.map((category) => {
              const isActive = category.id === activeCategory;
              return (
                <TouchableOpacity
                  key={category.id}
                  style={[styles.categoryChip, isActive && styles.categoryChipActive]}
                  onPress={() => setActiveCategory(category.id)}
                >
                  <Text
                    style={[
                      styles.categoryLabel,
                      isActive && styles.categoryLabelActive
                    ]}
                  >
                    {category.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeading}>Món ngon phải thử</Text>
            <Text style={styles.sectionSubheading}>Deal ngon mỗi ngày</Text>
          </View>
        </View>
      }
      renderItem={({ item }) => <MenuItemCard item={item} />}
      ListEmptyComponent={
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>Chưa có món nào trong danh mục này.</Text>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 160,
  },
  header: {
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1b1b1f",
    marginBottom: 12,
  },
  categoryRow: {
    gap: 12,
    paddingVertical: 4,
  },
  categoryChip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "#f4f4f5",
  },
  categoryChipActive: {
    backgroundColor: "#f97316",
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#52525b",
  },
  categoryLabelActive: {
    color: "#ffffff",
  },
  sectionHeaderRow: {
    marginTop: 20,
  },
  sectionHeading: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1b1b1f",
  },
  sectionSubheading: {
    marginTop: 6,
    fontSize: 14,
    color: "#71717a",
  },
  cardRow: {
    gap: 16,
    marginBottom: 16,
  },
  card: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 20,
    elevation: 3,
  },
  cardImage: {
    width: "100%",
    height: 140,
  },
  cardBody: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1f2937",
  },
  cardDescription: {
    marginTop: 8,
    fontSize: 13,
    color: "#4b5563",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1f2937",
  },
  addButton: {
    backgroundColor: "#f97316",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  addButtonLabel: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyState: {
    paddingVertical: 32,
  },
  emptyStateText: {
    textAlign: "center",
    color: "#6b7280",
  },
});

export default MenuScreen;
