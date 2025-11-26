import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";

import {
  createMenuItem,
  deleteMenuItem,
  deleteOrder,
  fetchCollection,
  updateMenuItem,
  updateOrder,
} from "../../utils/api";

const normalizeOrders = (orders = []) =>
  orders.map((order, index) => {
    const total =
      Number(order?.totalAmount) ||
      Number(order?.total) ||
      Number(order?.subtotal) ||
      0;
    const status = String(order?.status?.label ?? order?.status ?? "").trim();
    const itemCount = Array.isArray(order?.items)
      ? order.items.length
      : order?.items || 0;

    return {
      id: order?.id || order?.code || `ORD-${index + 1}`,
      customer:
        order?.customer?.name || order?.customerName || order?.customer || "Khách",
         restaurantId:
        order?.restaurantId ||
        order?.restaurant?.id ||
        order?.restaurantSlug ||
        null,
      restaurantSlug: order?.restaurantSlug || order?.restaurant?.slug || null,
      restaurantName:
        order?.restaurantName || order?.restaurant?.name || order?.restaurant || "",
      total,
      status: status || "Đang xử lý",
      items: itemCount,
      address: order?.address || order?.deliveryAddress || "",
    };
  });

const normalizeMenu = (items = []) =>
  items.map((item, index) => ({
    id: item?.id || `dish-${index + 1}`,
    name: item?.name || item?.title || "Món mới",
    price: Number(item?.price) || 0,
    status: String(item?.status || "available").toLowerCase(),
    tag: item?.tag || item?.badge || item?.category || "",
    restaurantId: item?.restaurantId ?? null,
    restaurantSlug: item?.restaurantSlug ?? null,
  }));

const normalizeRestaurant = (restaurant) => ({
  ...restaurant,
  id: restaurant?.id,
  name: restaurant?.name || restaurant?.title || "Nhà hàng FCO",
  slug: restaurant?.slug,
  menuItemIds: restaurant?.menuItemIds ?? [],
});

