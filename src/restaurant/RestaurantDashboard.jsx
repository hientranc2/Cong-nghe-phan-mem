import { useEffect, useMemo, useState } from "react";
import "./RestaurantDashboard.css";
import RestaurantHeader from "./components/RestaurantHeader";
import RestaurantListSection from "./components/RestaurantListSection";
import RestaurantOrdersSection from "./components/RestaurantOrdersSection";
import RestaurantOverview from "./components/RestaurantOverview";
import RestaurantSidebar from "./components/RestaurantSidebar";

const DEFAULT_ORDERS = [
  {
    id: "DH-4521",
    customer: "Mai Anh",
    items: 3,
    total: 347000,
    status: "Đang giao",
    placedAt: "2024-05-28T10:30:00",
    address: "Sunrise Riverside, Quận 7",
  },
  {
    id: "DH-4522",
    customer: "Tú Anh",
    items: 2,
    total: 198000,
    status: "Chuẩn bị",
    placedAt: "2024-05-28T09:15:00",
    address: "Vinhomes Central Park",
  },
  {
    id: "DH-4523",
    customer: "Minh Quân",
    items: 4,
    total: 337000,
    status: "Chờ xác nhận",
    placedAt: "2024-05-27T19:05:00",
    address: "Empire City, Thủ Đức",
  },
  {
    id: "DH-4524",
    customer: "Lan Anh",
    items: 5,
    total: 472000,
    status: "Đã hoàn tất",
    placedAt: "2024-05-26T12:40:00",
    address: "ETown Cộng Hòa, Tân Bình",
  },
];

const DEFAULT_RATING = {
  score: 4.6,
  totalReviews: 128,
  summary: "98% khách hài lòng",
  breakdown: [
    { label: "5 sao", percent: 68 },
    { label: "4 sao", percent: 22 },
    { label: "3 sao", percent: 6 },
    { label: "2 sao", percent: 3 },
    { label: "1 sao", percent: 1 },
  ],
};

const EMPTY_RESTAURANT_FORM = {
  name: "",
  badge: "",
  city: "",
  deliveryTime: "",
  description: "",
  tags: "",
  img: "",
};

const EMPTY_ORDER_FORM = {
  customer: "",
  items: "",
  total: "",
  status: "Chờ xác nhận",
  placedAt: "",
  address: "",
};

const STATUS_VARIANTS = {
  "đang giao": "info",
  "chuẩn bị": "warning",
  "chờ xác nhận": "pending",
  "đã hoàn tất": "success",
  "đã hủy": "danger",
  "tạm dừng": "danger",
  available: "success",
  "đang bán": "success",
  soldout: "danger",
  "sold out": "danger",
  "hết hàng": "danger",
};

const ACTIVE_ORDER_STATUSES = new Set([
  "đang giao",
  "chuẩn bị",
  "chờ xác nhận",
  "đang xử lý",
]);

const formatCurrency = (value) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value || 0);

const formatDateTime = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const day = new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
  const time = new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);

  return `${day} • ${time}`;
};

const parseDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date;
};

const isSameMonth = (value, reference = new Date()) => {
  if (!value) return false;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;

  return (
    date.getFullYear() === reference.getFullYear() &&
    date.getMonth() === reference.getMonth()
  );
};

const isSameDay = (value, reference) => {
  const date = parseDate(value);
  const referenceDate = parseDate(reference);
  if (!date || !referenceDate) return false;

  return (
    date.getFullYear() === referenceDate.getFullYear() &&
    date.getMonth() === referenceDate.getMonth() &&
    date.getDate() === referenceDate.getDate()
  );
};

const normalizeOrder = (order, index) => ({
  id: order?.id || `DH-${String(index + 1000).padStart(4, "0")}`,
  customer: order?.customer || "Khách lẻ",
  items: Number(order?.items) || 0,
  total: Number(order?.total) || 0,
  status: order?.status || "Chờ xác nhận",
  placedAt: order?.placedAt || new Date().toISOString(),
  address: order?.address || "",
});

const slugify = (value = "") =>
  value
    .normalize("NFD")
    .replace(/[^\w\s-]/g, "")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

