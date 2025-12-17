const normalizeStatus = (value) =>
  String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d");

function RestaurantOrdersSection({
  texts,
  isFormVisible,
  editingOrderId,
  orderForm,
  orders,
  onFieldChange,
  onSubmit,
  onCancel,
  onEditOrder,
  onAcceptOrder,
  onCancelOrder,
  formatCurrency,
  formatDateTime,
  statusBadgeClass,
}) {
  return (
    <section className="restaurant-section">
      <header className="restaurant-section__header">
        <div>
          <h2>{texts.heading}</h2>
          <p>{texts.description}</p>
        </div>
      </header>

      {isFormVisible && (
        <form className="restaurant-card restaurant-form" onSubmit={onSubmit}>
          <header className="restaurant-form__header">
            <h3>{editingOrderId ? texts.form.titleUpdate : texts.form.titleCreate}</h3>
          </header>
          <div className="restaurant-form__grid">
            <label>
              <span>{texts.form.customer}</span>
              <input
                type="text"
                value={orderForm.customer}
                onChange={(event) => onFieldChange("customer", event.target.value)}
                required
              />
            </label>
            <label>
              <span>{texts.form.items}</span>
              <input
                type="number"
                min="0"
                value={orderForm.items}
                onChange={(event) => onFieldChange("items", event.target.value)}
              />
            </label>
            <label>
              <span>{texts.form.total}</span>
              <input
                type="number"
                min="0"
                step="1000"
                value={orderForm.total}
                onChange={(event) => onFieldChange("total", event.target.value)}
              />
            </label>
            <label>
              <span>{texts.form.status}</span>
              <select
                value={orderForm.status}
                onChange={(event) => onFieldChange("status", event.target.value)}
              >
                {texts.form.statusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>{texts.form.placedAt}</span>
              <input
                type="datetime-local"
                value={orderForm.placedAt}
                onChange={(event) => onFieldChange("placedAt", event.target.value)}
              />
            </label>
            <label className="restaurant-form__full">
              <span>{texts.form.address}</span>
              <textarea
                rows={3}
                value={orderForm.address}
                onChange={(event) => onFieldChange("address", event.target.value)}
              />
            </label>
          </div>
          <div className="restaurant-form__actions">
            <button
              type="button"
              className="restaurant-btn restaurant-btn--ghost"
              onClick={onCancel}
            >
              {texts.form.cancel}
            </button>
            <button type="submit" className="restaurant-btn">
              {editingOrderId ? texts.form.submitUpdate : texts.form.submitCreate}
            </button>
          </div>
        </form>
      )}

      <div className="restaurant-card">
        {orders.length === 0 ? (
          <p className="restaurant-empty">{texts.empty}</p>
        ) : (
          <div className="restaurant-table restaurant-table--orders" role="table">
            <div className="restaurant-table__header" role="row">
              <span role="columnheader">{texts.columns.id}</span>
              <span role="columnheader">{texts.columns.customer}</span>
              <span role="columnheader">{texts.columns.items}</span>
              <span role="columnheader">{texts.columns.total}</span>
              <span role="columnheader">{texts.columns.status}</span>
              <span role="columnheader">{texts.columns.placedAt}</span>
              <span role="columnheader" className="table-actions">
                {texts.actionsLabel}
              </span>
            </div>
            {orders.map((order) => (
              <div
                key={order.id}
                className="restaurant-table__row is-clickable"
                role="row"
                tabIndex={0}
                onClick={() => onEditOrder?.(order)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onEditOrder?.(order);
                  }
                }}
              >
                <span role="cell">{order.id}</span>
                <span role="cell">
                  <strong>{order.customer}</strong>
                  {order.address && <small>{order.address}</small>}
                </span>
                <span role="cell">{order.items}</span>
                <span role="cell">{formatCurrency(order.total)}</span>
                <span role="cell">
                  <span className={statusBadgeClass(order.status)}>{order.status}</span>
                </span>
                <span role="cell">
                  <time dateTime={order.placedAt}>{formatDateTime(order.placedAt)}</time>
                </span>
                <span role="cell" className="table-actions">
                  <button
                    type="button"
                    className="link-button"
                    onClick={(event) => {
                      event.stopPropagation();
                      onEditOrder?.(order);
                    }}
                  >
                    {texts.actions.edit}
                  </button>
                  {(() => {
                    const normalizedStatus = normalizeStatus(order.status);
                    const canAccept =
                      normalizedStatus.includes("dang cho") ||
                      normalizedStatus.includes("cho xac nhan");
                    const isCompleted =
                      normalizedStatus.includes("hoan tat") ||
                      normalizedStatus.includes("hoan thanh") ||
                      normalizedStatus.includes("complete");
                    const isCancelled =
                      normalizedStatus.includes("huy") ||
                      normalizedStatus.includes("cancel");
                    const canCancel = !isCompleted && !isCancelled;

                    return (
                      <>
                        {canAccept && (
                          <button
                            type="button"
                            className="link-button"
                            onClick={(event) => {
                              event.stopPropagation();
                              onAcceptOrder?.(order);
                            }}
                          >
                            {texts.actions.accept}
                          </button>
                        )}
                        {canCancel && (
                          <button
                            type="button"
                            className="link-button link-button--danger"
                            onClick={(event) => {
                              event.stopPropagation();
                              onCancelOrder?.(order);
                            }}
                          >
                            {texts.actions.cancel}
                          </button>
                        )}
                      </>
                    );
                  })()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default RestaurantOrdersSection;
