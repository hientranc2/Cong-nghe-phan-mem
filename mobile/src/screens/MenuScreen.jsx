import React, { useMemo, useState } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import ProductCard from "../components/product/ProductCard";
import { menuCategories, menuItems } from "../data/menu";

const MenuScreen = ({ onProductPress, onAddToCart }) => {
  const [activeCategory, setActiveCategory] = useState(
    menuCategories[0]?.id ?? null
  );

  const activeCategoryData = useMemo(
    () =>
      menuCategories.find((category) => category.id === activeCategory) ?? null,
    [activeCategory]
  );

  const filteredItems = useMemo(() => {
    if (!activeCategory) {
      return [];
    }

    return menuItems.filter((item) => item.categoryId === activeCategory);
  }, [activeCategory]);

  const [headerHeight, setHeaderHeight] = useState(220);

  return (
    <View style={styles.container}>
      <View
        style={styles.stickyHeader}
        onLayout={({ nativeEvent }) => setHeaderHeight(nativeEvent.layout.height)}
      >
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
                activeOpacity={0.85}
              >
                <View style={styles.categoryContent}>
                  <Text style={styles.categoryIcon}>{category.icon}</Text>
                  <View style={styles.categoryTextGroup}>
                    <Text
                      style={[
                        styles.categoryLabel,
                        isActive && styles.categoryLabelActive
                      ]}
                    >
                      {category.title}
                    </Text>
                    <Text
                      numberOfLines={2}
                      style={[
                        styles.categoryDescription,
                        isActive && styles.categoryDescriptionActive
                      ]}
                    >
                      {category.description}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        {activeCategoryData && (
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeading}>{activeCategoryData.title}</Text>
            <Text style={styles.sectionSubheading}>
              {activeCategoryData.description}
            </Text>
          </View>
        )}
      </View>
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.cardRow}
        contentContainerStyle={[
          styles.listContent,
          { paddingTop: headerHeight + 16 },
        ]}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPressImage={onProductPress}
            onPressAdd={(product) => onAddToCart?.(product, 1)}
            variant="menu"
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              Danh mục đang được cập nhật, vui lòng quay lại sau.
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff8f2",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 160,
  },
  stickyHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 12,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: "#fff8f2",
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
    zIndex: 20,
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
    width: 260,
    paddingHorizontal: 18,
    paddingVertical: 18,
    borderRadius: 24,
    backgroundColor: "#f4f4f5",
  },
  categoryChipActive: {
    backgroundColor: "#f97316",
  },
  categoryContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
  },
  categoryIcon: {
    fontSize: 28,
    lineHeight: 32,
  },
  categoryTextGroup: {
    flex: 1,
    gap: 6,
  },
  categoryLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#18181b",
  },
  categoryLabelActive: {
    color: "#ffffff",
  },
  categoryDescription: {
    fontSize: 13,
    color: "#52525b",
  },
  categoryDescriptionActive: {
    color: "#fff7ed",
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
  emptyState: {
    paddingVertical: 32,
  },
  emptyStateText: {
    textAlign: "center",
    color: "#6b7280",
  },
});

export default MenuScreen;
