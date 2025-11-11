function AdminFleetSection({ drones, onCreate, onEdit, onDelete, emptyMessage }) {
  return (
    <section className="collection" id="fleet">
      <div className="collection-heading">
        <div>
          <h2>Đội bay</h2>
          <p>Giám sát tình trạng và nhiệm vụ gần nhất của từng drone.</p>
        </div>
        <button type="button" onClick={onCreate}>
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
            {drones.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <div className="empty">{emptyMessage}</div>
                </td>
              </tr>
            ) : (
              drones.map((drone) => (
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
                    <button type="button" onClick={() => onEdit?.(drone)}>
                      Sửa
                    </button>
                    <button
                      type="button"
                      className="danger"
                      onClick={() => onDelete?.(drone.id)}
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

export default AdminFleetSection;
