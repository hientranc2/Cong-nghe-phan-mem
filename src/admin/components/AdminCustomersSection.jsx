function AdminCustomersSection({
  customers,
  onCreate,
  onEdit,
  onDelete,
  onLock,
  emptyMessage,
}) {
  return (
    <section className="collection" id="customers">
      <div className="collection-heading">
        <div>
          <h2>Khách hàng</h2>
          <p>Quản lý thông tin liên hệ và hạng thành viên của khách.</p>
        </div>
        <button type="button" onClick={onCreate}>
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
            {customers.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <div className="empty">{emptyMessage}</div>
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
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
                    <button type="button" onClick={() => onEdit?.(customer)}>
                      Sửa
                    </button>
                    <button
                      type="button"
                      className={customer.active ? "warning" : undefined}
                      onClick={() => onLock?.(customer.id)}
                    >
                      {customer.active ? "Khóa" : "Mở khóa"}
                    </button>
                    <button
                      type="button"
                      className="danger"
                      onClick={() => onDelete?.(customer.id)}
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

export default AdminCustomersSection;
