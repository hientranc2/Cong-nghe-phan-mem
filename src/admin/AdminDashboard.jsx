import { useEffect, useMemo, useState } from "react";
import "./AdminDashboard.css";

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

function AdminDashboard() {
  const [drones, setDrones] = useState(DEFAULT_DRONES);
  const [customers, setCustomers] = useState(DEFAULT_CUSTOMERS);
  const [orders, setOrders] = useState(DEFAULT_ORDERS);
  const [activeForm, setActiveForm] = useState(null);
  const [activeSection, setActiveSection] = useState("overview");
  const [search, setSearch] = useState("");

  useEffect(() => {
    setSearch("");
  }, [activeSection]);

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

  const filteredOrders = useMemo(() => {
    if (!search.trim()) return orders;
    const term = search.toLowerCase();
    return orders.filter(
      (order) =>
        order.id.toLowerCase().includes(term) ||
        order.customer.toLowerCase().includes(term) ||
        order.destination.toLowerCase().includes(term) ||
        order.status.toLowerCase().includes(term)
    );
  }, [search, orders]);

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

  const handleSubmitForm = (event) => {
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
        id: "active",
        label: "Đang hoạt động",
        value: drones.filter((item) => item.status === "Đang hoạt động").length,
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
    [drones, customers, totalRevenue]
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

  const renderFormFields = () => {
    if (!activeForm) return null;
    const { type, values } = activeForm;

    if (type === "drone") {
      return (
        <>
          <div className="field-grid">
            <label>
              Mã drone
              <input
                value={values.id}
                onChange={(event) => handleChangeForm("id", event.target.value)}
                placeholder="Tự tạo nếu để trống"
              />
            </label>
            <label>
              Tên drone
              <input
                value={values.name}
                onChange={(event) => handleChangeForm("name", event.target.value)}
                required
              />
            </label>
          </div>
          <div className="field-grid">
            <label>
              Tình trạng
              <select
                value={values.status}
                onChange={(event) => handleChangeForm("status", event.target.value)}
              >
                {STATUS_OPTIONS.drone.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Pin (%)
              <input
                type="number"
                min="0"
                max="100"
                value={values.battery}
                onChange={(event) =>
                  handleChangeForm("battery", Number(event.target.value))
                }
              />
            </label>
          </div>
          <label>
            Nhiệm vụ gần nhất
            <textarea
              value={values.lastMission}
              onChange={(event) =>
                handleChangeForm("lastMission", event.target.value)
              }
            />
          </label>
        </>
      );
    }

    if (type === "customer") {
      return (
        <>
          <div className="field-grid">
            <label>
              Mã khách hàng
              <input
                value={values.id}
                onChange={(event) => handleChangeForm("id", event.target.value)}
                placeholder="Tự tạo nếu để trống"
              />
            </label>
            <label>
              Họ tên
              <input
                value={values.name}
                onChange={(event) => handleChangeForm("name", event.target.value)}
                required
              />
            </label>
          </div>
          <div className="field-grid">
            <label>
              Email
              <input
                type="email"
                value={values.email}
                onChange={(event) => handleChangeForm("email", event.target.value)}
                required
              />
            </label>
            <label>
              Số điện thoại
              <input
                value={values.phone}
                onChange={(event) => handleChangeForm("phone", event.target.value)}
                placeholder="VD: 0988 123 456"
                required
              />
            </label>
          </div>
          <label>
            Hạng thành viên
            <select
              value={values.tier}
              onChange={(event) => handleChangeForm("tier", event.target.value)}
            >
              {CUSTOMER_TIERS.map((tier) => (
                <option key={tier} value={tier}>
                  {tier}
                </option>
              ))}
            </select>
          </label>
          <label className="toggle">
            <input
              type="checkbox"
              checked={values.active}
              onChange={(event) => handleChangeForm("active", event.target.checked)}
            />
            Cho phép nhận ưu đãi
          </label>
        </>
      );
    }

    return (
      <>
        <div className="field-grid">
          <label>
            Mã đơn hàng
            <input
              value={values.id}
              onChange={(event) => handleChangeForm("id", event.target.value)}
              placeholder="Tự tạo nếu để trống"
            />
          </label>
          <label>
            Khách hàng
            <input
              value={values.customer}
              onChange={(event) => handleChangeForm("customer", event.target.value)}
              required
            />
          </label>
        </div>
        <label>
          Địa điểm giao
          <input
            value={values.destination}
            onChange={(event) => handleChangeForm("destination", event.target.value)}
            required
          />
        </label>
        <div className="field-grid">
          <label>
            Drone thực hiện
            <select
              value={values.droneId}
              onChange={(event) => handleChangeForm("droneId", event.target.value)}
              required
            >
              <option value="">-- Chọn drone --</option>
              {drones.map((drone) => (
                <option key={drone.id} value={drone.id}>
                  {drone.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Giá trị đơn (VND)
            <input
              type="number"
              min="0"
              value={values.total}
              onChange={(event) => handleChangeForm("total", Number(event.target.value))}
              required
            />
          </label>
        </div>
        <label>
          Trạng thái
          <select
            value={values.status}
            onChange={(event) => handleChangeForm("status", event.target.value)}
          >
            {STATUS_OPTIONS.order.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
      </>
    );
  };

  const emptyState = (
    <div className="empty">Không có dữ liệu phù hợp</div>
  );

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="brand">
          <span className="dot" />
          FCO Control
        </div>
        <div className="sidebar-section">
          <p className="sidebar-label">Điều hướng</p>
          <nav>
            <a
              href="#overview"
              className={activeSection === "overview" ? "active" : ""}
              onClick={(event) => {
                event.preventDefault();
                setActiveSection("overview");
              }}
            >
              Tổng quan
            </a>
            <a
              href="#fleet"
              className={activeSection === "fleet" ? "active" : ""}
              onClick={(event) => {
                event.preventDefault();
                setActiveSection("fleet");
              }}
            >
              Đội bay
            </a>
            <a
              href="#customers"
              className={activeSection === "customers" ? "active" : ""}
              onClick={(event) => {
                event.preventDefault();
                setActiveSection("customers");
              }}
            >
              Khách hàng
            </a>
            <a
              href="#orders"
              className={activeSection === "orders" ? "active" : ""}
              onClick={(event) => {
                event.preventDefault();
                setActiveSection("orders");
              }}
            >
              Đơn hàng
            </a>
          </nav>
        </div>
        <div className="sidebar-section compact">
          <p className="sidebar-label">Tác vụ nhanh</p>
          <button onClick={() => handleOpenForm("drone", "create")}>
            + Drone mới
          </button>
          <button onClick={() => handleOpenForm("customer", "create")}>
            + Khách hàng
          </button>
          <button onClick={() => handleOpenForm("order", "create")}>
            + Đơn hàng
          </button>
        </div>
      </aside>
      <main className="admin-main">
        <header className="admin-header">
          <div>
            <h1>Bảng điều khiển FCO</h1>
            <p>Quản lý đội bay và đơn hàng trong một giao diện chuyên biệt.</p>
          </div>
          {activeSection !== "overview" && (
            <div className="search-box">
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={searchPlaceholder}
              />
            </div>
          )}
        </header>

        {activeSection === "overview" && (
          <>
            <section className="metrics-grid">
              {metrics.map((metric) => (
                <article key={metric.id} className="metric-card">
                  <p className="metric-label">{metric.label}</p>
                  <p className="metric-value">{metric.value}</p>
                </article>
              ))}
            </section>
            <section className="insights-grid">
              <article className="insight-card">
                <h3>Khách hàng mới nhất</h3>
                {overviewSummary.newestCustomer ? (
                  <>
                    <p className="insight-primary">
                      {overviewSummary.newestCustomer.name}
                    </p>
                    <p className="insight-secondary">
                      Gia nhập ngày {formatDate(overviewSummary.newestCustomer.joinedAt)}
                    </p>
                  </>
                ) : (
                  <p className="insight-empty">Chưa có khách hàng.</p>
                )}
              </article>
              <article className="insight-card">
                <h3>Khách hàng hạng cao nhất</h3>
                {overviewSummary.topTierCustomer ? (
                  <>
                    <p className="insight-primary">
                      {overviewSummary.topTierCustomer.name}
                    </p>
                    <p className="insight-secondary">
                      Hạng {overviewSummary.topTierCustomer.tier}
                    </p>
                  </>
                ) : (
                  <p className="insight-empty">Chưa có dữ liệu hạng.</p>
                )}
              </article>
              <article className="insight-card">
                <h3>Đơn hàng giá trị cao nhất</h3>
                {overviewSummary.largestOrder ? (
                  <>
                    <p className="insight-primary">
                      {overviewSummary.largestOrder.id}
                    </p>
                    <p className="insight-secondary">
                      Giá trị {formatCurrency(overviewSummary.largestOrder.total)}
                    </p>
                  </>
                ) : (
                  <p className="insight-empty">Chưa có đơn hàng.</p>
                )}
              </article>
              <article className="insight-card">
                <h3>Tổng doanh thu hôm nay</h3>
                <p className="insight-primary">{formatCurrency(totalRevenue)}</p>
                <p className="insight-secondary">Từ tất cả các đơn hàng đang xử lý.</p>
              </article>
            </section>
          </>
        )}

        {activeSection === "fleet" && (
          <section className="collection" id="fleet">
            <div className="collection-heading">
              <div>
                <h2>Đội bay</h2>
                <p>Giám sát tình trạng và nhiệm vụ gần nhất của từng drone.</p>
              </div>
              <button onClick={() => handleOpenForm("drone", "create")}>
                Thêm drone
              </button>
            </div>
            <div className="table-wrapper">
              <table>
              <thead>
                <tr>
                  <th>Mã</th>
                  <th>Tên</th>
                  <th>Tình trạng</th>
                  <th>Pin</th>
                  <th>Nhiệm vụ gần nhất</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {filteredDrones.length === 0 && (
                  <tr>
                    <td colSpan={6}>{emptyState}</td>
                  </tr>
                )}
                {filteredDrones.map((drone) => (
                  <tr key={drone.id}>
                    <td>{drone.id}</td>
                    <td>{drone.name}</td>
                    <td>
                      <span className={`status-pill status-${drone.status}`}>
                        {drone.status}
                      </span>
                    </td>
                    <td>{drone.battery}%</td>
                    <td>{drone.lastMission || "-"}</td>
                    <td className="actions">
                      <button
                        onClick={() => handleOpenForm("drone", "edit", drone)}
                      >
                        Sửa
                      </button>
                      <button
                        className="danger"
                        onClick={() => handleDelete("drone", drone.id)}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </section>
        )}

        {activeSection === "customers" && (
          <section className="collection" id="customers">
            <div className="collection-heading">
              <div>
                <h2>Khách hàng</h2>
                <p>Quản lý thông tin liên hệ và hạng thành viên của khách.</p>
              </div>
              <button onClick={() => handleOpenForm("customer", "create")}>
                Thêm khách hàng
              </button>
            </div>
            <div className="table-wrapper">
              <table>
              <thead>
                <tr>
                  <th>Mã</th>
                  <th>Họ tên</th>
                  <th>Email</th>
                  <th>Số điện thoại</th>
                  <th>Hạng</th>
                  <th>Trạng thái</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.length === 0 && (
                  <tr>
                    <td colSpan={7}>{emptyState}</td>
                  </tr>
                )}
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id}>
                    <td>{customer.id}</td>
                    <td>{customer.name}</td>
                    <td>{customer.email}</td>
                    <td>{customer.phone}</td>
                    <td>{customer.tier}</td>
                    <td>
                      <span
                        className={`status-pill ${
                          customer.active ? "status-active" : "status-inactive"
                        }`}
                      >
                        {customer.active ? "Nhận ưu đãi" : "Tạm ngưng"}
                      </span>
                    </td>
                    <td className="actions">
                      <button
                        onClick={() =>
                          handleOpenForm("customer", "edit", customer)
                        }
                      >
                        Sửa
                      </button>
                      <button
                        className="danger"
                        onClick={() => handleDelete("customer", customer.id)}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </section>
        )}

        {activeSection === "orders" && (
          <section className="collection" id="orders">
            <div className="collection-heading">
              <div>
                <h2>Đơn hàng</h2>
                <p>Theo dõi các chuyến giao và giá trị đơn theo từng drone.</p>
              </div>
              <button onClick={() => handleOpenForm("order", "create")}>
                Tạo đơn hàng
              </button>
            </div>
            <div className="table-wrapper">
              <table>
              <thead>
                <tr>
                  <th>Mã</th>
                  <th>Khách hàng</th>
                  <th>Địa điểm</th>
                  <th>Drone</th>
                  <th>Giá trị</th>
                  <th>Trạng thái</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan={7}>{emptyState}</td>
                  </tr>
                )}
                {filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.customer}</td>
                    <td>{order.destination}</td>
                    <td>{order.droneId}</td>
                    <td>{formatCurrency(order.total)}</td>
                    <td>
                      <span className={`status-pill status-${order.status}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="actions">
                      <button
                        onClick={() => handleOpenForm("order", "edit", order)}
                      >
                        Sửa
                      </button>
                      <button
                        className="danger"
                        onClick={() => handleDelete("order", order.id)}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </section>
        )}
      </main>

      {activeForm && (
        <div className="drawer-overlay" role="presentation" onClick={handleCloseForm}>
          <div
            className="drawer"
            role="dialog"
            aria-modal="true"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="drawer-header">
              <div>
                <h3>
                  {activeForm.mode === "create" ? "Tạo mới" : "Cập nhật"}{" "}
                  {activeForm.type === "drone"
                    ? "drone"
                    : activeForm.type === "customer"
                    ? "khách hàng"
                    : "đơn hàng"}
                </h3>
                <p>
                  Nhập thông tin chi tiết cho {" "}
                  {activeForm.type === "drone"
                    ? "thiết bị bay"
                    : activeForm.type === "customer"
                    ? "khách hàng"
                    : "đơn giao hàng"}.
                </p>
              </div>
              <button className="icon" onClick={handleCloseForm}>
                ✕
              </button>
            </header>
            <form onSubmit={handleSubmitForm} className="drawer-content">
              {renderFormFields()}
              <footer className="drawer-footer">
                <button type="button" onClick={handleCloseForm}>
                  Hủy
                </button>
                <button type="submit" className="primary">
                  {activeForm.mode === "create" ? "Lưu" : "Cập nhật"}
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
