import { useEffect, useMemo, useState } from "react";
import "./AdminDashboard.css";
import AdminCustomersSection from "./components/AdminCustomersSection";
import AdminFleetSection from "./components/AdminFleetSection";
import AdminFormDrawer from "./components/AdminFormDrawer";
import AdminHeader from "./components/AdminHeader";
import AdminOrdersSection from "./components/AdminOrdersSection";
import AdminRestaurantsSection from "./components/AdminRestaurantsSection";
import AdminOverview from "./components/AdminOverview";
import AdminSidebar from "./components/AdminSidebar";

const DEFAULT_DRONES = [
  {
    id: "dr-01",
    name: "Aquila X1",
    status: "Dang hoat dong",
    battery: 82,
    lastMission: "Giao ca phe quan 1",
  },
  {
    id: "dr-02",
    name: "Falcon V2",
    status: "Dang bao tri",
    battery: 45,
    lastMission: "Dang kiem tra cam bien",
  },
  {
    id: "dr-03",
    name: "Orion S",
    status: "San sang",
    battery: 98,
    lastMission: "Cho nhiem vu",
  },
];


const DEFAULT_CUSTOMERS = [
  {
    id: "kh-01",
    name: "Nguyễn Minh Anh",
    email: "minhanh@example.com",
    phone: "0988 123 456",
    tier: "Vàng",
    active: true,
    joinedAt: "2024-05-12",
  },
  {
    id: "kh-02",
    name: "Trần Quốc Bảo",
    email: "quocbao@example.com",
    phone: "0909 555 777",
    tier: "Bạc",
    active: true,
    joinedAt: "2024-05-08",
  },
  {
    id: "kh-03",
    name: "Lê Thu Hà",
    email: "thuha@example.com",
    phone: "0977 222 333",
    active: false,
    joinedAt: "2024-04-28",
  },
];

const DEFAULT_ORDERS = [
  {
    id: "od-4521",
    customer: "Phan Nhật",
    destination: "Sunrise Riverside, Q7",
    droneId: "dr-01",
    total: 350000,
    status: "Đang giao",
  },
  {
    id: "od-4522",
    customer: "Lý Thanh",
    destination: "Vinhomes Grand Park",
    droneId: "dr-03",
    total: 215000,
    status: "Đang chuẩn bị",
  },
  {
    id: "od-4523",
    customer: "Đoàn Mai",
    destination: "ETown, Tân Bình",
    droneId: "dr-02",
    total: 540000,
    status: "Tạm hoãn",
  },
];

const EMPTY_FORMS = {
  drone: {
    id: "",
    name: "",
    status: "Sẵn sàng",
    battery: 100,
    lastMission: "",
  },
  customer: {
    id: "",
    name: "",
    email: "",
    phone: "",
    active: true,
    joinedAt: "",
  },
  order: {
    id: "",
    customer: "",
    destination: "",
    droneId: "",
    total: 0,
    status: "Đang chuẩn bị",
  },
  restaurant: {
    id: "",
    name: "",
    address: "",
    hotline: "",
    isLocked: false,
  },
};

const STATUS_OPTIONS = {
  drone: ["San sang", "Dang hoat dong", "Dang bao tri", "Tam dung", "Can sac"],
  order: ["Cho xac nhan", "Dang chuan bi", "Dang giao", "Hoan tat", "Tam hoan", "Da huy"],
};

const CUSTOMER_TIERS = ["Tieu chuan", "Bac", "Vang", "Kim cuong"];
const MIN_BATTERY_FOR_MISSION = 15; // %
const BATTERY_DRAIN_PER_ORDER = 15; // %
const normalizeStatusText = (value) =>
  (value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();


const selectDefaultDroneId = (drones = []) =>
  drones.find((drone) => drone.status && !normalizeStatusText(drone.status).includes("bao tri"))?.id ||
  drones[0]?.id ||
  "Chua phan cong";

const formatCurrency = (value) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("vi-VN").format(date);
};

const nextId = (prefix, existing) => {
  const numeric = existing
    .map((item) => Number(String(item.id).replace(/^[^0-9]*/, "")) || 0)
    .reduce((max, value) => Math.max(max, value), 0);

  return `${prefix}-${String(numeric + 1).padStart(2, "0")}`;
};

