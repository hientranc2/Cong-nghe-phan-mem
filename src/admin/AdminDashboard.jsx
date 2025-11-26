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
    status: "Đang hoạt động",
    battery: 82,
    lastMission: "Giao cà phê quận 1",
  },
  {
    id: "dr-02",
    name: "Falcon V2",
    status: "Đang bảo trì",
    battery: 45,
    lastMission: "Đang kiểm tra cảm biến",
  },
  {
    id: "dr-03",
    name: "Orion S",
    status: "Sẵn sàng",
    battery: 98,
    lastMission: "Chờ nhiệm vụ",
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
    tier: "Tiêu chuẩn",
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
    tier: "Tiêu chuẩn",
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
  },
};

const STATUS_OPTIONS = {
  drone: ["Sẵn sàng", "Đang hoạt động", "Đang bảo trì", "Tạm dừng"],
  order: ["Đang chuẩn bị", "Đang giao", "Hoàn tất", "Tạm hoãn"],
};

const CUSTOMER_TIERS = ["Tiêu chuẩn", "Bạc", "Vàng", "Kim cương"];

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

const normalizeAdminOrder = (order, index) => {
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
    droneId: order?.droneId || order?.driver || "-",
    total: totalValue,
    status: order?.status || "Đang chuẩn bị",
  };
};

function AdminDashboard({
  orders: remoteOrders = [],
  restaurants: remoteRestaurants = [],
  customers: remoteCustomers = [],
  onCreateRestaurant,
  onUpdateRestaurant,
  onDeleteRestaurant,
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

  useEffect(() => {
    if (remoteOrders.length > 0) {
      setOrders(remoteOrders);
    }
  }, [remoteOrders]);

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

  const filteredDrones = useMemo(() => {
    if (!search.trim()) return drones;
    const term = search.toLowerCase();
    return drones.filter(
      (drone) =>
        drone.name.toLowerCase().includes(term) ||
        drone.status.toLowerCase().includes(term) ||
        drone.id.toLowerCase().includes(term)
    );
  }, [search, drones]);

  const filteredCustomers = useMemo(() => {
    if (!search.trim()) return customers;
    const term = search.toLowerCase();
    const normalizedTerm = term.replace(/\s+/g, "");
    const numericTerm = normalizedTerm.replace(/\D+/g, "");

    return customers.filter((customer) => {
      const nameMatch = customer.name.toLowerCase().includes(term);
      const emailMatch = customer.email.toLowerCase().includes(term);
      const tierMatch = customer.tier.toLowerCase().includes(term);
      const phoneValue = (customer.phone || "").toLowerCase();
      const normalizedPhone = phoneValue.replace(/\s+/g, "");
      const numericPhone = phoneValue.replace(/\D+/g, "");

      const phoneMatch =
        normalizedPhone.includes(normalizedTerm) ||
        (!!numericTerm && numericPhone.includes(numericTerm));

      return nameMatch || emailMatch || tierMatch || phoneMatch;
    });
  }, [search, customers]);

  const normalizedOrders = useMemo(
    () => orders.map((order, index) => normalizeAdminOrder(order, index)),
    [orders]
  );

  const filteredOrders = useMemo(() => {
    if (!search.trim()) return normalizedOrders;
    const term = search.toLowerCase();
    return normalizedOrders.filter(
      (order) =>
        order.id.toLowerCase().includes(term) ||
        order.customer.toLowerCase().includes(term) ||
        order.destination.toLowerCase().includes(term) ||
        order.status.toLowerCase().includes(term)
    );
  }, [search, normalizedOrders]);

  const filteredRestaurants = useMemo(() => {
    if (!search.trim()) return restaurants;
    const term = search.toLowerCase();
    return restaurants.filter(
      (restaurant) =>
        restaurant.id.toLowerCase().includes(term) ||
        restaurant.name.toLowerCase().includes(term) ||
        restaurant.address.toLowerCase().includes(term) ||
        (restaurant.hotline || "").toLowerCase().includes(term)
    );
  }, [search, restaurants]);

  const handleOpenForm = (type, mode, payload = null) => {
    setActiveForm({
      type,
      mode,
      values: payload ? { ...payload } : { ...EMPTY_FORMS[type] },
    });
  };

  const handleCloseForm = () => setActiveForm(null);

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
      if (mode === "create") {
        const id = values.id?.trim() || nextId("dr", drones);
        setDrones([...drones, { ...values, id }]);
      } else {
        setDrones(
          drones.map((drone) =>
            drone.id === values.id ? { ...drone, ...values } : drone
          )
        );
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
      if (mode === "create") {
        const id = values.id?.trim() || nextId("od", orders);
        setOrders([...orders, { ...values, id }]);
      } else {
        setOrders(
          orders.map((order) =>
            order.id === values.id ? { ...order, ...values } : order
          )
        );
      }
    }

    if (type === "restaurant") {
      if (mode === "create") {
        const id = values.id?.trim() || nextId("nh", restaurants);
        const payload = { ...values, id };
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

  const handleDelete = (type, id) => {
    if (type === "drone") {
      setDrones(drones.filter((drone) => drone.id !== id));
    }
    if (type === "customer") {
      setCustomers(customers.filter((customer) => customer.id !== id));
    }
    if (type === "order") {
      setOrders(orders.filter((order) => order.id !== id));
    }
    if (type === "restaurant") {
      if (onDeleteRestaurant) {
        onDeleteRestaurant(id);
      } else {
        setRestaurants(restaurants.filter((restaurant) => restaurant.id !== id));
      }
    }
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
          onDelete={(id) => handleDelete("restaurant", id)}
          emptyMessage={emptyMessage}
        />
      )}

      {activeSection === "orders" && (
        <AdminOrdersSection
          orders={filteredOrders}
          onCreate={() => handleOpenForm("order", "create")}
          onEdit={(order) => handleOpenForm("order", "edit", order)}
            onDelete={(id) => handleDelete("order", id)}
            emptyMessage={emptyMessage}
            formatCurrency={formatCurrency}
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
    </div>
  );
}

export default AdminDashboard;
