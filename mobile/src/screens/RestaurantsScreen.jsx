import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { fetchCollection } from "../utils/api";
import ProductDetailModal from "../components/product/ProductDetailModal.jsx";
import CartSuccessModal from "../components/feedback/CartSuccessModal";
import { useCart } from "../context/CartContext.jsx";
import { resolveImageSource } from "../utils/image";

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
  onPress,
}) => (
  <TouchableOpacity activeOpacity={0.9} style={styles.card} onPress={onPress}>
    <View style={styles.cardImageWrapper}>
      <ImageBackground
        source={image ? { uri: image } : undefined}
        style={styles.cardImage}
        imageStyle={styles.cardImage}
        defaultSource={undefined}
      >
        {!image ? (
          <View style={[styles.cardImage, styles.imagePlaceholder]}>
            <Text style={styles.placeholderIcon}>🏬</Text>
          </View>
        ) : null}
        <View style={styles.overlaySoft} />
      </ImageBackground>
    </View>

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
  </TouchableOpacity>
);

const RestaurantMenuList = ({ menuItems = [], onSelectItem, onAddToCart }) => {
  if (!menuItems.length) {
    return (
      <Text style={styles.emptyMenuText}>
        Nhà hàng đang cập nhật món ăn mới.
      </Text>
    );
  }

  return (
    <View style={styles.menuList}>
      {menuItems.map((menu) => (
        <View key={menu.id} style={styles.menuItemCard}>
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.menuItemRow}
            onPress={() => onSelectItem?.(menu)}
          >
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
              <Image
                source={resolveImageSource(menu.image)}
                style={styles.menuImage}
              />
            ) : (
              <View style={[styles.menuImage, styles.miniPlaceholder]}>
                <Text style={styles.placeholderIcon}>🍽️</Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.menuActions}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => onSelectItem?.(menu)}
            >
              <Text style={styles.secondaryButtonLabel}>Xem chi tiết</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => onAddToCart?.(menu)}
            >
              <Text style={styles.primaryButtonLabel}>Thêm vào giỏ</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
};

