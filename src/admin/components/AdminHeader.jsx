function AdminHeader({
  activeSection,
  searchValue,
  onSearchChange,
  searchPlaceholder,
}) {
  return (
    <header className="admin-header">
      <div>
        <h1>Bảng điều khiển FCO</h1>
        <p>Quản lý đội bay và đơn hàng trong một giao diện chuyên biệt.</p>
      </div>
      {activeSection !== "overview" && (
        <div className="search-box">
          <input
            type="search"
            value={searchValue}
            onChange={(event) => onSearchChange?.(event.target.value)}
            placeholder={searchPlaceholder}
          />
        </div>
      )}
    </header>
  );
}

export default AdminHeader;
