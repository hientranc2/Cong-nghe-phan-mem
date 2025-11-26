import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { fetchCollection } from "../utils/api";

const normalizeRestaurant = (restaurant) => ({
  ...restaurant,
  image: restaurant.image ?? restaurant.img ?? restaurant.photo,
  city: restaurant.city ?? restaurant.location ?? "",
  deliveryTime: restaurant.deliveryTime ?? restaurant.time ?? "",
  menuItemIds: restaurant.menuItemIds ?? [],
});

const normalizeMenuItem = (item) => ({
  ...item,
  price: Number(item?.price) || 0,
  image: item?.image ?? item?.img ?? null,
  description: item?.description ?? item?.desc ?? "",
  restaurantId: item?.restaurantId ?? null,
  restaurantSlug: item?.restaurantSlug ?? null,
});

const formatCurrency = (value) =>
  `${(Number(value) || 0).toLocaleString("vi-VN")} đ`;

const RestaurantCard = ({
  name,
  description,
  badge,
  city,
  deliveryTime,
  tags,
  image,
  menuItems = [],
}) => (
  <View style={styles.card}>
    {image ? (
      <Image source={{ uri: image }} style={styles.cardImage} />
    ) : (
      <View style={[styles.cardImage, styles.imagePlaceholder]}>
        <Text style={styles.placeholderIcon}>🏬</Text>
      </View>
    )}
    <View style={styles.cardBody}>
      <View style={styles.titleRow}>
        <Text style={styles.cardTitle}>{name}</Text>
        {badge ? <Text style={styles.badge}>{badge}</Text> : null}
      </View>
      {description ? (
        <Text style={styles.cardContent} numberOfLines={2}>
          {description}
        </Text>
      ) : null}
      <View style={styles.metaRow}>
        {city ? (
          <Text style={styles.metaText}>
            <Text style={styles.metaIcon}>📍 </Text>
            {city}
          </Text>
        ) : null}
        {deliveryTime ? (
          <Text style={styles.metaText}>
            <Text style={styles.metaIcon}>⏱️ </Text>
            {deliveryTime}
          </Text>
        ) : null}
      </View>
      {Array.isArray(tags) && tags.length > 0 ? (
        <View style={styles.tagsRow}>
          {tags.map((tag) => (
            <Text key={tag} style={styles.tagChip}>
              {tag}
            </Text>
          ))}
        </View>
      ) : null}

      <View style={styles.menuSection}>
        <View style={styles.menuHeaderRow}>
          <Text style={styles.menuTitle}>Thực đơn nổi bật</Text>
          <Text style={styles.menuCount}>{menuItems.length} món</Text>
        </View>

        {menuItems.length > 0 ? (
          <View style={styles.menuList}>
            {menuItems.slice(0, 4).map((menu) => (
              <View key={menu.id} style={styles.menuItemRow}>
                <View style={styles.menuInfo}>
                  <Text style={styles.menuItemName} numberOfLines={1}>
                    {menu.name}
                  </Text>
                  {menu.tag ? <Text style={styles.menuTag}>{menu.tag}</Text> : null}
                  {menu.description ? (
                    <Text style={styles.menuDesc} numberOfLines={2}>
                      {menu.description}
                    </Text>
                  ) : null}
                  <Text style={styles.menuPrice}>{formatCurrency(menu.price)}</Text>
                </View>
                {menu.image ? (
                  <Image source={{ uri: menu.image }} style={styles.menuImage} />
                ) : (
                  <View style={[styles.menuImage, styles.miniPlaceholder]}>
                    <Text style={styles.placeholderIcon}>🍽️</Text>
                  </View>
                )}
              </View>
            ))}
            {menuItems.length > 4 ? (
              <Text style={styles.moreMenuText}>
                + {menuItems.length - 4} món khác trong thực đơn
              </Text>
            ) : null}
          </View>
        ) : (
          <Text style={styles.emptyMenuText}>
            Nhà hàng đang cập nhật món ăn mới.
          </Text>
        )}
      </View>
    </View>
  </View>
);