const RestaurantDashboardScreen = ({ user, onBack }) => {
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [orderForm, setOrderForm] = useState({
    id: "",
    customer: "",
    items: "1",
    total: "0",
    status: "Đang xử lý",
    address: "",
  });
  const categories = useMemo(
    () => [
      "Burger Artisan",
      "Pizza 18 inch",
      "Gà rán & Snack",
      "Đồ uống mixology",
    ],
    []
  );
  const defaultCategory = categories[0];

  const [dishForm, setDishForm] = useState({
    id: "",
    name: "",
    price: "",
    status: "available",
    tag: "",
    image: "",
    imageName: "",
    category: defaultCategory,
    description: "",
  });
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [editingDishId, setEditingDishId] = useState(null);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [showDishForm, setShowDishForm] = useState(false);

  useEffect(() => {
    let active = true;

    const loadData = async () => {
      try {
        const [orderResponse, menuResponse, restaurantResponse] =
          await Promise.all([
            fetchCollection("orders").catch(() => []),
            fetchCollection("menuItems").catch(() => []),
            fetchCollection("restaurants").catch(() => []),
          ]);

        if (!active) return;

        setOrders(normalizeOrders(Array.isArray(orderResponse) ? orderResponse : []));
        setMenuItems(normalizeMenu(Array.isArray(menuResponse) ? menuResponse : []));
        setRestaurants(
          Array.isArray(restaurantResponse)
            ? restaurantResponse.map(normalizeRestaurant)
            : []
        );
      } catch (error) {
        console.warn("Không thể đồng bộ dữ liệu nhà hàng trên mobile", error);
      }
    };

    loadData();

    return () => {
      active = false;
    };
  }, []);

  

  const currentRestaurant = useMemo(() => {
    if (!restaurants.length) return null;

    if (user?.restaurantId) {
      const byId = restaurants.find((r) => r.id === user.restaurantId);
      if (byId) return byId;
    }

    if (user?.restaurantSlug) {
      const bySlug = restaurants.find((r) => r.slug === user.restaurantSlug);
      if (bySlug) return bySlug;
    }

    return restaurants[0];
  }, [restaurants, user?.restaurantId, user?.restaurantSlug]);

  const restaurantMenu = useMemo(() => {
    if (!currentRestaurant) return menuItems;

    const allowedIds = new Set(currentRestaurant.menuItemIds || []);

    return menuItems.filter((item) => {
      if (
        (item.restaurantId && item.restaurantId === currentRestaurant.id) ||
        (item.restaurantSlug && item.restaurantSlug === currentRestaurant.slug)
      ) {
        return true;
      }

      return allowedIds.has(item.id);
    });
  }, [currentRestaurant, menuItems]);

  const availableDishes = useMemo(
    () => restaurantMenu.filter((item) => item.status !== "soldout"),
    [restaurantMenu]
  );
  const restaurantOrders = useMemo(() => {
    if (!currentRestaurant) return orders;

    const normalizeValue = (value) => String(value ?? "").trim().toLowerCase();

    const restaurantId = normalizeValue(currentRestaurant.id);
    const restaurantSlug = normalizeValue(currentRestaurant.slug);
    const restaurantName = normalizeValue(currentRestaurant.name);

    return orders.filter((order) => {
      const orderId = normalizeValue(order.restaurantId);
      const orderSlug = normalizeValue(order.restaurantSlug);
      const orderName = normalizeValue(order.restaurantName);

      return (
        (orderId && orderId === restaurantId) ||
        (orderSlug && orderSlug === restaurantSlug) ||
        (orderName && orderName === restaurantName)
      );
    });
  }, [currentRestaurant, orders]);

  const activeOrders = useMemo(
    () =>
      restaurantOrders.filter((order) =>
        String(order.status).toLowerCase().match(/giao|chuẩn|xác nhận/)
      ),
    [restaurantOrders]
  );

 

  const tabs = [
    { key: "overview", label: "Tổng quan" },
    { key: "orders", label: "Đơn hàng" },
    { key: "menu", label: "Menu" },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backIcon}>←</Text>
          <Text style={styles.backLabel}>Quay lại</Text>
        </TouchableOpacity>

        <View>
          <Text style={styles.heading}>Quản lý nhà hàng</Text>
          <Text style={styles.subheading}>
            {currentRestaurant?.name || user?.name || "Restaurant"}
          </Text>
        </View>
      </View>

      <View style={styles.tabBar}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tabButton, activeTab === tab.key && styles.activeTab]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text
              style={[styles.tabLabel, activeTab === tab.key && styles.activeTabLabel]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === "overview" && (
        <View style={styles.cardGrid}>
          <View style={[styles.card, styles.primaryCard]}>
            <Text style={styles.cardLabel}>Đơn đang xử lý</Text>
            <Text style={styles.cardValue}>{activeOrders.length}</Text>
            <Text style={styles.cardHint}>Từ web và mobile</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Tổng đơn</Text>
            <Text style={styles.cardValue}>{restaurantOrders.length}</Text>
            <Text style={styles.cardHint}>Bao gồm lịch sử</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Món đang bán</Text>
            <Text style={styles.cardValue}>{availableDishes.length}</Text>
            <Text style={styles.cardHint}>Menu cập nhật theo web</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Đang tạm dừng</Text>
            <Text style={styles.cardValue}>
              {Math.max(restaurantMenu.length - availableDishes.length, 0)}
            </Text>
            <Text style={styles.cardHint}>Cần bật bán lại</Text>
          </View>
        </View>
      )}

      {activeTab === "orders" && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quản lý đơn hàng</Text>

          {showOrderForm ? (
            <View style={styles.formCard}>
              <Text style={styles.formTitle}>
                {editingOrderId ? "Chỉnh sửa đơn" : "Cập nhật trạng thái"}
              </Text>
              <View style={styles.formRow}>
                <View style={styles.formField}>
                  <Text style={styles.formLabel}>Mã đơn</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="ORD-1234"
                    value={orderForm.id}
                    onChangeText={(text) =>
                      setOrderForm((prev) => ({ ...prev, id: text }))
                    }
                  />
                </View>
                <View style={styles.formField}>
                  <Text style={styles.formLabel}>Khách hàng</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Tên khách"
                    value={orderForm.customer}
                    onChangeText={(text) =>
                      setOrderForm((prev) => ({ ...prev, customer: text }))
                    }
                  />
                </View>
              </View>
              <View style={styles.formRow}>
                <View style={styles.formField}>
                  <Text style={styles.formLabel}>Số món</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={String(orderForm.items)}
                    onChangeText={(text) =>
                      setOrderForm((prev) => ({ ...prev, items: text }))
                    }
                  />
                </View>
                <View style={styles.formField}>
                  <Text style={styles.formLabel}>Tổng tiền (đ)</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={String(orderForm.total)}
                    onChangeText={(text) =>
                      setOrderForm((prev) => ({ ...prev, total: text }))
                    }
                  />
                </View>
              </View>
              <View style={styles.formField}>
                <Text style={styles.formLabel}>Trạng thái</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Đang giao"
                  value={orderForm.status}
                  onChangeText={(text) =>
                    setOrderForm((prev) => ({ ...prev, status: text }))
                  }
                />
              </View>
              <View style={styles.formField}>
                <Text style={styles.formLabel}>Địa chỉ</Text>
                <TextInput
                  style={[styles.input, styles.multiline]}
                  placeholder="Ghi chú giao hàng"
                  value={orderForm.address}
                  multiline
                  onChangeText={(text) =>
                    setOrderForm((prev) => ({ ...prev, address: text }))
                  }
                />
              </View>
              <View style={styles.formActions}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.ghostButton]}
                  onPress={() => {
                    setShowOrderForm(false);
                    setOrderForm({
                      id: "",
                      customer: "",
                      items: "1",
                      total: "0",
                      status: "Đang xử lý",
                      address: "",
                    });
                    setEditingOrderId(null);
                  }}
                >
                  <Text style={styles.actionButtonLabel}>Hủy</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={async () => {
                    const sanitized = {
                      ...orderForm,
                      items: Math.max(Number(orderForm.items) || 0, 0),
                      total: Math.max(Number(orderForm.total) || 0, 0),
                    };

                    if (!sanitized.id) {
                      Alert.alert(
                        "Thiếu mã đơn",
                        "Vui lòng chọn đơn từ danh sách để chỉnh sửa."
                      );
                      return;
                    }

                    try {
                      await updateOrder(sanitized.id, sanitized);
                    } catch (error) {
                      console.warn("Không thể cập nhật đơn hàng", error);
                    }

                    setOrders((prev) =>
                      prev.map((order) =>
                        order.id === sanitized.id ? { ...order, ...sanitized } : order
                      )
                    );
                    setEditingOrderId(null);
                    setShowOrderForm(false);
                  }}
                >
                  <Text style={styles.actionButtonLabel}>
                    {editingOrderId ? "Lưu đơn" : "Cập nhật"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.formCard, styles.centeredCard]}
              onPress={() => setShowOrderForm(true)}
            >
              <Text style={styles.formTitle}>Chọn đơn để sửa</Text>
              <Text style={styles.emptyText}>
                Nhấn "Sửa" trên danh sách hoặc chạm để nhập mã đơn thủ công.
              </Text>
            </TouchableOpacity>
          )}

          {restaurantOrders.length === 0 ? (
            <Text style={styles.emptyText}>Chưa có đơn hàng.</Text>
          ) : (
            restaurantOrders.slice(0, 6).map((order) => (
              <View key={order.id} style={styles.listItem}>
                <View style={styles.listTextGroup}>
                  <Text style={styles.itemTitle}>{order.id}</Text>
                  <Text style={styles.itemSubtitle}>
                    {order.customer} • {order.items} món
                  </Text>
                  {!!order.address && (
                    <Text style={styles.itemSubtitle}>{order.address}</Text>
                  )}
                </View>
                <View style={[styles.tag, styles.secondaryTag]}>
                  <Text style={[styles.tagLabel, styles.secondaryTagLabel]}>
                    {order.status}
                  </Text>
                </View>
                <Text style={styles.itemValue}>
                  {new Intl.NumberFormat("vi-VN").format(order.total)} đ
                </Text>
                <View style={styles.inlineActions}>
                  <TouchableOpacity
                    onPress={() => {
                      setActiveTab("orders");
                      setEditingOrderId(order.id);
                      setShowOrderForm(true);
                      setOrderForm({
                        id: order.id,
                        customer: order.customer,
                        items: String(order.items ?? 0),
                        total: String(order.total ?? 0),
                        status: order.status,
                        address: order.address ?? "",
                      });
                    }}
                  >
                    <Text style={styles.link}>Sửa</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      Alert.alert(
                        "Xóa đơn hàng",
                        "Bạn có chắc muốn xóa đơn này?",
                        [
                          { text: "Hủy", style: "cancel" },
                          {
                            text: "Xóa",
                            style: "destructive",
                            onPress: async () => {
                              try {
                                await deleteOrder(order.id);
                              } catch (error) {
                                console.warn("Không thể xóa đơn", error);
                              }

                              setOrders((prev) =>
                                prev.filter((item) => item.id !== order.id)
                              );
                            },
                          },
                        ]
                      );
                    }}
                  >
                    <Text style={[styles.link, styles.dangerLink]}>Xóa</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      )}

      {activeTab === "menu" && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Menu nổi bật</Text>

          {showDishForm ? (
            <View style={styles.formCard}>
              <Text style={styles.formTitle}>
                {editingDishId ? "Sửa món" : "Thêm món mới"}
              </Text>
              <View style={styles.formField}>
                <Text style={styles.formLabel}>Tên món</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Tên món ăn"
                  value={dishForm.name}
                  onChangeText={(text) =>
                    setDishForm((prev) => ({ ...prev, name: text }))
                  }
                />
              </View>
              <View style={styles.formField}>
                <Text style={styles.formLabel}>Ảnh món</Text>
                <TouchableOpacity
                  style={styles.filePicker}
                  onPress={async () => {
                    try {
                      const result = await DocumentPicker.getDocumentAsync({
                        type: ["image/jpeg", "image/png"],
                        copyToCacheDirectory: true,
                        multiple: false,
                      });

                      if (result.canceled) return;

                      const file = result.assets?.[0];
                      const fileName =
                        file?.name || file?.uri?.split("/").pop() || "";
                      const fileUri = file?.uri || "";

                      if (fileUri) {
                        setDishForm((prev) => ({
                          ...prev,
                          image: fileUri,
                          imageName: fileName,
                        }));
                      }
                    } catch (error) {
                      console.warn("Không thể chọn ảnh", error);
                    }
                  }}
                >
                  <View style={styles.fileButton}>
                    <Text style={styles.fileButtonLabel}>Chọn tệp</Text>
                  </View>
                  <Text style={styles.fileName}>
                    {dishForm.imageName || dishForm.image
                      ? dishForm.imageName || dishForm.image.split("/").pop()
                      : "Chưa chọn tệp"}
                  </Text>
                </TouchableOpacity>
                <Text style={styles.helperText}>
                  Hỗ trợ JPG, PNG. Giới hạn kích thước 2MB
                </Text>
              </View>
              <View style={styles.formField}>
                <Text style={styles.formLabel}>Danh mục</Text>
                <View style={styles.chipRow}>
                  {categories.map((category) => {
                    const active = dishForm.category === category;
                    return (
                      <TouchableOpacity
                        key={category}
                        style={[styles.chip, active && styles.activeChip]}
                        onPress={() =>
                          setDishForm((prev) => ({ ...prev, category }))
                        }
                      >
                        <Text
                          style={[styles.chipLabel, active && styles.activeChipLabel]}
                        >
                          {category}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
              <View style={styles.formField}>
                <Text style={styles.formLabel}>Giá bán (đ)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={String(dishForm.price)}
                  onChangeText={(text) =>
                    setDishForm((prev) => ({ ...prev, price: text }))
                  }
                />
              </View>
              <View style={styles.formField}>
                <Text style={styles.formLabel}>Mô tả ngắn</Text>
                <TextInput
                  style={[styles.input, styles.multiline]}
                  placeholder="Mô tả nhanh về món"
                  value={dishForm.description}
                  multiline
                  onChangeText={(text) =>
                    setDishForm((prev) => ({ ...prev, description: text }))
                  }
                />
              </View>
              <View style={styles.formField}>
                <Text style={styles.formLabel}>Nhãn</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Spicy, Best seller..."
                  value={dishForm.tag}
                  onChangeText={(text) =>
                    setDishForm((prev) => ({ ...prev, tag: text }))
                  }
                />
              </View>
              <View style={styles.formField}>
                <Text style={styles.formLabel}>Trạng thái</Text>
                <TextInput
                  style={styles.input}
                  placeholder="available / soldout"
                  value={dishForm.status}
                  onChangeText={(text) =>
                    setDishForm((prev) => ({ ...prev, status: text }))
                  }
                />
              </View>
              <View style={styles.formActions}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.ghostButton]}
                  onPress={() => {
                    setEditingDishId(null);
                    setShowDishForm(false);
                    setDishForm({
                      id: "",
                      name: "",
                      price: "",
                      status: "available",
                      tag: "",
                      image: "",
                      imageName: "",
                      category: defaultCategory,
                      description: "",
                    });
                  }}
                >
                  <Text style={styles.actionButtonLabel}>Hủy</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={async () => {
                    const sanitized = {
                      ...dishForm,
                      price: Math.max(Number(dishForm.price) || 0, 0),
                      status: dishForm.status || "available",
                    };
                    delete sanitized.imageName;

                    try {
                      if (editingDishId) {
                        await updateMenuItem(editingDishId, sanitized);
                        setMenuItems((prev) =>
                          prev.map((item) =>
                            item.id === editingDishId
                              ? { ...item, ...sanitized }
                              : item
                          )
                        );
                      } else {
                        const created = await createMenuItem(sanitized);
                        const record = created || {
                          ...sanitized,
                          id: Date.now().toString(),
                        };
                        setMenuItems((prev) => [...prev, record]);
                      }
                    } catch (error) {
                      console.warn("Không thể lưu món ăn", error);
                    }

                    setEditingDishId(null);
                    setDishForm({
                      id: "",
                      name: "",
                      price: "",
                      status: "available",
                      tag: "",
                      image: "",
                      imageName: "",
                      category: defaultCategory,
                      description: "",
                    });
                    setShowDishForm(false);
                  }}
                >
                  <Text style={styles.actionButtonLabel}>
                    {editingDishId ? "Lưu món" : "Thêm món"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.formCard, styles.centeredCard]}
              onPress={() => {
                setEditingDishId(null);
                setDishForm({
                  id: "",
                  name: "",
                  price: "",
                  status: "available",
                  tag: "",
                  image: "",
                  imageName: "",
                  category: defaultCategory,
                  description: "",
                });
                setShowDishForm(true);
              }}
            >
              <Text style={styles.formTitle}>Thêm món</Text>
              <Text style={styles.emptyText}>Nhấn để mở form thêm món mới.</Text>
            </TouchableOpacity>
          )}

          {restaurantMenu.length === 0 ? (
            <Text style={styles.emptyText}>Chưa có món ăn.</Text>
          ) : (
            restaurantMenu.slice(0, 6).map((item) => (
              <View key={item.id} style={styles.listItem}>
                <View style={styles.listTextGroup}>
                  <Text style={styles.itemTitle}>{item.name}</Text>
                  <Text style={styles.itemSubtitle}>
                    {item.category || item.tag || "Chưa phân loại"}
                  </Text>
                  {!!item.description && (
                    <Text style={styles.itemSubtitle}>{item.description}</Text>
                  )}
                </View>
                <View
                  style={[
                    styles.tag,
                    item.status === "soldout" ? styles.dangerTag : styles.primaryTag,
                  ]}
                >
                  <Text
                    style={[
                      styles.tagLabel,
                      item.status === "soldout"
                        ? styles.dangerTagLabel
                        : styles.primaryTagLabel,
                    ]}
                  >
                    {item.status === "soldout" ? "Tạm dừng" : "Đang bán"}
                  </Text>
                </View>
                <Text style={styles.itemValue}>
                  {new Intl.NumberFormat("vi-VN").format(item.price)} đ
                </Text>
                <View style={styles.inlineActions}>
                  <TouchableOpacity
                    onPress={() => {
                      setEditingDishId(item.id);
                      setShowDishForm(true);
                      setDishForm({
                        id: item.id,
                        name: item.name,
                        price: String(item.price ?? 0),
                        status: item.status,
                        tag: item.tag,
                        image: item.image || "",
                        imageName:
                          item.image?.split("/").pop() || item.imageName || "",
                        category: item.category || defaultCategory,
                        description: item.description || "",
                      });
                    }}
                  >
                    <Text style={styles.link}>Sửa</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      Alert.alert(
                        "Xóa món",
                        "Bạn có chắc muốn xóa món này?",
                        [
                          { text: "Hủy", style: "cancel" },
                          {
                            text: "Xóa",
                            style: "destructive",
                            onPress: async () => {
                              try {
                                await deleteMenuItem(item.id);
                              } catch (error) {
                                console.warn("Không thể xóa món", error);
                              }

                              setMenuItems((prev) =>
                                prev.filter((dish) => dish.id !== item.id)
                              );
                            },
                          },
                        ]
                      );
                    }}
                  >
                    <Text style={[styles.link, styles.dangerLink]}>Xóa</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: "#fff8f2",
    gap: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingRight: 12,
  },
  backIcon: {
    fontSize: 18,
    marginRight: 8,
    color: "#f97316",
  },
  backLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#f97316",
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: "#7c2d12",
    textAlign: "right",
  },
  subheading: {
    fontSize: 14,
    color: "#a16207",
    textAlign: "right",
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#fff1e6",
    padding: 6,
    borderRadius: 999,
    gap: 6,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 999,
    alignItems: "center",
  },
  tabLabel: {
    fontSize: 13,
    color: "#c2410c",
    fontWeight: "600",
  },
  activeTab: {
    backgroundColor: "#f97316",
    shadowColor: "#f97316",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  activeTabLabel: {
    color: "#ffffff",
  },
  cardGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  card: {
    flexGrow: 1,
    minWidth: "45%",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#f97316",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  primaryCard: {
    backgroundColor: "#fef3c7",
    borderWidth: 1,
    borderColor: "#fcd34d",
  },
  cardLabel: {
    fontSize: 13,
    color: "#a16207",
    marginBottom: 8,
    fontWeight: "600",
  },
  cardValue: {
    fontSize: 22,
    fontWeight: "800",
    color: "#7c2d12",
  },
  cardHint: {
    fontSize: 12,
    color: "#a16207",
    marginTop: 4,
  },
  section: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#f97316",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#7c2d12",
    marginBottom: 12,
  },
  emptyText: {
    color: "#a16207",
  },
  centeredCard: {
    alignItems: "center",
    justifyContent: "center",
  },
  formCard: {
    backgroundColor: "#fff7ed",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#fed7aa",
    marginBottom: 12,
    gap: 10,
  },
  formTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#9a3412",
  },
  formRow: {
    flexDirection: "row",
    gap: 10,
  },
  formField: {
    flex: 1,
    gap: 6,
  },
  formLabel: {
    fontSize: 13,
    color: "#a16207",
    fontWeight: "600",
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderColor: "#fed7aa",
    backgroundColor: "#fff7ed",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  activeChip: {
    backgroundColor: "#f97316",
    borderColor: "#f97316",
  },
  chipLabel: {
    color: "#c2410c",
    fontWeight: "600",
    fontSize: 12,
  },
  activeChipLabel: {
    color: "#fff7ed",
  },
  input: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#fed7aa",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#7c2d12",
  },
  filePicker: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: "#fed7aa",
    borderRadius: 10,
    backgroundColor: "#ffffff",
  },
  fileButton: {
    backgroundColor: "#f97316",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  fileButtonLabel: {
    color: "#ffffff",
    fontWeight: "700",
  },
  fileName: {
    flex: 1,
    color: "#7c2d12",
  },
  helperText: {
    color: "#a16207",
    fontSize: 12,
  },
  multiline: {
    minHeight: 72,
    textAlignVertical: "top",
  },
  formActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  actionButton: {
    backgroundColor: "#f97316",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  ghostButton: {
    backgroundColor: "#fff7ed",
    borderWidth: 1,
    borderColor: "#fed7aa",
  },
  actionButtonLabel: {
    color: "#ffffff",
    fontWeight: "700",
  },
  listItem: {
    borderTopWidth: 1,
    borderTopColor: "#f5d0c5",
    paddingVertical: 10,
    gap: 6,
  },
  listTextGroup: {
    gap: 2,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#7c2d12",
  },
  itemSubtitle: {
    fontSize: 13,
    color: "#a16207",
  },
  itemValue: {
    fontSize: 14,
    color: "#7c2d12",
    fontWeight: "700",
  },
  tag: {
    alignSelf: "flex-start",
    backgroundColor: "#f97316",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  dangerTag: {
    backgroundColor: "#fee2e2",
    borderWidth: 1,
    borderColor: "#fca5a5",
  },
  primaryTag: {
    backgroundColor: "#f97316",
    borderWidth: 1,
    borderColor: "#fb923c",
  },
  tagLabel: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "700",
  },
  primaryTagLabel: {
    color: "#fff7ed",
  },
  secondaryTag: {
    backgroundColor: "#fff1e6",
    borderWidth: 1,
    borderColor: "#fdba74",
  },
  secondaryTagLabel: {
    color: "#c2410c",
  },
  dangerTagLabel: {
    color: "#b91c1c",
  },
  inlineActions: {
    flexDirection: "row",
    gap: 12,
  },
  link: {
    color: "#ea580c",
    fontWeight: "700",
  },
  dangerLink: {
    color: "#b91c1c",
  },
});

export default RestaurantDashboardScreen;
