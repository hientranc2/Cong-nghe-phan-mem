function AdminFormDrawer({
  activeForm,
  onClose,
  onSubmit,
  onChangeField,
  drones,
  categories,
  customerTiers,
  statusOptions,
}) {
  if (!activeForm) {
    return null;
  }

  const { type, mode, values } = activeForm;

  const typeLabel =
    type === "drone"
      ? "drone"
      : type === "customer"
        ? "khách hàng"
        : type === "restaurant"
          ? "nhà hàng"
          : type === "menuItem"
            ? "món ăn"
            : "đơn hàng";
  const typeDescription =
    type === "drone"
      ? "thiết bị bay"
      : type === "customer"
        ? "khách hàng"
        : type === "restaurant"
          ? "đối tác nhà hàng"
          : type === "menuItem"
            ? "món trong thực đơn"
            : "đơn giao hàng";

  const renderDroneFields = () => (
    <>
      <div className="field-grid">
        <label>
          Mã drone
          <input
            value={values.id}
            onChange={(event) => onChangeField("id", event.target.value)}
            placeholder="Tự tạo nếu để trống"
          />
        </label>
        <label>
          Tên drone
          <input
            value={values.name}
            onChange={(event) => onChangeField("name", event.target.value)}
            required
          />
        </label>
      </div>
      <div className="field-grid">
        <label>
          Tình trạng
          <select
            value={values.status}
            onChange={(event) => onChangeField("status", event.target.value)}
          >
            {statusOptions.drone.map((status) => (
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
            onChange={(event) => onChangeField("battery", Number(event.target.value))}
          />
        </label>
      </div>
      <label>
        Nhiệm vụ gần nhất
        <textarea
          value={values.lastMission}
          onChange={(event) => onChangeField("lastMission", event.target.value)}
        />
      </label>
    </>
  );

  const renderCustomerFields = () => (
    <>
      <div className="field-grid">
        <label>
          Mã khách hàng
          <input
            value={values.id}
            onChange={(event) => onChangeField("id", event.target.value)}
            placeholder="Tự tạo nếu để trống"
          />
        </label>
        <label>
          Họ tên
          <input
            value={values.name}
            onChange={(event) => onChangeField("name", event.target.value)}
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
            onChange={(event) => onChangeField("email", event.target.value)}
            required
          />
        </label>
        <label>
          Số điện thoại
          <input
            value={values.phone}
            onChange={(event) => onChangeField("phone", event.target.value)}
            placeholder="VD: 0988 123 456"
            required
          />
        </label>
      </div>
      <label>
        Hạng thành viên
        <select
          value={values.tier}
          onChange={(event) => onChangeField("tier", event.target.value)}
        >
          {customerTiers.map((tier) => (
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
          onChange={(event) => onChangeField("active", event.target.checked)}
        />
        Cho phép nhận ưu đãi
      </label>
    </>
  );

  const renderOrderFields = () => (
    <>
      <div className="field-grid">
        <label>
          Mã đơn hàng
          <input
            value={values.id}
            onChange={(event) => onChangeField("id", event.target.value)}
            placeholder="Tự tạo nếu để trống"
          />
        </label>
        <label>
          Khách hàng
          <input
            value={values.customer}
            onChange={(event) => onChangeField("customer", event.target.value)}
            required
          />
        </label>
      </div>
      <label>
        Địa điểm giao
        <input
          value={values.destination}
          onChange={(event) => onChangeField("destination", event.target.value)}
          required
        />
      </label>
      <div className="field-grid">
        <label>
          Drone thực hiện
          <select
            value={values.droneId}
            onChange={(event) => onChangeField("droneId", event.target.value)}
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
            onChange={(event) => onChangeField("total", Number(event.target.value))}
            required
          />
        </label>
      </div>
      <label>
        Trạng thái
        <select
          value={values.status}
          onChange={(event) => onChangeField("status", event.target.value)}
        >
          {statusOptions.order.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </label>
    </>
  );

  const renderRestaurantFields = () => (
    <>
      <div className="field-grid">
        <label>
          Mã nhà hàng
          <input
            value={values.id}
            onChange={(event) => onChangeField("id", event.target.value)}
            placeholder="Tự tạo nếu để trống"
          />
        </label>
        <label>
          Tên nhà hàng
          <input
            value={values.name}
            onChange={(event) => onChangeField("name", event.target.value)}
            required
          />
        </label>
      </div>
      <label>
        Địa chỉ
        <input
          value={values.address}
          onChange={(event) => onChangeField("address", event.target.value)}
          required
        />
      </label>
      <label>
        Hotline
        <input
          value={values.hotline}
          onChange={(event) => onChangeField("hotline", event.target.value)}
          placeholder="VD: 1900 1234"
        />
      </label>
    </>
  );

  const renderMenuItemFields = () => (
    <>
      <div className="field-grid">
        <label>
          Mã món
          <input
            value={values.id}
            onChange={(event) => onChangeField("id", event.target.value)}
            placeholder="Tự tạo nếu để trống"
          />
        </label>
        <label>
          Tên món
          <input
            value={values.name}
            onChange={(event) => onChangeField("name", event.target.value)}
            required
          />
        </label>
      </div>
      <div className="field-grid">
        <label>
          Danh mục
          <select
            value={values.categoryId}
            onChange={(event) => onChangeField("categoryId", event.target.value)}
            required
          >
            <option value="">-- Chọn danh mục --</option>
            {(categories ?? []).map((category) => (
              <option key={category.id} value={category.id}>
                {category.title ?? category.name ?? category.id}
              </option>
            ))}
          </select>
        </label>
        <label>
          Giá (VND)
          <input
            type="number"
            min="0"
            value={values.price}
            onChange={(event) =>
              onChangeField("price", Number(event.target.value))
            }
            required
          />
        </label>
      </div>
      <label>
        Ảnh món (URL)
        <input
          value={values.img ?? ""}
          onChange={(event) => onChangeField("img", event.target.value)}
          placeholder="https://..."
        />
      </label>
      <label>
        Mô tả
        <textarea
          value={values.description ?? ""}
          onChange={(event) => onChangeField("description", event.target.value)}
        />
      </label>
      <label>
        Nhãn nổi bật
        <input
          value={values.tag ?? ""}
          onChange={(event) => onChangeField("tag", event.target.value)}
          placeholder="Best seller, spicy..."
        />
      </label>
      <label className="toggle">
        <input
          type="checkbox"
          checked={Boolean(values.isBestSeller)}
          onChange={(event) => onChangeField("isBestSeller", event.target.checked)}
        />
        Đánh dấu best seller
      </label>
    </>
  );

  const renderFields = () => {
    if (type === "drone") return renderDroneFields();
    if (type === "customer") return renderCustomerFields();
    if (type === "restaurant") return renderRestaurantFields();
    if (type === "menuItem") return renderMenuItemFields();
    return renderOrderFields();
  };

  return (
    <div className="drawer-overlay" role="presentation" onClick={onClose}>
      <div
        className="drawer"
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="drawer-header">
          <div>
            <h3>{mode === "create" ? "Tạo mới" : "Cập nhật"} {typeLabel}</h3>
            <p>
              Nhập thông tin chi tiết cho {typeDescription}.
            </p>
          </div>
          <button type="button" className="icon" onClick={onClose}>
            ✕
          </button>
        </header>
        <form onSubmit={onSubmit} className="drawer-content">
          {renderFields()}
          <footer className="drawer-footer">
            <button type="button" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="primary">
              {mode === "create" ? "Lưu" : "Cập nhật"}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}

export default AdminFormDrawer;