const RestaurantsScreen = () => {
  const [headerHeight, setHeaderHeight] = useState(200);
  const [restaurants, setRestaurants] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [restaurantResponse, menuResponse] = await Promise.all([
          fetchCollection("restaurants"),
          fetchCollection("menuItems"),
        ]);

        if (!active) return;

        const normalizedRestaurants = Array.isArray(restaurantResponse)
          ? restaurantResponse.map(normalizeRestaurant)
          : [];

        const normalizedMenu = Array.isArray(menuResponse)
          ? menuResponse.map(normalizeMenuItem)
          : [];

        setRestaurants(normalizedRestaurants);
        setMenuItems(normalizedMenu);
      } catch (err) {
        if (active) {
          setError("Không thể tải danh sách nhà hàng");
          setRestaurants([]);
          setMenuItems([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      active = false;
    };
  }, []);

  const menuByRestaurant = useMemo(() => {
    const map = new Map();

    restaurants.forEach((restaurant) => {
      const knownMenuIds = new Set(restaurant.menuItemIds ?? []);
      const items = menuItems.filter((item) => {
        if (item.restaurantId && item.restaurantId === restaurant.id) {
          return true;
        }

        if (
          item.restaurantSlug &&
          restaurant.slug &&
          item.restaurantSlug === restaurant.slug
        ) {
          return true;
        }

        return knownMenuIds.has(item.id);
      });

      map.set(restaurant.id, items);
    });

    return map;
  }, [restaurants, menuItems]);

  return (
    <View style={styles.container}>
      <View
        style={styles.header}
        onLayout={({ nativeEvent }) => setHeaderHeight(nativeEvent.layout.height)}
      >
        <Text style={styles.heading}>Nhà hàng</Text>
        <Text style={styles.subheading}>Chuỗi nhà hàng FCO</Text>
        <Text style={styles.description}>
          Mỗi nhà hàng hiển thị đúng thực đơn riêng như trên web, giúp bạn
          thêm món và kiểm tra nhanh chóng.
        </Text>
      </View>
      <FlatList
        data={restaurants}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RestaurantCard
            name={item.name}
            description={item.description}
            badge={item.badge}
            city={item.city}
            deliveryTime={item.deliveryTime}
            tags={item.tags}
            image={item.image}
            menuItems={menuByRestaurant.get(item.id) ?? []}
          />
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            {loading ? (
              <ActivityIndicator size="large" color="#f97316" />
            ) : (
              <Text style={styles.emptyText}>
                {error ?? "Chưa có nhà hàng nào được hiển thị."}
              </Text>
            )}
          </View>
        )}
        contentContainerStyle={[
          styles.listContent,
          { paddingTop: headerHeight + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff8f2",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 16,
    paddingBottom: 20,
    paddingHorizontal: 24,
    backgroundColor: "#fff8f2",
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
    elevation: 6,
    zIndex: 10,
  },
  heading: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1b1b1f",
  },
  subheading: {
    marginTop: 6,
    fontSize: 18,
    fontWeight: "600",
    color: "#f04e23",
  },
  description: {
    marginTop: 8,
    fontSize: 14,
    color: "#6b7280",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 220,
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
    marginBottom: 16,
    flexDirection: "row",
    gap: 12,
  },
  cardImage: {
    width: 96,
    height: 96,
    borderRadius: 18,
    backgroundColor: "#f3f4f6",
  },
  imagePlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderIcon: {
    fontSize: 28,
  },
  cardBody: {
    flex: 1,
    gap: 12,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1f2937",
    flexShrink: 1,
  },
  badge: {
    backgroundColor: "#fff0e6",
    color: "#f97316",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    fontWeight: "700",
    fontSize: 12,
  },
  cardContent: {
    fontSize: 14,
    color: "#4b5563",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
  },
  metaText: {
    fontSize: 13,
    color: "#6b7280",
  },
  metaIcon: {
    fontSize: 14,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tagChip: {
    backgroundColor: "#eef2ff",
    color: "#4338ca",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: "700",
  },
  menuSection: {
    backgroundColor: "#fff7ed",
    borderRadius: 16,
    padding: 12,
    gap: 8,
  },
  menuHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1f2937",
  },
  menuCount: {
    fontSize: 12,
    fontWeight: "700",
    color: "#f97316",
  },
  menuList: {
    gap: 10,
  },
  menuItemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuInfo: {
    flex: 1,
    gap: 4,
  },
  menuItemName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1f2937",
  },
  menuTag: {
    alignSelf: "flex-start",
    backgroundColor: "#ecfeff",
    color: "#0ea5e9",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    fontSize: 11,
    fontWeight: "700",
  },
  menuDesc: {
    fontSize: 12,
    color: "#4b5563",
  },
  menuPrice: {
    fontSize: 14,
    fontWeight: "800",
    color: "#f04e23",
  },
  menuImage: {
    width: 68,
    height: 68,
    borderRadius: 14,
    backgroundColor: "#f3f4f6",
  },
  miniPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  moreMenuText: {
    fontSize: 12,
    color: "#6b7280",
  },
  emptyMenuText: {
    fontSize: 13,
    color: "#9ca3af",
    fontStyle: "italic",
  },
  emptyState: {
    paddingVertical: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 15,
    color: "#6b7280",
  },
});

export default RestaurantsScreen;
