import { useEffect, useMemo, useState } from "react";
import "./RestaurantDashboard.css";
import RestaurantHeader from "./components/RestaurantHeader";
import RestaurantMenuSection from "./components/RestaurantMenuSection";
import RestaurantOrdersSection from "./components/RestaurantOrdersSection";
import RestaurantOverview from "./components/RestaurantOverview";
import RestaurantSidebar from "./components/RestaurantSidebar";

const DEFAULT_MENU_ITEMS = [
  {
    id: "dish-01",
    name: "Burger Blaze Bò Mỹ",
    price: 69000,
    category: "Burger",
    status: "available",
    description: "Burger bò mỹ nướng than, phô mai cheddar và bacon giòn.",
    tag: "Best Seller",
  },
  {
    id: "dish-02",
    name: "Pizza Lava Phô Mai",
    price: 189000,
    category: "Pizza",
    status: "available",
    description: "Đế mỏng thủ công, sốt cà chua Ý, phô mai mozzarella kéo sợi.",
    tag: null,
  },
  {
    id: "dish-03",
    name: "Salad Caesar Gà Nướng",
    price: 59000,
    category: "Salad",
    status: "soldout",
    description: "Xà lách romaine, sốt caesar, phô mai parmesan và gà nướng.",
    tag: "Seasonal",
  },
];

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

const EMPTY_DISH_FORM = {
  name: "",
  price: "",
  category: "",
  description: "",
  status: "available",
  tag: "",
  image: "",
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

const isSameMonth = (value, reference = new Date()) => {
  if (!value) return false;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;

  return (
    date.getFullYear() === reference.getFullYear() &&
    date.getMonth() === reference.getMonth()
  );
};

const normalizeDish = (dish, index, categoryLabelById = new Map()) => ({
  id: dish?.id || `dish-${String(index + 1).padStart(2, "0")}`,
  name: dish?.name?.trim() || "",
  price: Number(dish?.price) || 0,
  category:
    dish?.category?.trim() || categoryLabelById.get(dish?.categoryId) || "",
  categoryId: dish?.categoryId || null,
  description: dish?.description?.trim() || "",
  status: dish?.status === "soldout" ? "soldout" : "available",
  tag: dish?.tag?.trim() || "",
  image: dish?.image || dish?.imageUrl || dish?.thumbnail || "",
});

const normalizeOrder = (order, index) => ({
  id: order?.id || `DH-${String(index + 1000).padStart(4, "0")}`,
  customer: order?.customer || "Khách lẻ",
  items: Number(order?.items) || 0,
  total: Number(order?.total) || 0,
  status: order?.status || "Chờ xác nhận",
  placedAt: order?.placedAt || new Date().toISOString(),
  address: order?.address || "",
});

const parseDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date;
};

