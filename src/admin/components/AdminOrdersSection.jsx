function AdminOrdersSection({ orders, onCreate, onEdit, onDelete, emptyMessage, formatCurrency }) {
  return (
    <section className="collection" id="orders">
      <div className="collection-heading">
        <div>
          <h2>Đơn hàng</h2>
          <p>Theo dõi các chuyến giao và giá trị đơn theo từng drone.</p>
        </div>
        <button type="button" onClick={onCreate}>
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
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <div className="empty">{emptyMessage}</div>
                </td>
              </tr>
            ) : (
              orders.map((order) => (
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
                    <button type="button" onClick={() => onEdit?.(order)}>
                      Sửa
                    </button>
                    <button
                      type="button"
                      className="danger"
                      onClick={() => onDelete?.(order.id)}
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

export default AdminOrdersSection;