const isActiveOrderStatus = (status) => {
  const text = normalizeStatusText(status);
  const inactive = ["hoan tat", "hoan thanh", "done", "da giao", "huy", "cancel", "tam hoan"];
  const active = ["dang giao", "dang chuan", "chuan bi", "dang xu ly", "dang hoat dong"];
  if (inactive.some((kw) => text.includes(kw))) return false;
  if (active.some((kw) => text.includes(kw))) return true;
  return text.length > 0 && !inactive.some((kw) => text.includes(kw));
};

const normalizeAdminOrder = (order, index, drones) => {

  const fallbackDroneId =
    order?.droneId ||
    order?.driver ||
    (drones.length ? drones[index % drones.length]?.id : null) ||
    selectDefaultDroneId(drones);
  const totalValue =
    Number(order?.total) ||
    Number(order?.subtotal) ||
    Number(order?.amount) ||
    0;

  return {
    id: order?.id || order?.code || `od-${String(index + 1).padStart(2, "0")}`,
    customer:
      order?.customer?.name ||
      order?.customerName ||
      order?.customer ||
      "Khách lẻ",
    destination:
      order?.customer?.address ||
      order?.address ||
      order?.destination ||
      "Đang cập nhật",
    droneId: fallbackDroneId,
    total: totalValue,
    status: order?.status || "Đang chuẩn bị",
  };
};