const RestaurantsScreen = () => {
  const [headerHeight, setHeaderHeight] = useState(200);
  const [restaurants, setRestaurants] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [confirmation, setConfirmation] = useState({
    visible: false,
    productName: "",
    quantity: 0,
  });
  const { addToCart } = useCart();

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

  const selectedRestaurant = useMemo(
    () => restaurants.find((restaurant) => restaurant.id === selectedRestaurantId) || null,
    [restaurants, selectedRestaurantId]
  );

  const productLookup = useMemo(() => {
    const lookup = new Map();
    menuItems.forEach((item) => lookup.set(item.id, item));
    return lookup;
  }, [menuItems]);

  const selectedProduct = useMemo(
    () => (selectedProductId ? productLookup.get(selectedProductId) ?? null : null),
    [productLookup, selectedProductId]
  );

  const handleOpenRestaurant = useCallback((restaurantId) => {
    setSelectedRestaurantId(restaurantId);
  }, []);

  const handleBackToList = useCallback(() => {
    setSelectedRestaurantId(null);
  }, []);

  const handleSelectProduct = useCallback((product) => {
    setSelectedProductId(product?.id ?? null);
  }, []);

  const handleCloseProduct = useCallback(() => {
    setSelectedProductId(null);
  }, []);

  const handleShowConfirmation = useCallback((product, quantity) => {
    if (!product) return;
    setConfirmation({
      visible: true,
      productName: product.name,
      quantity,
    });
  }, []);

  const handleHideConfirmation = useCallback(() => {
    setConfirmation((prev) => ({ ...prev, visible: false }));
  }, []);

  const handleAddToCart = useCallback(
    (product, quantity = 1) => {
      if (!product) return;
      const result = addToCart(product, quantity);
      handleShowConfirmation(result.product ?? product, result.quantity ?? quantity);
    },
    [addToCart, handleShowConfirmation]
  );

  const handleAddFromModal = useCallback(
    (product, quantity) => {
      handleAddToCart(product, quantity);
      handleCloseProduct();
    },
    [handleAddToCart, handleCloseProduct]
  );

  if (selectedRestaurant) {
    const items = menuByRestaurant.get(selectedRestaurant.id) ?? [];

    return (
      <ScrollView
        style={[styles.container, styles.detailContainer]}
        contentContainerStyle={styles.detailContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroWrapper}>
          <ImageBackground
            source={selectedRestaurant.image ? { uri: selectedRestaurant.image } : undefined}
            style={styles.hero}
            imageStyle={styles.heroImage}
          >
            {!selectedRestaurant.image ? (
              <View style={[styles.hero, styles.imagePlaceholder]}>
                <Text style={styles.placeholderIcon}>🏬</Text>
              </View>
            ) : null}
            <View style={styles.heroOverlay} />
            <TouchableOpacity style={styles.backButton} onPress={handleBackToList}>
              <Text style={styles.backText}>◀ Quay lại</Text>
            </TouchableOpacity>
          </ImageBackground>

          <View style={styles.heroInfoCard}>
            <Text style={styles.heroBadge}>{selectedRestaurant.badge}</Text>
            <Text style={styles.heroTitle}>{selectedRestaurant.name}</Text>
            <Text style={styles.heroDescription} numberOfLines={3}>
              {selectedRestaurant.description}
            </Text>
            <View style={styles.heroMetaRow}>
              {selectedRestaurant.deliveryTime ? (
                <View style={styles.heroMetaPill}>
                  <Text style={styles.heroMetaIcon}>⏱️</Text>
                  <Text style={styles.heroMetaText}>{selectedRestaurant.deliveryTime}</Text>
                </View>
              ) : null}
              {selectedRestaurant.city ? (
                <View style={styles.heroMetaPill}>
                  <Text style={styles.heroMetaIcon}>📍</Text>
                  <Text style={styles.heroMetaText}>{selectedRestaurant.city}</Text>
                </View>
              ) : null}
            </View>
          </View>
        </View>

        {selectedRestaurant.tags?.length ? (
          <View style={styles.tagsRowDetail}>
            {selectedRestaurant.tags.map((tag) => (
              <Text key={tag} style={styles.tagChipDetail}>
                {tag}
              </Text>
            ))}
          </View>
        ) : null}

        <View style={styles.menuSectionDetail}>
          <View style={styles.menuHeaderRow}>
            <View>
              <Text style={styles.menuTitle}>Thực đơn của nhà hàng</Text>
              <Text style={styles.menuSubtitle}>Chạm để xem chi tiết và đặt món nhanh</Text>
            </View>
            <Text style={styles.menuCount}>{items.length} món</Text>
          </View>
          <RestaurantMenuList
            menuItems={items}
            onSelectItem={handleSelectProduct}
            onAddToCart={(menu) => handleAddToCart(menu)}
          />
        </View>

        <ProductDetailModal
          product={selectedProduct}
          visible={Boolean(selectedProduct)}
          onClose={handleCloseProduct}
          onAddToCart={handleAddFromModal}
        />
        <CartSuccessModal
          visible={confirmation.visible}
          productName={confirmation.productName}
          quantity={confirmation.quantity}
          onClose={handleHideConfirmation}
        />
      </ScrollView>
    );
  }

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
            onPress={() => handleOpenRestaurant(item.id)}
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
        { paddingTop: headerHeight + 24, paddingBottom: 140 },
      ]}
      showsVerticalScrollIndicator={false}
    />

      <ProductDetailModal
        product={selectedProduct}
        visible={Boolean(selectedProduct)}
        onClose={handleCloseProduct}
        onAddToCart={handleAddFromModal}
      />

      <CartSuccessModal
        visible={confirmation.visible}
        productName={confirmation.productName}
        quantity={confirmation.quantity}
        onClose={handleHideConfirmation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff8f2",
  },
  cardImageWrapper: {
    overflow: "hidden",
    borderRadius: 18,
  },
  cardBody: {
    backgroundColor: "#fff",
    padding: 16,
    gap: 8,
    borderRadius: 18,
    marginTop: -18,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
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
    borderRadius: 24,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
    elevation: 4,
    marginBottom: 16,
    overflow: "hidden",
  },
  cardImage: {
    height: 220,
    borderRadius: 24,
    width: "100%",
    overflow: "hidden",
  },
  imagePlaceholder: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f3f4f6",
    width: "100%",
    height: "100%",
  },
  placeholderIcon: {
    fontSize: 28,
  },
  overlaySoft: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.18)",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0f172a",
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
    color: "#4b5563",
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
    backgroundColor: "#fef2f2",
    color: "#b91c1c",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: "700",
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
    gap: 16,
  },
  menuItemCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    gap: 10,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
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
    fontSize: 15,
    fontWeight: "800",
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
    fontSize: 15,
    fontWeight: "800",
    color: "#f04e23",
  },
  menuImage: {
    width: 74,
    height: 74,
    borderRadius: 14,
    backgroundColor: "#f3f4f6",
  },
  miniPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  menuActions: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "flex-end",
  },
  secondaryButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#fff",
  },
  secondaryButtonLabel: {
    color: "#1f2937",
    fontWeight: "700",
    fontSize: 12,
  },
  primaryButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#ff5a1f",
  },
  primaryButtonLabel: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 12,
  },
  emptyMenuText: {
    fontSize: 13,
    color: "#9ca3af",
    fontStyle: "italic",
  },
  detailContainer: {
    backgroundColor: "#fff",
  },
  detailContent: {
    paddingBottom: 140,
  },
  heroWrapper: {
    marginBottom: 16,
  },
  hero: {
    height: 260,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: "hidden",
  },
  heroImage: {
    resizeMode: "cover",
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  backButton: {
    position: "absolute",
    top: 18,
    left: 18,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "rgba(0,0,0,0.35)",
    borderRadius: 10,
  },
  backText: {
    color: "#fff",
    fontWeight: "700",
  },
  heroInfoCard: {
    backgroundColor: "#fff",
    marginTop: -36,
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 16,
    gap: 10,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },
  heroBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#fff0e6",
    color: "#f97316",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    fontWeight: "800",
  },
  heroTitle: {
    color: "#111827",
    fontSize: 26,
    fontWeight: "900",
  },
  heroDescription: {
    color: "#4b5563",
    fontSize: 14,
  },
  heroMetaRow: {
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
  },
  heroMetaPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#f9fafb",
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  heroMetaIcon: {
    fontSize: 12,
  },
  heroMetaText: {
    color: "#111827",
    fontWeight: "700",
  },
  tagsRowDetail: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  tagChipDetail: {
    backgroundColor: "#eef2ff",
    color: "#4338ca",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    fontSize: 12,
    fontWeight: "800",
  },
  menuSectionDetail: {
    backgroundColor: "#fff7ed",
    marginHorizontal: 20,
    borderRadius: 18,
    padding: 16,
    gap: 12,
  },
  menuSubtitle: {
    marginTop: 6,
    fontSize: 12,
    color: "#6b7280",
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

