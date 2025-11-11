import React, { useCallback, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import { menuCategories, menuItems } from "../data/menu";
import ProductQuickView from "../components/ProductQuickView.jsx";

const currencyFormatter = new Intl.NumberFormat("vi-VN");

const MenuItemCard = ({ item, onPressAdd }) => (
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
      <TouchableOpacity
        style={styles.addButton}
        activeOpacity={0.85}
        onPress={() => onPressAdd?.(item)}
      >
        <Text style={styles.addButtonLabel}>Thêm</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const MenuScreen = () => {
  const [activeCategory, setActiveCategory] = useState(
    menuCategories[0]?.id ?? null
  );
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);

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

  const handleOpenQuickView = useCallback((item) => {
    setSelectedItem(item);
    setSelectedQuantity(1);
  }, []);

  const handleCloseQuickView = useCallback(() => {
    setSelectedItem(null);
  }, []);

  const handleIncreaseQuantity = useCallback(() => {
    setSelectedQuantity((qty) => qty + 1);
  }, []);

  const handleDecreaseQuantity = useCallback(() => {
    setSelectedQuantity((qty) => (qty > 1 ? qty - 1 : qty));
  }, []);

  const handleAddToCart = useCallback(() => {
    if (selectedItem) {
      Alert.alert(
        "Đã thêm vào giỏ hàng",
        `${selectedQuantity} x ${selectedItem.name}`
      );
    }
    setSelectedItem(null);
  }, [selectedItem, selectedQuantity]);

  return (
    <View style={styles.screen}>
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
                <Text style={styles.sectionHeading}>
                  {activeCategoryData.title}
                </Text>
                <Text style={styles.sectionSubheading}>
                  {activeCategoryData.description}
                </Text>
              </View>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <MenuItemCard item={item} onPressAdd={handleOpenQuickView} />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              Danh mục đang được cập nhật, vui lòng quay lại sau.
            </Text>
          </View>
        }
      />
      <ProductQuickView
        visible={Boolean(selectedItem)}
        product={selectedItem}
        quantity={selectedQuantity}
        onClose={handleCloseQuickView}
        onIncreaseQuantity={handleIncreaseQuantity}
        onDecreaseQuantity={handleDecreaseQuantity}
        onAddToCart={handleAddToCart}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
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
