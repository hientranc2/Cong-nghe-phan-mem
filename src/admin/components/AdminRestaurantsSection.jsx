function AdminRestaurantsSection({
  restaurants,
  onCreate,
  onEdit,
  onDelete,
  onToggleLock,
  emptyMessage,
}) {
  return (
    <section className="collection" id="restaurants">
      <div className="collection-heading">
        <div>
          <h2>Nhà hàng</h2>
          <p>Quản lý đối tác nhà hàng và thông tin liên hệ.</p>
        </div>
        <button type="button" onClick={onCreate}>
          Tạo nhà hàng
        </button>
      </div>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Mã</th>
              <th>Tên</th>
              <th>Địa chỉ</th>
              <th>Hotline</th>
              <th>Trạng thái</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {restaurants.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <div className="empty">{emptyMessage}</div>
                </td>
              </tr>
            ) : (
              restaurants.map((restaurant) => (
                <tr key={restaurant.id}>
                  <td>{restaurant.id}</td>
                  <td>{restaurant.name}</td>
                  <td>{restaurant.address}</td>
                  <td>{restaurant.hotline || "-"}</td>
                  <td>
                    <span
                      className={`status-pill ${
                        restaurant.isLocked ? "status-inactive" : "status-active"
                      }`}
                    >
                      {restaurant.isLocked ? "Đã khóa" : "Đang hiển thị"}
                    </span>
                  </td>
                  <td className="actions">
                    <button type="button" onClick={() => onEdit?.(restaurant)}>
                      Sửa
                    </button>
                    <button type="button" onClick={() => onToggleLock?.(restaurant.id)}>
                      {restaurant.isLocked ? "Mở khóa" : "Khóa"}
                    </button>
                    <button
                      type="button"
                      className="danger"
                      onClick={() => onDelete?.(restaurant.id)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default AdminRestaurantsSection;
