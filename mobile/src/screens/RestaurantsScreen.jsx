import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { fetchCollection } from "../utils/api";

const RestaurantCard = ({
  name,
  description,
  badge,
  city,
  deliveryTime,
  tags,
  image,
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
    </View>
  </View>
);

const RestaurantsScreen = () => {
  const [headerHeight, setHeaderHeight] = useState(200);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    const loadRestaurants = async () => {
      try {
        const response = await fetchCollection("restaurants");
        if (!active) return;

        if (Array.isArray(response)) {
          const normalized = response.map((restaurant) => ({
            ...restaurant,
            image: restaurant.image ?? restaurant.img ?? restaurant.photo,
            city: restaurant.city ?? restaurant.location,
            deliveryTime: restaurant.deliveryTime ?? restaurant.time,
          }));
          setRestaurants(normalized);
        } else {
          setRestaurants([]);
        }
      } catch (err) {
        if (active) {
          setError("Không thể tải danh sách nhà hàng");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadRestaurants();

    return () => {
      active = false;
    };
  }, []);

  return (
    <View style={styles.container}>
      <View
        style={styles.header}
        onLayout={({ nativeEvent }) => setHeaderHeight(nativeEvent.layout.height)}
      >
        <Text style={styles.heading}>Nhà hàng</Text>
        <Text style={styles.subheading}>Chuỗi nhà hàng FCO</Text>
        <Text style={styles.description}>
          Đồng bộ dữ liệu từ dtb.json để cập nhật tức thời như trên web.
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
    justifyContent: "space-between",
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
    backgroundColor: "#fff1e6",
    color: "#f97316",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    fontSize: 12,
    fontWeight: "700",
  },
  cardContent: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    color: "#4b5563",
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 8,
  },
  metaIcon: {
    color: "#f97316",
    fontWeight: "700",
  },
  metaText: {
    fontSize: 13,
    color: "#6b7280",
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
  },
  tagChip: {
    backgroundColor: "#f3f4f6",
    color: "#4b5563",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    fontSize: 12,
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 15,
    color: "#6b7280",
    textAlign: "center",
  },
});

export default RestaurantsScreen;
