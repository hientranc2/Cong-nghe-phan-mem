import { useMemo, useState } from "react";
import "./RestaurantDashboard.css";

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
};

const STATUS_VARIANTS = {
  "đang giao": "info",
  "chuẩn bị": "warning",
  "chờ xác nhận": "pending",
  "đã hoàn tất": "success",
  "đã hủy": "danger",
  "tạm dừng": "danger",
  "available": "success",
  "đang bán": "success",
  "soldout": "danger",
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

const isToday = (value) => {
  if (!value) return false;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;

  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
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

const normalizeDish = (dish, index) => ({
  id: dish?.id || `dish-${String(index + 1).padStart(2, "0")}`,
  name: dish?.name?.trim() || "",
  price: Number(dish?.price) || 0,
  category: dish?.category?.trim() || "",
  description: dish?.description?.trim() || "",
  status: dish?.status === "soldout" ? "soldout" : "available",
  tag: dish?.tag?.trim() || "",
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

function RestaurantDashboard({ user = null, texts = {}, onBackHome = () => {} }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [menuItems, setMenuItems] = useState(() => {
    if (Array.isArray(texts.menuItems) && texts.menuItems.length > 0) {
      return texts.menuItems.map(normalizeDish);
    }
    return DEFAULT_MENU_ITEMS;
  });
  const [orders] = useState(() => {
    if (Array.isArray(texts.orders) && texts.orders.length > 0) {
      return texts.orders.map(normalizeOrder);
    }
    return DEFAULT_ORDERS;
  });
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [dishForm, setDishForm] = useState(EMPTY_DISH_FORM);
  const [editingDishId, setEditingDishId] = useState(null);

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
    form: {
      titleCreate: texts.menu?.form?.titleCreate ?? "Thêm món mới",
      titleUpdate: texts.menu?.form?.titleUpdate ?? "Cập nhật món",
      name: texts.menu?.form?.name ?? "Tên món",
      price: texts.menu?.form?.price ?? "Giá bán (VNĐ)",
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
    columns: {
      id: texts.orders?.columns?.id ?? "Mã đơn",
      customer: texts.orders?.columns?.customer ?? "Khách hàng",
      items: texts.orders?.columns?.items ?? "Số món",
      total: texts.orders?.columns?.total ?? "Tổng tiền",
      status: texts.orders?.columns?.status ?? "Trạng thái",
      placedAt: texts.orders?.columns?.placedAt ?? "Thời gian",
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

  const monthlyRevenue = useMemo(() => {
    const reference = new Date();
    return orders
      .filter((order) => isSameMonth(order.placedAt, reference))
      .reduce((sum, order) => sum + (Number(order.total) || 0), 0);
  }, [orders]);

  const todaysOrders = useMemo(
    () => orders.filter((order) => isToday(order.placedAt)).length,
    [orders]
  );

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

  const ratingValue = `${ratingScore.toFixed(1)} / 5`;

  const handleStartAddDish = () => {
    setActiveTab("menu");
    setIsFormVisible(true);
    setEditingDishId(null);
    setDishForm(EMPTY_DISH_FORM);
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

  const handleSubmitDish = (event) => {
    event.preventDefault();
    const trimmedName = dishForm.name.trim();
    if (!trimmedName) {
      return;
    }

    const sanitizedPrice = Math.max(Number(dishForm.price) || 0, 0);
    const normalizedCategory = dishForm.category.trim();
    const payload = {
      id: editingDishId,
      name: trimmedName,
      price: sanitizedPrice,
      category: normalizedCategory,
      description: dishForm.description.trim(),
      status: dishForm.status === "soldout" ? "soldout" : "available",
      tag: dishForm.tag.trim(),
    };

    setMenuItems((prevItems) => {
      if (editingDishId) {
        return prevItems.map((item) =>
          item.id === editingDishId ? { ...item, ...payload } : item
        );
      }

      const nextNumber = prevItems
        .map((item) => Number(String(item.id).replace(/\D+/g, "")) || 0)
        .reduce((max, value) => Math.max(max, value), 0);

      return [
        ...prevItems,
        {
          ...payload,
          id: payload.id || `dish-${String(nextNumber + 1).padStart(2, "0")}`,
        },
      ];
    });

    handleCancelForm();
  };

  const handleDeleteDish = (dish) => {
    const message = menuTexts.confirmDelete ?? "Bạn có chắc muốn xóa món này?";
    // eslint-disable-next-line no-alert
    const shouldDelete = typeof window === "undefined" ? true : window.confirm(message);
    if (!shouldDelete) {
      return;
    }

    setMenuItems((prevItems) => prevItems.filter((item) => item.id !== dish.id));

    if (editingDishId === dish.id) {
      handleCancelForm();
    }
  };

  const statusBadgeClass = (status) => {
    const key = String(status).toLowerCase();
    const variant = STATUS_VARIANTS[key] || "info";
    return `status-badge status-badge--${variant}`;
  };

  return (
    <div className="restaurant-dashboard">
      <aside className="restaurant-sidebar">
        <div className="restaurant-sidebar__brand">
          <span className="brand-dot" aria-hidden="true" />
          <div>
            <strong>FoodFast</strong>
            <small>Partner</small>
          </div>
        </div>
        <nav className="restaurant-nav" aria-label="Điều hướng nhà hàng">
          <button
            type="button"
            className={
              activeTab === "overview"
                ? "restaurant-nav__item is-active"
                : "restaurant-nav__item"
            }
            onClick={() => setActiveTab("overview")}
          >
            <span aria-hidden="true">📊</span>
            {navigationTexts.overview}
          </button>
          <button
            type="button"
            className={
              activeTab === "menu"
                ? "restaurant-nav__item is-active"
                : "restaurant-nav__item"
            }
            onClick={() => setActiveTab("menu")}
          >
            <span aria-hidden="true">🍽️</span>
            {navigationTexts.menu}
          </button>
          <button
            type="button"
            className={
              activeTab === "orders"
                ? "restaurant-nav__item is-active"
                : "restaurant-nav__item"
            }
            onClick={() => setActiveTab("orders")}
          >
            <span aria-hidden="true">🧾</span>
            {navigationTexts.orders}
          </button>
        </nav>
        <button
          type="button"
          className="restaurant-nav__secondary"
          onClick={onBackHome}
        >
          ← {navigationTexts.backHome}
        </button>
      </aside>
      <main className="restaurant-main" aria-live="polite">
        <header className="restaurant-header">
          <div className="restaurant-header__info">
            <span className="restaurant-header__eyebrow">{headerTexts.eyebrow}</span>
            <h1>{headerTexts.title}</h1>
            <p>{headerTexts.subtitle}</p>
          </div>
          <div className="restaurant-header__actions">
            <button
              type="button"
              className="restaurant-btn"
              onClick={handleStartAddDish}
            >
              + {menuTexts.addButton}
            </button>
            <button
              type="button"
              className="restaurant-btn restaurant-btn--ghost"
              onClick={onBackHome}
            >
              {navigationTexts.backHome}
            </button>
          </div>
        </header>

        {activeTab === "overview" && (
          <section className="restaurant-section">
            <header className="restaurant-section__header">
              <div>
                <h2>{overviewTexts.heading}</h2>
                <p>{overviewTexts.description}</p>
              </div>
              <div className="restaurant-section__chips">
                <span>{uniqueCategories.length} danh mục</span>
                <span>{menuItems.length} món ăn</span>
                <span>{orders.length} đơn hàng/tháng</span>
              </div>
            </header>
            <div className="restaurant-kpi-grid">
              <div className="restaurant-kpi-card">
                <span>{overviewTexts.revenueLabel}</span>
                <strong>{formatCurrency(monthlyRevenue)}</strong>
                <small>{processingOrders} đơn đang hoạt động</small>
              </div>
              <div className="restaurant-kpi-card">
                <span>{overviewTexts.ordersTodayLabel}</span>
                <strong>{todaysOrders}</strong>
                <small>Trong ngày hôm nay</small>
              </div>
              <div className="restaurant-kpi-card">
                <span>{overviewTexts.ratingLabel}</span>
                <strong>{ratingValue}</strong>
                <small>{ratingInfo.summary}</small>
              </div>
            </div>
            <div className="restaurant-panels">
              <section className="restaurant-card">
                <header className="restaurant-card__header">
                  <div>
                    <h3>{overviewTexts.recentHeading}</h3>
                    <p>Danh sách các đơn hàng mới nhất của nhà hàng.</p>
                  </div>
                </header>
                {recentOrders.length === 0 ? (
                  <p className="restaurant-empty">{overviewTexts.recentEmpty}</p>
                ) : (
                  <ul className="restaurant-recent-list">
                    {recentOrders.map((order) => (
                      <li key={order.id} className="restaurant-recent-item">
                        <div className="recent-item__meta">
                          <span className="recent-item__id">{order.id}</span>
                          <strong>{order.customer}</strong>
                          <time dateTime={order.placedAt}>{formatDateTime(order.placedAt)}</time>
                        </div>
                        <div className="recent-item__status">
                          <span className={statusBadgeClass(order.status)}>
                            {order.status}
                          </span>
                          <span className="recent-item__total">
                            {formatCurrency(order.total)}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
              <section className="restaurant-card restaurant-card--feedback">
                <header className="restaurant-card__header">
                  <div>
                    <h3>{overviewTexts.reviewHeading}</h3>
                    <p>
                      Trung bình {ratingValue} dựa trên {ratingInfo.totalReviews} đánh giá.
                    </p>
                  </div>
                </header>
                <div className="restaurant-rating">
                  <div className="restaurant-rating__value">{ratingValue}</div>
                  <p>{ratingInfo.summary}</p>
                  <ul className="restaurant-rating__breakdown">
                    {ratingInfo.breakdown.map((item) => (
                      <li key={item.label}>
                        <span>{item.label}</span>
                        <div className="rating-progress">
                          <div
                            className="rating-progress__bar"
                            style={{ width: `${Math.min(item.percent, 100)}%` }}
                          />
                        </div>
                        <span>{item.percent}%</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            </div>
          </section>
        )}

        {activeTab === "menu" && (
          <section className="restaurant-section">
            <header className="restaurant-section__header">
              <div>
                <h2>{menuTexts.heading}</h2>
                <p>{menuTexts.description}</p>
              </div>
            </header>

            {isFormVisible && (
              <form className="restaurant-card restaurant-form" onSubmit={handleSubmitDish}>
                <div className="restaurant-form__header">
                  <h3>
                    {editingDishId
                      ? menuTexts.form.titleUpdate
                      : menuTexts.form.titleCreate}
                  </h3>
                </div>
                <div className="restaurant-form__grid">
                  <label>
                    <span>{menuTexts.form.name}</span>
                    <input
                      required
                      type="text"
                      value={dishForm.name}
                      onChange={(event) =>
                        handleDishFieldChange("name", event.target.value)
                      }
                    />
                  </label>
                  <label>
                    <span>{menuTexts.form.price}</span>
                    <input
                      required
                      min="0"
                      type="number"
                      value={dishForm.price}
                      onChange={(event) =>
                        handleDishFieldChange("price", event.target.value)
                      }
                    />
                  </label>
                  <label>
                    <span>{menuTexts.form.category}</span>
                    <input
                      type="text"
                      placeholder={
                        uniqueCategories.length > 0
                          ? `VD: ${uniqueCategories[0]}`
                          : "Burger"
                      }
                      value={dishForm.category}
                      onChange={(event) =>
                        handleDishFieldChange("category", event.target.value)
                      }
                    />
                  </label>
                  <label>
                    <span>{menuTexts.form.status}</span>
                    <select
                      value={dishForm.status}
                      onChange={(event) =>
                        handleDishFieldChange("status", event.target.value)
                      }
                    >
                      {menuTexts.form.statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="restaurant-form__full">
                    <span>{menuTexts.form.description}</span>
                    <textarea
                      rows={3}
                      value={dishForm.description}
                      onChange={(event) =>
                        handleDishFieldChange("description", event.target.value)
                      }
                    />
                  </label>
                  <label>
                    <span>{menuTexts.form.tag}</span>
                    <input
                      type="text"
                      value={dishForm.tag}
                      onChange={(event) =>
                        handleDishFieldChange("tag", event.target.value)
                      }
                    />
                  </label>
                </div>
                <div className="restaurant-form__actions">
                  <button
                    type="button"
                    className="restaurant-btn restaurant-btn--ghost"
                    onClick={handleCancelForm}
                  >
                    {menuTexts.form.cancel}
                  </button>
                  <button type="submit" className="restaurant-btn">
                    {editingDishId
                      ? menuTexts.form.submitUpdate
                      : menuTexts.form.submitCreate}
                  </button>
                </div>
              </form>
            )}

            <div className="restaurant-card">
              {menuItems.length === 0 ? (
                <p className="restaurant-empty">{menuTexts.empty}</p>
              ) : (
                <div className="restaurant-table" role="table">
                  <div className="restaurant-table__header" role="row">
                    <span role="columnheader">{menuTexts.form.name}</span>
                    <span role="columnheader">{menuTexts.form.category}</span>
                    <span role="columnheader">{menuTexts.form.price}</span>
                    <span role="columnheader">{menuTexts.form.status}</span>
                    <span role="columnheader">{menuTexts.form.tag}</span>
                    <span role="columnheader" className="table-actions">
                      {menuTexts.actionsLabel ?? "Hành động"}
                    </span>
                  </div>
                  {menuItems.map((dish) => (
                    <div
                      key={dish.id}
                      className="restaurant-table__row"
                      role="row"
                    >
                      <span role="cell">
                        <strong>{dish.name}</strong>
                        {dish.description && (
                          <small>{dish.description}</small>
                        )}
                      </span>
                      <span role="cell">{dish.category || "-"}</span>
                      <span role="cell">{formatCurrency(dish.price)}</span>
                      <span role="cell">
                        <span className={statusBadgeClass(dish.status)}>
                          {dish.status === "soldout" ? "Hết hàng" : "Đang bán"}
                        </span>
                      </span>
                      <span role="cell">{dish.tag || "-"}</span>
                      <span role="cell" className="table-actions">
                        <button
                          type="button"
                          className="link-button"
                          onClick={() => handleStartEditDish(dish)}
                        >
                          {menuTexts.actions.edit}
                        </button>
                        <button
                          type="button"
                          className="link-button link-button--danger"
                          onClick={() => handleDeleteDish(dish)}
                        >
                          {menuTexts.actions.delete}
                        </button>
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {activeTab === "orders" && (
          <section className="restaurant-section">
            <header className="restaurant-section__header">
              <div>
                <h2>{ordersTexts.heading}</h2>
                <p>{ordersTexts.description}</p>
              </div>
            </header>

            <div className="restaurant-card">
              {orders.length === 0 ? (
                <p className="restaurant-empty">{ordersTexts.empty}</p>
              ) : (
                <div className="restaurant-table" role="table">
                  <div className="restaurant-table__header" role="row">
                    <span role="columnheader">{ordersTexts.columns.id}</span>
                    <span role="columnheader">{ordersTexts.columns.customer}</span>
                    <span role="columnheader">{ordersTexts.columns.items}</span>
                    <span role="columnheader">{ordersTexts.columns.total}</span>
                    <span role="columnheader">{ordersTexts.columns.status}</span>
                    <span role="columnheader">{ordersTexts.columns.placedAt}</span>
                  </div>
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="restaurant-table__row"
                      role="row"
                    >
                      <span role="cell">{order.id}</span>
                      <span role="cell">
                        <strong>{order.customer}</strong>
                        {order.address && <small>{order.address}</small>}
                      </span>
                      <span role="cell">{order.items}</span>
                      <span role="cell">{formatCurrency(order.total)}</span>
                      <span role="cell">
                        <span className={statusBadgeClass(order.status)}>
                          {order.status}
                        </span>
                      </span>
                      <span role="cell">
                        <time dateTime={order.placedAt}>{formatDateTime(order.placedAt)}</time>
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default RestaurantDashboard;