const getNextDishId = (items = []) => {
  const lastNumber = items
    .map((item) => Number(String(item.id).replace(/\D+/g, "")) || 0)
    .reduce((max, value) => Math.max(max, value), 0);

  return `dish-${String(lastNumber + 1).padStart(2, "0")}`;
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

function RestaurantDashboard({
  user = null,
  texts = {},
  onBackHome = () => {},
  menuItems: remoteMenuItems = [],
  categories = [],
  onCreateMenuItem,
  onUpdateMenuItem,
  onDeleteMenuItem,
  onCreateOrder,
  onUpdateOrder,
  onDeleteOrder,
}) {
  const categoryLabelById = useMemo(() => {
    const map = new Map();

    categories.forEach((category) => {
      const label =
        category?.title || category?.name || category?.slug || category?.id;
      if (label) {
        map.set(category.id, label);
        if (category.slug) {
          map.set(category.slug, label);
        }
      }
    });

    return map;
  }, [categories]);

  const [activeTab, setActiveTab] = useState("overview");
  const [menuItems, setMenuItems] = useState(() => {
    if (Array.isArray(remoteMenuItems) && remoteMenuItems.length > 0) {
      return remoteMenuItems.map((item, index) =>
        normalizeDish(item, index, categoryLabelById)
      );
    }

    if (Array.isArray(texts.menuItems) && texts.menuItems.length > 0) {
      return texts.menuItems.map((item, index) =>
        normalizeDish(item, index, categoryLabelById)
      );
    }
    return DEFAULT_MENU_ITEMS;
  });
  const [orders, setOrders] = useState(() => {
    if (Array.isArray(texts.orders) && texts.orders.length > 0) {
      return texts.orders.map(normalizeOrder);
    }
    return DEFAULT_ORDERS;
  });
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [dishForm, setDishForm] = useState(EMPTY_DISH_FORM);
  const [editingDishId, setEditingDishId] = useState(null);
  const [isOrderFormVisible, setIsOrderFormVisible] = useState(false);
  const [orderForm, setOrderForm] = useState(EMPTY_ORDER_FORM);
  const [editingOrderId, setEditingOrderId] = useState(null);

  useEffect(() => {
    if (!Array.isArray(remoteMenuItems) || remoteMenuItems.length === 0) {
      return;
    }

    setMenuItems(
      remoteMenuItems.map((item, index) =>
        normalizeDish(item, index, categoryLabelById)
      )
    );
  }, [remoteMenuItems, categoryLabelById]);

  const navigationTexts = {
    overview: texts.navigation?.overview ?? "Tổng quan",
    menu: texts.navigation?.menu ?? "Món ăn",
    orders: texts.navigation?.orders ?? "Đơn hàng",
    backHome: texts.navigation?.backHome ?? "Về trang khách",
  };

  const headerTexts = {
    eyebrow: texts.header?.eyebrow ?? "FoodFast • Nhà hàng",
    title: texts.header?.title ?? user?.name ?? "FastGrill Station",
    subtitle:
      texts.header?.subtitle ??
      "Quản lý thực đơn, theo dõi doanh thu và cập nhật trạng thái đơn hàng theo thời gian thực.",
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

  const menuTexts = {
    heading: texts.menu?.heading ?? "Quản lý món ăn",
    description:
      texts.menu?.description ??
      "Chủ động cập nhật món mới, chỉnh sửa thông tin và tạm ngưng món.",
    addButton: texts.menu?.addButton ?? "Thêm món",
    empty: texts.menu?.empty ?? "Danh sách món hiện đang trống.",
    actions: {
      edit: texts.menu?.actions?.edit ?? "Sửa",
      delete: texts.menu?.actions?.delete ?? "Xóa",
    },
    actionsLabel: texts.menu?.actionsLabel ?? "Hành động",
    form: {
      titleCreate: texts.menu?.form?.titleCreate ?? "Thêm món mới",
      titleUpdate: texts.menu?.form?.titleUpdate ?? "Cập nhật món",
      name: texts.menu?.form?.name ?? "Tên món",
      price: texts.menu?.form?.price ?? "Giá bán (VNĐ)",
      image: texts.menu?.form?.image ?? "Ảnh món",
      imageHint:
        texts.menu?.form?.imageHint ?? "Hỗ trợ JPG, PNG. Giới hạn kích thước 2MB",
      category: texts.menu?.form?.category ?? "Danh mục",
      description: texts.menu?.form?.description ?? "Mô tả ngắn",
      status: texts.menu?.form?.status ?? "Trạng thái",
      tag: texts.menu?.form?.tag ?? "Nhãn nổi bật",
      statusOptions:
        texts.menu?.form?.statusOptions ?? [
          { value: "available", label: "Đang bán" },
          { value: "soldout", label: "Hết hàng" },
        ],
      cancel: texts.menu?.form?.cancel ?? "Hủy",
      submitCreate: texts.menu?.form?.submitCreate ?? "Thêm món",
      submitUpdate: texts.menu?.form?.submitUpdate ?? "Lưu thay đổi",
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
    totalReviews: Number(
      texts.rating?.totalReviews ?? DEFAULT_RATING.totalReviews
    ),
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
      orders.filter((order) =>
        ACTIVE_ORDER_STATUSES.has(String(order.status).toLowerCase())
      ).length,
    [orders]
  );

  const recentOrders = useMemo(() => {
    return orders
      .slice()
      .sort((a, b) =>
        new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime()
      )
      .slice(0, 5);
  }, [orders]);

  const uniqueCategories = useMemo(() => {
    const categories = new Set();
    menuItems.forEach((item) => {
      if (item.category) {
        categories.add(item.category);
      }
    });
    return Array.from(categories);
  }, [menuItems]);

  const categoryOptions = useMemo(() => {
    const options = new Set();
    categories.forEach((category) => {
      const label = category?.title || category?.name || category?.slug || "";
      if (label) {
        options.add(label);
      }
    });
    uniqueCategories.forEach((category) => {
      if (category) {
        options.add(category);
      }
    });
    return Array.from(options);
  }, [categories, uniqueCategories]);

  const ratingValue = `${ratingScore.toFixed(1)} / 5`;

  const handleStartAddDish = () => {
    setActiveTab("menu");
    setIsFormVisible(true);
    setEditingDishId(null);
    setDishForm((prev) => ({
      ...EMPTY_DISH_FORM,
      category: prev.category || categoryOptions[0] || "",
    }));
  };

  const handleStartEditDish = (dish) => {
    setActiveTab("menu");
    setIsFormVisible(true);
    setEditingDishId(dish.id);
    setDishForm({
      name: dish.name,
      price: String(dish.price),
      category: dish.category,
      description: dish.description,
      status: dish.status,
      tag: dish.tag || "",
      image: dish.image || "",
    });
  };

  const handleCancelForm = () => {
    setIsFormVisible(false);
    setEditingDishId(null);
    setDishForm(EMPTY_DISH_FORM);
  };

  const handleDishFieldChange = (field, value) => {
    setDishForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleDishImageSelect = (file) => {
    if (!file) {
      setDishForm((prev) => ({ ...prev, image: "" }));
      return;
    }

    const MAX_SIZE = 2 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      if (typeof window !== "undefined" && typeof window.alert === "function") {
        window.alert("Vui lòng chọn ảnh nhỏ hơn 2MB");
      }
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setDishForm((prev) => ({ ...prev, image: reader.result || "" }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitDish = async (event) => {
    event.preventDefault();
    const trimmedName = dishForm.name.trim();
    if (!trimmedName) {
      return;
    }

    const sanitizedPrice = Math.max(Number(dishForm.price) || 0, 0);
    const normalizedCategory = dishForm.category.trim();
    const selectedCategoryId = (() => {
      const normalized = normalizedCategory.toLowerCase();
      if (!normalized) return null;

      const matched = categories.find((category) => {
        const possibleLabels = [
          category.id,
          category.slug,
          category.title,
          category.name,
        ].filter(Boolean);

        return possibleLabels.some(
          (label) => String(label).trim().toLowerCase() === normalized
        );
      });

      return matched?.id ?? null;
    })();
    const payload = {
      id: editingDishId,
      name: trimmedName,
      price: sanitizedPrice,
      category: normalizedCategory,
      categoryId: selectedCategoryId,
      description: dishForm.description.trim(),
      status: dishForm.status === "soldout" ? "soldout" : "available",
      tag: dishForm.tag.trim(),
      image: dishForm.image,
    };

    const nextDishId = editingDishId || payload.id || getNextDishId(menuItems);
    const finalDish = { ...payload, id: nextDishId };

    setMenuItems((prevItems) => {
      if (editingDishId) {
        return prevItems.map((item) =>
          item.id === editingDishId ? { ...item, ...finalDish } : item
        );
      }

      return [...prevItems, finalDish];
    });

    if (editingDishId) {
      onUpdateMenuItem?.(finalDish);
    } else {
      onCreateMenuItem?.(finalDish);
    }

    handleCancelForm();
  };

  const handleDeleteDish = (dish) => {
    const message = menuTexts.confirmDelete ?? "Bạn có chắc muốn xóa món này?";
    const shouldDelete = typeof window === "undefined" ? true : window.confirm(message);
    if (!shouldDelete) {
      return;
    }

    setMenuItems((prevItems) => prevItems.filter((item) => item.id !== dish.id));
    onDeleteMenuItem?.(dish.id);

    if (editingDishId === dish.id) {
      handleCancelForm();
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
    const sanitizedTotal = Math.max(Number(orderForm.total) || 0, 0);
    const sanitizedItems = Math.max(Number(orderForm.items) || 0, 0);

    const payload = {
      id: editingOrderId,
      customer: orderForm.customer.trim() || "Khách lẻ",
      items: sanitizedItems,
      total: sanitizedTotal,
      status: orderForm.status,
      placedAt: orderForm.placedAt || new Date().toISOString(),
      address: orderForm.address.trim(),
    };

    setOrders((prevOrders) => {
      if (editingOrderId) {
        const updatedOrders = prevOrders.map((order) =>
          order.id === editingOrderId ? { ...order, ...payload } : order
        );
        onUpdateOrder?.({ ...payload, id: editingOrderId });
        return updatedOrders;
      }

      const nextNumber = prevOrders
        .map((order) => Number(String(order.id).replace(/\D+/g, "")) || 0)
        .reduce((max, value) => Math.max(max, value), 0);

      const nextOrder = {
        ...payload,
        id: payload.id || `DH-${String(nextNumber + 1).padStart(4, "0")}`,
      };

      onCreateOrder?.(nextOrder);

      return [...prevOrders, nextOrder];
    });

    handleCancelOrderForm();
  };

  const handleDeleteOrder = (order) => {
    const message = ordersTexts.confirmDelete ?? "Bạn có chắc muốn xóa đơn hàng này?";
    const shouldDelete = typeof window === "undefined" ? true : window.confirm(message);
    if (!shouldDelete) {
      return;
    }

    setOrders((prevOrders) => prevOrders.filter((item) => item.id !== order.id));
    onDeleteOrder?.(order.id);

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
          menuTexts={menuTexts}
          ordersTexts={ordersTexts}
          onAddDish={handleStartAddDish}
          onAddOrder={handleStartAddOrder}
          onBackHome={onBackHome}
        />

        {activeTab === "overview" && (
          <RestaurantOverview
            overviewTexts={overviewTexts}
            uniqueCategories={uniqueCategories}
            menuCount={menuItems.length}
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

        {activeTab === "menu" && (
        <RestaurantMenuSection
          texts={menuTexts}
          isFormVisible={isFormVisible}
          editingDishId={editingDishId}
          dishForm={dishForm}
          categoryOptions={categoryOptions}
          menuItems={menuItems}
          onFieldChange={handleDishFieldChange}
          onImageSelect={handleDishImageSelect}
          onSubmit={handleSubmitDish}
          onCancel={handleCancelForm}
          onEditDish={handleStartEditDish}
          onDeleteDish={handleDeleteDish}
          formatCurrency={formatCurrency}
            statusBadgeClass={statusBadgeClass}
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
