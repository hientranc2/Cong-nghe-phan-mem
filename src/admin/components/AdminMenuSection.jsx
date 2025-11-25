function AdminMenuSection({ menuItems, onCreate, onEdit, onDelete, emptyMessage }) {
  return (
    <section className="collection" id="menu">
      <div className="collection-heading">
        <div>
          <h2>Thực đơn</h2>
          <p>Quản lý danh sách món ăn được hiển thị trên web và mobile.</p>
        </div>
        <button type="button" onClick={onCreate}>
          Thêm món
        </button>
      </div>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Mã</th>
              <th>Tên món</th>
              <th>Danh mục</th>
              <th>Giá (VND)</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {menuItems.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <div className="empty">{emptyMessage}</div>
                </td>
              </tr>
            ) : (
              menuItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.categoryId}</td>
                  <td>{item.price?.toLocaleString("vi-VN") ?? "-"}</td>
                  <td className="actions">
                    <button type="button" onClick={() => onEdit?.(item)}>
                      Sửa
                    </button>
                    <button
                      type="button"
                      className="danger"
                      onClick={() => onDelete?.(item.id)}
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

export default AdminMenuSection;
