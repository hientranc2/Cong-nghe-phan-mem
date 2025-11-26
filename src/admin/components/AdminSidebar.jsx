const NAV_ITEMS = [
  { id: "overview", label: "Tổng quan" },
  { id: "fleet", label: "Đội bay" },
  { id: "customers", label: "Khách hàng" },
  { id: "restaurants", label: "Nhà hàng" },
  { id: "orders", label: "Đơn hàng" },
];

function AdminSidebar({ activeSection, onSectionChange, onCreate }) {
  const handleNavigate = (event, sectionId) => {
    event.preventDefault();
    if (onSectionChange) {
      onSectionChange(sectionId);
    }
  };

  return (
    <aside className="admin-sidebar">
      <div className="brand">
        <span className="dot" />
        FCO Control
      </div>
      <div className="sidebar-section">
        <p className="sidebar-label">Điều hướng</p>
        <nav>
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={activeSection === item.id ? "active" : ""}
              onClick={(event) => handleNavigate(event, item.id)}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
      <div className="sidebar-section compact">
        <p className="sidebar-label">Tác vụ nhanh</p>
        <button type="button" onClick={() => onCreate?.("drone")}>
          + Drone mới
        </button>
        <button type="button" onClick={() => onCreate?.("customer")}> 
          + Khách hàng
        </button>
        <button type="button" onClick={() => onCreate?.("restaurant")}> 
          + Nhà hàng
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;