function RestaurantDashboard({
  user = null,
  texts = {},
  restaurants = [],
  onUpdateRestaurants = () => {},
  onBackHome = () => {},
}) {
  const [activeTab, setActiveTab] = useState("overview");
  const [restaurantList, setRestaurantList] = useState(restaurants);
  const [isRestaurantFormVisible, setIsRestaurantFormVisible] = useState(false);
  const [restaurantForm, setRestaurantForm] = useState(EMPTY_RESTAURANT_FORM);
  const [editingRestaurantId, setEditingRestaurantId] = useState(null);
  const [orders, setOrders] = useState(() => {
    if (Array.isArray(texts.orders) && texts.orders.length > 0) {
      return texts.orders.map(normalizeOrder);
    }
    return DEFAULT_ORDERS;
  });
  const [isOrderFormVisible, setIsOrderFormVisible] = useState(false);
  const [orderForm, setOrderForm] = useState(EMPTY_ORDER_FORM);
  const [editingOrderId, setEditingOrderId] = useState(null);

  useEffect(() => {
    setRestaurantList(restaurants);
  }, [restaurants]);

  const navigationTexts = {
    overview: texts.navigation?.overview ?? "Tổng quan",
    restaurants: texts.navigation?.restaurants ?? "Nhà hàng",
    orders: texts.navigation?.orders ?? "Đơn hàng",
    backHome: texts.navigation?.backHome ?? "Về trang khách",
  };

  const headerTexts = {
    eyebrow: texts.header?.eyebrow ?? "FoodFast • Nhà hàng",
    title: texts.header?.title ?? user?.name ?? "FastGrill Station",
    subtitle:
      texts.header?.subtitle ??
      "Thêm nhà hàng mới để hiển thị ngay trên giao diện khách và theo dõi đơn hàng.",
  };

  const overviewTexts = {
    heading: texts.overview?.heading ?? "Ảnh hưởng tổng quan",
    description:
      texts.overview?.description ??
      "Cập nhật nhanh hiệu suất nhà hàng trong ngày và phản hồi của khách hàng.",
    revenueLabel: texts.overview?.revenueLabel ?? "Doanh thu tháng",
    ordersTodayLabel: texts.overview?.ordersTodayLabel ?? "Đơn hôm nay",
    ratingLabel: texts.overview?.ratingLabel ?? "Đánh giá trung bình",
    recentHeading: texts.overview?.recentHeading ?? "Đơn đặt gần đây",
    recentEmpty: texts.overview?.recentEmpty ?? "Chưa có đơn mới trong 24h qua.",
    reviewHeading: texts.overview?.reviewHeading ?? "Đánh giá về nhà hàng",
  };

  const restaurantTexts = {
    heading: texts.restaurants?.heading ?? "Quản lý nhà hàng",
    description:
      texts.restaurants?.description ??
      "Thêm hoặc cập nhật thông tin nhà hàng để khách hàng thấy ngay trên trang chính.",
    addButton: texts.restaurants?.addButton ?? "Thêm nhà hàng",
    empty: texts.restaurants?.empty ?? "Chưa có nhà hàng nào được cấu hình.",
    confirmDelete:
      texts.restaurants?.confirmDelete ??
      "Bạn có chắc muốn xóa nhà hàng này khỏi danh sách?",
    actions: {
      edit: texts.restaurants?.actions?.edit ?? "Sửa",
      delete: texts.restaurants?.actions?.delete ?? "Xóa",
    },
    actionsLabel: texts.restaurants?.actionsLabel ?? "Hành động",
    form: {
      titleCreate: texts.restaurants?.form?.titleCreate ?? "Thêm nhà hàng",
      titleUpdate: texts.restaurants?.form?.titleUpdate ?? "Cập nhật nhà hàng",
      name: texts.restaurants?.form?.name ?? "Tên nhà hàng",
      badge: texts.restaurants?.form?.badge ?? "Nhãn nhanh",
      city: texts.restaurants?.form?.city ?? "Khu vực",
      deliveryTime: texts.restaurants?.form?.deliveryTime ?? "Thời gian giao",
      description: texts.restaurants?.form?.description ?? "Giới thiệu ngắn",
      tags: texts.restaurants?.form?.tags ?? "Từ khóa",
      image: texts.restaurants?.form?.image ?? "Ảnh đại diện (URL)",
      cancel: texts.restaurants?.form?.cancel ?? "Hủy",
      submitCreate: texts.restaurants?.form?.submitCreate ?? "Lưu nhà hàng",
      submitUpdate: texts.restaurants?.form?.submitUpdate ?? "Lưu thay đổi",
    },
  };

  const ordersTexts = {
    heading: texts.orders?.heading ?? "Đơn hàng đang xử lý",
    description:
      texts.orders?.description ??
      "Theo dõi trạng thái các đơn hàng gần đây tương tự bảng điều khiển admin.",
    empty: texts.orders?.empty ?? "Hiện chưa có đơn hàng nào.",
    addButton: texts.orders?.addButton ?? "Thêm đơn",
    confirmDelete: texts.orders?.confirmDelete ?? "Bạn có chắc muốn xóa đơn hàng này?",
    columns: {
      id: texts.orders?.columns?.id ?? "Mã đơn",
      customer: texts.orders?.columns?.customer ?? "Khách hàng",
      items: texts.orders?.columns?.items ?? "Số món",
      total: texts.orders?.columns?.total ?? "Tổng tiền",
      status: texts.orders?.columns?.status ?? "Trạng thái",
      placedAt: texts.orders?.columns?.placedAt ?? "Thời gian",
    },
    actions: {
      edit: texts.orders?.actions?.edit ?? "Sửa",
      delete: texts.orders?.actions?.delete ?? "Xóa",
    },
    actionsLabel: texts.orders?.actionsLabel ?? "Hành động",
    form: {
      titleCreate: texts.orders?.form?.titleCreate ?? "Tạo đơn mới",
      titleUpdate: texts.orders?.form?.titleUpdate ?? "Cập nhật đơn",
      id: texts.orders?.form?.id ?? "Mã đơn",
      customer: texts.orders?.form?.customer ?? "Khách hàng",
      items: texts.orders?.form?.items ?? "Số món",
      total: texts.orders?.form?.total ?? "Tổng tiền (VNĐ)",
      status: texts.orders?.form?.status ?? "Trạng thái",
      placedAt: texts.orders?.form?.placedAt ?? "Thời gian đặt",
      address: texts.orders?.form?.address ?? "Địa chỉ giao hàng",
      statusOptions:
        texts.orders?.form?.statusOptions ?? [
          "Chờ xác nhận",
          "Chuẩn bị",
          "Đang giao",
          "Đã hoàn tất",
          "Đã hủy",
        ],
      cancel: texts.orders?.form?.cancel ?? "Hủy",
      submitCreate: texts.orders?.form?.submitCreate ?? "Tạo đơn",
      submitUpdate: texts.orders?.form?.submitUpdate ?? "Lưu thay đổi",
    },
  };

  const ratingInfo = {
    score: Number(texts.rating?.score ?? DEFAULT_RATING.score),
    totalReviews: Number(texts.rating?.totalReviews ?? DEFAULT_RATING.totalReviews),
    summary: texts.rating?.summary ?? DEFAULT_RATING.summary,
    breakdown: Array.isArray(texts.rating?.breakdown)
      ? texts.rating.breakdown
      : DEFAULT_RATING.breakdown,
  };

  const ratingScore = Number.isFinite(ratingInfo.score)
    ? ratingInfo.score
    : DEFAULT_RATING.score;

  const latestOrderDate = useMemo(() => {
    const sorted = orders
      .map((order) => parseDate(order.placedAt))
      .filter(Boolean)
      .sort((a, b) => b.getTime() - a.getTime());
    return sorted[0] || new Date();
  }, [orders]);

  const monthlyRevenue = useMemo(() => {
    return orders
      .filter((order) => isSameMonth(order.placedAt, latestOrderDate))
      .reduce((sum, order) => sum + (Number(order.total) || 0), 0);
  }, [orders, latestOrderDate]);

  const todaysOrders = useMemo(() => {
    return orders.filter((order) => isSameDay(order.placedAt, latestOrderDate)).length;
  }, [orders, latestOrderDate]);

  const processingOrders = useMemo(
    () =>
      orders.filter((order) => ACTIVE_ORDER_STATUSES.has(String(order.status).toLowerCase())).length,
    [orders]
  );

  const recentOrders = useMemo(() => {
    return orders
      .slice()
      .sort((a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime())
      .slice(0, 5);
  }, [orders]);

  const uniqueTags = useMemo(() => {
    const tags = new Set();
    restaurantList.forEach((restaurant) => {
      (restaurant.tags || []).forEach((tag) => tags.add(tag));
    });
    return Array.from(tags);
  }, [restaurantList]);

  const ratingValue = `${ratingScore.toFixed(1)} / 5`;

  const handleStartAddRestaurant = () => {
    setActiveTab("restaurants");
    setIsRestaurantFormVisible(true);
    setEditingRestaurantId(null);
    setRestaurantForm(EMPTY_RESTAURANT_FORM);
  };

  const handleEditRestaurant = (restaurant) => {
    setActiveTab("restaurants");
    setIsRestaurantFormVisible(true);
    setEditingRestaurantId(restaurant.id);
    setRestaurantForm({
      name: restaurant.name || "",
      badge: restaurant.badge || "",
      city: restaurant.city || "",
      deliveryTime: restaurant.deliveryTime || "",
      description: restaurant.description || "",
      tags: restaurant.tags?.join(", ") || "",
      img: restaurant.img || restaurant.image || "",
    });
  };

  const handleCancelRestaurantForm = () => {
    setIsRestaurantFormVisible(false);
    setEditingRestaurantId(null);
    setRestaurantForm(EMPTY_RESTAURANT_FORM);
  };

  const handleRestaurantFieldChange = (field, value) => {
    setRestaurantForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmitRestaurant = (event) => {
    event.preventDefault();
    const trimmedName = restaurantForm.name.trim();
    if (!trimmedName) return;

    const slug = slugify(trimmedName);
    const tags = restaurantForm.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    const payload = {
      id: editingRestaurantId || slug || `restaurant-${Date.now()}`,
      slug: slug || editingRestaurantId || `restaurant-${Date.now()}`,
      name: trimmedName,
      badge: restaurantForm.badge.trim() || undefined,
      city: restaurantForm.city.trim(),
      deliveryTime: restaurantForm.deliveryTime.trim(),
      description: restaurantForm.description.trim(),
      tags,
      img: restaurantForm.img.trim() || undefined,
      menuItemIds: [],
    };

    setRestaurantList((prev) => {
      const nextList = editingRestaurantId
        ? prev.map((item) => (item.id === editingRestaurantId ? { ...item, ...payload } : item))
        : [...prev, payload];
      onUpdateRestaurants(nextList);
      return nextList;
    });

    handleCancelRestaurantForm();
  };

  const handleDeleteRestaurant = (restaurant) => {
    const message =
      restaurantTexts.confirmDelete ?? "Bạn có chắc muốn xóa nhà hàng này khỏi danh sách?";
    // eslint-disable-next-line no-alert
    const shouldDelete = typeof window === "undefined" ? true : window.confirm(message);
    if (!shouldDelete) return;

    setRestaurantList((prev) => {
      const next = prev.filter((item) => item.id !== restaurant.id);
      onUpdateRestaurants(next);
      return next;
    });

    if (editingRestaurantId === restaurant.id) {
      handleCancelRestaurantForm();
    }
  };

  const formatOrderDateInput = (value) => {
    const date = parseDate(value);
    if (!date) {
      return "";
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleStartAddOrder = () => {
    setActiveTab("orders");
    setIsOrderFormVisible(true);
    setEditingOrderId(null);
    setOrderForm({
      ...EMPTY_ORDER_FORM,
      placedAt: formatOrderDateInput(new Date().toISOString()),
    });
  };

  const handleStartEditOrder = (order) => {
    setActiveTab("orders");
    setIsOrderFormVisible(true);
    setEditingOrderId(order.id);
    setOrderForm({
      customer: order.customer,
      items: String(order.items),
      total: String(order.total),
      status: order.status,
      placedAt: formatOrderDateInput(order.placedAt),
      address: order.address || "",
      id: order.id,
    });
  };

  const handleCancelOrderForm = () => {
    setIsOrderFormVisible(false);
    setEditingOrderId(null);
    setOrderForm(EMPTY_ORDER_FORM);
  };

  const handleOrderFieldChange = (field, value) => {
    setOrderForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmitOrder = (event) => {
    event.preventDefault();
    const trimmedCustomer = orderForm.customer.trim();
    if (!trimmedCustomer) {
      return;
    }

    const payload = {
      id: editingOrderId,
      customer: trimmedCustomer,
      items: Math.max(Number(orderForm.items) || 0, 0),
      total: Math.max(Number(orderForm.total) || 0, 0),
      status: orderForm.status || "Chờ xác nhận",
      placedAt: orderForm.placedAt || new Date().toISOString(),
      address: orderForm.address.trim(),
    };

    setOrders((prevOrders) => {
      if (editingOrderId) {
        return prevOrders.map((order) => (order.id === editingOrderId ? { ...order, ...payload } : order));
      }

      const nextNumber = prevOrders
        .map((order) => Number(String(order.id).replace(/\D+/g, "")) || 0)
        .reduce((max, value) => Math.max(max, value), 0);

      return [
        ...prevOrders,
        {
          ...payload,
          id: payload.id || `DH-${String(nextNumber + 1).padStart(4, "0")}`,
        },
      ];
    });

    handleCancelOrderForm();
  };

  const handleDeleteOrder = (order) => {
    const message = ordersTexts.confirmDelete ?? "Bạn có chắc muốn xóa đơn hàng này?";
    // eslint-disable-next-line no-alert
    const shouldDelete = typeof window === "undefined" ? true : window.confirm(message);
    if (!shouldDelete) {
      return;
    }

    setOrders((prevOrders) => prevOrders.filter((item) => item.id !== order.id));

    if (editingOrderId === order.id) {
      handleCancelOrderForm();
    }
  };

  const statusBadgeClass = (status) => {
    const key = String(status).toLowerCase();
    const variant = STATUS_VARIANTS[key] || "info";
    return `status-badge status-badge--${variant}`;
  };

  return (
    <div className="restaurant-dashboard">
      <RestaurantSidebar
        activeTab={activeTab}
        navigationTexts={navigationTexts}
        onChangeTab={setActiveTab}
        onBackHome={onBackHome}
      />
      <main className="restaurant-main" aria-live="polite">
        <RestaurantHeader
          activeTab={activeTab}
          headerTexts={headerTexts}
          navigationTexts={navigationTexts}
          restaurantTexts={restaurantTexts}
          ordersTexts={ordersTexts}
          onAddRestaurant={handleStartAddRestaurant}
          onAddOrder={handleStartAddOrder}
          onBackHome={onBackHome}
        />

        {activeTab === "overview" && (
          <RestaurantOverview
            overviewTexts={overviewTexts}
            uniqueCategories={uniqueTags}
            menuCount={restaurantList.length}
            orderCount={orders.length}
            monthlyRevenue={monthlyRevenue}
            processingOrders={processingOrders}
            todaysOrders={todaysOrders}
            ratingValue={ratingValue}
            ratingInfo={ratingInfo}
            recentOrders={recentOrders}
            formatCurrency={formatCurrency}
            formatDateTime={formatDateTime}
            statusBadgeClass={statusBadgeClass}
          />
        )}

        {activeTab === "restaurants" && (
          <RestaurantListSection
            texts={restaurantTexts}
            isFormVisible={isRestaurantFormVisible}
            editingRestaurantId={editingRestaurantId}
            restaurantForm={restaurantForm}
            restaurants={restaurantList}
            onFieldChange={handleRestaurantFieldChange}
            onSubmit={handleSubmitRestaurant}
            onCancel={handleCancelRestaurantForm}
            onEditRestaurant={handleEditRestaurant}
            onDeleteRestaurant={handleDeleteRestaurant}
          />
        )}

        {activeTab === "orders" && (
          <RestaurantOrdersSection
            texts={ordersTexts}
            isFormVisible={isOrderFormVisible}
            editingOrderId={editingOrderId}
            orderForm={orderForm}
            orders={orders}
            onFieldChange={handleOrderFieldChange}
            onSubmit={handleSubmitOrder}
            onCancel={handleCancelOrderForm}
            onEditOrder={handleStartEditOrder}
            onDeleteOrder={handleDeleteOrder}
            formatCurrency={formatCurrency}
            formatDateTime={formatDateTime}
            statusBadgeClass={statusBadgeClass}
          />
        )}
      </main>
    </div>
  );
}

export default RestaurantDashboard;