function AdminDashboard({
  orders: remoteOrders = [],
  restaurants: remoteRestaurants = [],
  customers: remoteCustomers = [],
  drones: remoteDrones = [],
  onUpdateOrder,
  onDeleteOrder,
  onCreateRestaurant,
  onUpdateRestaurant,
  onDeleteRestaurant,
  onCreateDrone,
  onUpdateDrone,
  onDeleteDrone,
}) {
  const [drones, setDrones] = useState(DEFAULT_DRONES);
  const [customers, setCustomers] = useState(
    Array.isArray(remoteCustomers) ? remoteCustomers : DEFAULT_CUSTOMERS
  );
  const [orders, setOrders] = useState(
    remoteOrders.length > 0 ? remoteOrders : DEFAULT_ORDERS
  );
  const [restaurants, setRestaurants] = useState(remoteRestaurants);
  const [activeForm, setActiveForm] = useState(null);
  const [activeSection, setActiveSection] = useState("overview");
  const [search, setSearch] = useState("");
  const [lastDroneIndex, setLastDroneIndex] = useState(-1);
  const [droneShortage, setDroneShortage] = useState(null);

  useEffect(() => {
    if (Array.isArray(remoteOrders)) {
      setOrders(remoteOrders.map((order, index) => normalizeAdminOrder(order, index, drones)));
    }
  }, [remoteOrders, drones]);

  useEffect(() => {
    if (Array.isArray(remoteDrones) && remoteDrones.length > 0) {
      setDrones(remoteDrones);
    }
  }, [remoteDrones]);

  const findAvailableDrone = (
    preferredId = null,
    excludedOrderId = null,
    busyOverride = null
  ) => {
    const busyIds = new Set(
      Array.isArray(busyOverride) ? busyOverride : getBusyDroneIds(excludedOrderId)
    );
    const isUsable = (drone) => {
      if (!drone) return false;
      const statusText = normalizeStatusText(drone.status);
      const isBusy = busyIds.has(drone.id);
      const blocked =
        statusText.includes("bao tri") ||
        statusText.includes("tam dung") ||
        statusText.includes("can sac");
      return !isBusy && !blocked && drone.battery >= MIN_BATTERY_FOR_MISSION;
    };

    const preferred =
      preferredId && drones.find((drone) => drone.id === preferredId);
    if (isUsable(preferred)) return preferred;

    if (!drones.length) return null;

    for (let i = 1; i <= drones.length; i += 1) {
      const idx = (lastDroneIndex + i) % drones.length;
      if (isUsable(drones[idx])) {
        setLastDroneIndex(idx);
        return drones[idx];
      }
    }

    return null;
  };

  const allocateDroneForOrder = (
    requestedId = null,
    currentOrderId = null,
    missionLabel = "Vua nhan don moi"
  ) => {
    const chosen = findAvailableDrone(requestedId, currentOrderId);
    if (!chosen) {
      setDroneShortage({
        title: "Khong du drone kha dung",
        message:
          "Het drone kha dung. Vui long them drone moi hoac sac drone (pin >= 15%) truoc khi giao don.",
      });
      return null;
    }

    const nextBattery = Math.max(0, chosen.battery - BATTERY_DRAIN_PER_ORDER);
    const nextStatus =
      nextBattery < MIN_BATTERY_FOR_MISSION ? "Can sac" : "Dang hoat dong";

    setDrones((prev) =>
      prev.map((drone) =>
        drone.id === chosen.id
          ? {
              ...drone,
              battery: nextBattery,
              status: nextStatus,
              lastMission: missionLabel,
            }
          : drone
      )
    );

    return chosen.id;
  };

  useEffect(() => {
    if (remoteRestaurants.length > 0) {
      setRestaurants(remoteRestaurants);
    }
  }, [remoteRestaurants]);

  useEffect(() => {
    setSearch("");
  }, [activeSection]);

  useEffect(() => {
    if (Array.isArray(remoteCustomers)) {
      setCustomers(remoteCustomers);
    }
  }, [remoteCustomers]);

  const activeOrderAssignments = useMemo(
    () =>
      orders
        .filter((order) => order.droneId && isActiveOrderStatus(order.status))
        .map((order) => ({ orderId: order.id, droneId: order.droneId })),
    [orders]
  );

  const activeOrderDroneIds = useMemo(
    () => activeOrderAssignments.map((item) => item.droneId),
    [activeOrderAssignments]
  );

  const getBusyDroneIds = (excludedOrderId = null) => {
    if (!excludedOrderId) return activeOrderDroneIds;
    return activeOrderAssignments
      .filter((item) => item.orderId !== excludedOrderId)
      .map((item) => item.droneId);
  };

  useEffect(() => {
    let shortageDetected = false;
    setOrders((current) => {
      let changed = false;
      const busy = new Set();

      const nextOrders = current.map((order) => {
        if (!isActiveOrderStatus(order.status)) return order;

        const assignedDrone = drones.find((drone) => drone.id === order.droneId);
        const statusText = normalizeStatusText(assignedDrone?.status);
        const blocked =
          !assignedDrone ||
          statusText.includes("bao tri") ||
          statusText.includes("tam dung") ||
          statusText.includes("can sac") ||
          assignedDrone.battery < MIN_BATTERY_FOR_MISSION ||
          busy.has(order.droneId);

        if (!blocked) {
          busy.add(order.droneId);
          return order;
        }

        const replacement = findAvailableDrone(
          order.droneId,
          order.id,
          Array.from(busy)
        );
        if (!replacement) {
          shortageDetected = true;
          changed = changed || Boolean(order.droneId);
          return { ...order, droneId: "" };
        }

        busy.add(replacement.id);
        changed = true;
        return { ...order, droneId: replacement.id };
      });

      return changed ? nextOrders : current;
    });

    if (shortageDetected) {
      setDroneShortage({
        title: "Khong du drone kha dung",
        message:
          "Khong du drone san sang de giao het cac don. Hay them drone moi hoac sac, bao tri drone hien co.",
      });
    }
  }, [orders, drones]);

  useEffect(() => {
    const hasActiveOrderWithoutDrone = orders.some(
      (order) => isActiveOrderStatus(order.status) && !order.droneId
    );
    if (hasActiveOrderWithoutDrone) {
      setDroneShortage({
        title: "Chua co drone de giao don",
        message:
          "Don dang hoat dong nhung chua co drone. Vui long them drone moi truoc khi giao.",
      });
    }
  }, [orders, drones]);

  const filteredDrones = useMemo(() => {
    if (!search.trim()) return drones;
    const term = search.toLowerCase();
    return drones.filter(
      (drone) =>
        (drone.name || "").toLowerCase().includes(term) ||
        (drone.status || "").toLowerCase().includes(term) ||
        (drone.id || "").toLowerCase().includes(term)
    );
  }, [search, drones]);

  const filteredCustomers = useMemo(() => {
    if (!search.trim()) return customers;
    const term = search.toLowerCase();
    return customers.filter(
      (customer) =>
        (customer.name || "").toLowerCase().includes(term) ||
        (customer.email || "").toLowerCase().includes(term) ||
        (customer.phone || "").toLowerCase().includes(term)
    );
  }, [search, customers]);

  const filteredRestaurants = useMemo(() => {
    if (!search.trim()) return restaurants;
    const term = search.toLowerCase();
    return restaurants.filter(
      (restaurant) =>
        (restaurant.name || "").toLowerCase().includes(term) ||
        (restaurant.address || "").toLowerCase().includes(term)
    );
  }, [search, restaurants]);

  const filteredOrders = useMemo(() => {
    if (!search.trim()) return orders;
    const term = search.toLowerCase();
    return orders.filter(
      (order) =>
        (order.id || "").toLowerCase().includes(term) ||
        (order.customer || "").toLowerCase().includes(term) ||
        (order.destination || "").toLowerCase().includes(term)
    );
  }, [search, orders]);


  const handleOpenForm = (type, mode = "create", payload = {}) => {
    if (!type) return;
    const defaults = EMPTY_FORMS[type] || {};
    setActiveForm({
      type,
      mode,
      values: { ...defaults, ...payload },
    });
  };

  const handleCloseForm = () => setActiveForm(null);

  const handleDismissShortage = () => setDroneShortage(null);

  const handleAddDroneFromShortage = () => {
    handleOpenForm("drone", "create");
    setDroneShortage(null);
  };

  const handleChangeForm = (field, value) => {
    setActiveForm((current) =>
      current
        ? {
            ...current,
            values: {
              ...current.values,
              [field]: value,
            },
          }
        : current
    );
  };

  const handleSubmitForm = async (event) => {
    event.preventDefault();
    if (!activeForm) return;

    const { type, mode, values } = activeForm;

    if (type === "drone") {
      const payload = {
        ...values,
        id: values.id?.trim() || nextId("dr", drones),
        battery: Number(values.battery ?? 0),
      };

      if (mode === "create") {
        setDrones([...drones, payload]);
        const saved = onCreateDrone ? await onCreateDrone(payload) : null;
        if (saved?.id && saved.id !== payload.id) {
          setDrones((prev) =>
            prev.map((drone) =>
              drone.id === payload.id ? { ...drone, ...saved } : drone
            )
          );
        }
      } else {
        setDrones(
          drones.map((drone) =>
            drone.id === values.id ? { ...drone, ...payload } : drone
          )
        );
        if (onUpdateDrone) {
          await onUpdateDrone(payload);
        }
      }
    }

    if (type === "customer") {
      if (mode === "create") {
        const id = values.id?.trim() || nextId("kh", customers);
        const joinedAt = values.joinedAt?.trim()
          ? values.joinedAt
          : new Date().toISOString().slice(0, 10);
        setCustomers([...customers, { ...values, id, joinedAt }]);
      } else {
        setCustomers(
          customers.map((customer) =>
            customer.id === values.id ? { ...customer, ...values } : customer
          )
        );
      }
    }

    if (type === "order") {
      const shouldAssignDrone = isActiveOrderStatus(values.status);
      const missionLabel = values.destination
        ? `Giao ${values.destination}`
        : "Vua nhan don moi";
      const ensuredDroneId = shouldAssignDrone
        ? allocateDroneForOrder(values.droneId, values.id, missionLabel)
        : values.droneId;

      if (shouldAssignDrone && !ensuredDroneId) {
        return;
      }

      const payload = { ...values, droneId: ensuredDroneId || values.droneId || "" };

      if (mode === "create") {
        const id = payload.id?.trim() || nextId("od", orders);
        const nextOrder = { ...payload, id };
        setOrders([...orders, nextOrder]);
        onUpdateOrder?.(nextOrder);
      } else {
        setOrders(
          orders.map((order) =>
            order.id === values.id ? { ...order, ...payload } : order
          )
        );
        onUpdateOrder?.(payload);
      }
    }

    if (type === "restaurant") {
      if (mode === "create") {
        const id = values.id?.trim() || nextId("nh", restaurants);
        const payload = { ...values, id, isLocked: false };
        if (onCreateRestaurant) {
          await onCreateRestaurant(payload);
        } else {
          setRestaurants([...restaurants, payload]);
        }
      } else {
        const payload = { ...values };
        if (onUpdateRestaurant) {
          await onUpdateRestaurant(payload);
        } else {
          setRestaurants(
            restaurants.map((restaurant) =>
              restaurant.id === values.id
                ? { ...restaurant, ...payload }
                : restaurant
            )
          );
        }
      }
    }

    handleCloseForm();
  };

  const handleDelete = async (type, id) => {
    if (type === "drone") {
      setDrones(drones.filter((drone) => drone.id !== id));
      if (onDeleteDrone) {
        await onDeleteDrone(id);
      }
    }
    if (type === "customer") {
      setCustomers(customers.filter((customer) => customer.id !== id));
    }
    
    if (type === "restaurant") {
      if (onDeleteRestaurant) {
        onDeleteRestaurant(id);
      } else {
        setRestaurants(restaurants.filter((restaurant) => restaurant.id !== id));
      }
    }
  };

  const updateOrderStatus = (orderId, nextStatus) => {
    setOrders((current) => {
      const targetOrder = current.find((order) => order.id === orderId);
      if (!targetOrder) return current;

      const updatedOrder = { ...targetOrder, status: nextStatus };
      const nextOrders = current.map((order) =>
        order.id === orderId ? updatedOrder : order
      );

      onUpdateOrder?.(updatedOrder);

      return nextOrders;
    });
  };

  const handleOrderDelivered = (orderId) => {
    let completedOrder;
    setOrders((current) => {
      const nextOrders = current.map((order) => {
        if (order.id === orderId) {
          completedOrder = { ...order, status: "Hoàn tất" };
          return completedOrder;
        }
        return order;
      });

      if (completedOrder && onUpdateOrder) {
        onUpdateOrder(completedOrder);
      }

      return nextOrders;
    });

    if (completedOrder?.droneId) {
      setDrones((prev) =>
        prev.map((drone) => {
          if (drone.id !== completedOrder.droneId) return drone;
          const nextStatus =
            drone.battery >= MIN_BATTERY_FOR_MISSION ? "San sang" : "Can sac";
          return {
            ...drone,
            status: nextStatus,
            lastMission: `Hoan tat don ${orderId}`,
          };
        })
      );
    }
  };

  const handleAcceptOrder = (orderId) => {
    updateOrderStatus(orderId, "Đang chuẩn bị");
  };

  const handleCancelOrder = (orderId) => {
    const shouldCancel =
      typeof window === "undefined"
        ? true
        : window.confirm("Bạn có chắc chắn muốn hủy đơn này?");

    if (!shouldCancel) return;

    updateOrderStatus(orderId, "Đã hủy");
  };


  const handleToggleRestaurantLock = (restaurantId) => {
    setRestaurants((current) => {
      const target = current.find((restaurant) => restaurant.id === restaurantId);
      if (!target) return current;

      const updatedRestaurant = { ...target, isLocked: !target.isLocked };
      const nextRestaurants = current.map((restaurant) =>
        restaurant.id === restaurantId ? updatedRestaurant : restaurant
      );

      onUpdateRestaurant?.(updatedRestaurant);
      return nextRestaurants;
    });
  };

  const totalRevenue = useMemo(
    () => orders.reduce((sum, order) => sum + Number(order.total || 0), 0),
    [orders]
  );

  const metrics = useMemo(
    () => [
      {
        id: "fleet",
        label: "Tổng số drones",
        value: drones.length,
      },
      {
        id: "orders-today",
        label: "Tổng đơn hàng hôm nay",
        value: orders.length,
      },
      {
        id: "customers",
        label: "Tổng khách hàng",
        value: customers.length,
      },
      {
        id: "revenue",
        label: "Giá trị đơn trong ngày",
        value: formatCurrency(totalRevenue),
      },
    ],
    [drones, orders, customers, totalRevenue]
  );

  const overviewSummary = useMemo(() => {
    const newestCustomer = [...customers]
      .filter((customer) => Boolean(customer.joinedAt))
      .sort(
        (a, b) => new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime()
      )[0] || customers[0] || null;

    const topTierCustomer = [...customers]
      .sort(
        (a, b) =>
          CUSTOMER_TIERS.indexOf(b.tier) - CUSTOMER_TIERS.indexOf(a.tier)
      )[0] || null;

    const largestOrder = [...orders]
      .sort((a, b) => Number(b.total || 0) - Number(a.total || 0))[0] || null;

    return {
      newestCustomer,
      topTierCustomer,
      largestOrder,
    };
  }, [customers, orders]);

  const searchPlaceholder = useMemo(() => {
    if (activeSection === "fleet") {
      return "Tìm drone theo mã, tên hoặc trạng thái...";
    }
    if (activeSection === "customers") {
      return "Tìm khách hàng theo tên, email hoặc hạng...";
    }
    if (activeSection === "orders") {
      return "Tìm đơn hàng theo mã, khách hoặc trạng thái...";
    }
    return "";
  }, [activeSection]);

  const emptyMessage = "Không có dữ liệu phù hợp";

  return (
    <div className="admin-shell">
      <AdminSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onCreate={(type) => handleOpenForm(type, "create")}
      />
      <main className="admin-main">
        <AdminHeader
          activeSection={activeSection}
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder={searchPlaceholder}
        />

        {activeSection === "overview" && (
          <AdminOverview
            metrics={metrics}
            overviewSummary={overviewSummary}
            totalRevenue={totalRevenue}
            formatCurrency={formatCurrency}
            formatDate={formatDate}
            restaurants={restaurants}
            orders={orders}
          />
        )}

        {activeSection === "fleet" && (
          <AdminFleetSection
            drones={filteredDrones}
            onCreate={() => handleOpenForm("drone", "create")}
            onEdit={(drone) => handleOpenForm("drone", "edit", drone)}
            onDelete={(id) => handleDelete("drone", id)}
            emptyMessage={emptyMessage}
          />
        )}

      {activeSection === "customers" && (
        <AdminCustomersSection
          customers={filteredCustomers}
          onCreate={() => handleOpenForm("customer", "create")}
          onEdit={(customer) => handleOpenForm("customer", "edit", customer)}
          onDelete={(id) => handleDelete("customer", id)}
          emptyMessage={emptyMessage}
        />
      )}

      {activeSection === "restaurants" && (
        <AdminRestaurantsSection
          restaurants={filteredRestaurants}
          onCreate={() => handleOpenForm("restaurant", "create")}
          onEdit={(restaurant) => handleOpenForm("restaurant", "edit", restaurant)}
          onToggleLock={handleToggleRestaurantLock}
          onDelete={(id) => handleDelete("restaurant", id)}
          emptyMessage={emptyMessage}
        />
      )}

      {activeSection === "orders" && (
        <AdminOrdersSection
          orders={filteredOrders}
          onEdit={(order) => handleOpenForm("order", "edit", order)}
          onAcceptOrder={handleAcceptOrder}
          onCancelOrder={handleCancelOrder}
          emptyMessage={emptyMessage}
          formatCurrency={formatCurrency}
          onOrderDelivered={handleOrderDelivered}
          onAddDrone={() => handleOpenForm("drone", "create")}
        />
      )}
      </main>

      <AdminFormDrawer
        activeForm={activeForm}
        onClose={handleCloseForm}
        onSubmit={handleSubmitForm}
        onChangeField={handleChangeForm}
        drones={drones}
        customerTiers={CUSTOMER_TIERS}
        statusOptions={STATUS_OPTIONS}
      />

      {droneShortage && (
        <div className="shortage-overlay" role="alertdialog" aria-modal="true">
          <div className="shortage-card">
            <h4>{droneShortage.title || "Khong du drone kha dung"}</h4>
            <p>
              {droneShortage.message ||
                "Het drone kha dung. Vui long them drone moi hoac sac drone (pin >= 15%) truoc khi giao don."}
            </p>
            <div className="shortage-actions">
              <button type="button" onClick={handleDismissShortage}>
                Dong
              </button>
              <button type="button" className="primary" onClick={handleAddDroneFromShortage}>
                Them drone
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;


