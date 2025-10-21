import "./OrderHistoryPage.css";

function OrderHistoryPage({
  user = null,
  orders = [],
  texts = {},
  onSelectOrder = () => {},
  onTrackOrder = () => {},
  onBackHome = () => {},
}) {
  const isCustomer = user?.role === "customer";
  const title = texts.title ?? "Đơn hàng của bạn";
  const subtitle =
    texts.subtitle ??
    "Xem lại các đơn hàng đã xác nhận gần đây và tiếp tục theo dõi hành trình giao hàng.";
  const emptyMessage =
    texts.emptyMessage ??
    "Bạn chưa có đơn hàng nào được lưu. Khi hoàn tất đặt món, đơn hàng sẽ xuất hiện tại đây.";
  const emptyCtaLabel = texts.emptyCtaLabel ?? "Khám phá thực đơn";
  const viewDetailsLabel = texts.viewDetailsLabel ?? "Xem chi tiết";
  const trackLabel = texts.trackLabel ?? "Theo dõi";
  const trackDisabledLabel = texts.trackDisabledLabel ?? "Đã hoàn tất";
  const backHomeLabel = texts.backHomeLabel ?? "Về trang chủ";
  const itemsLabel = texts.itemsLabel ?? "Món đã đặt";
  const totalLabel = texts.totalLabel ?? "Tổng cộng";
  const confirmedAtLabel = texts.confirmedAtLabel ?? "Thời gian xác nhận";
  const statusLabel = texts.statusLabel ?? "Trạng thái";
  const statusInTransit = texts.statusInTransit ?? "Đang giao";
  const statusCompleted = texts.statusCompleted ?? "Hoàn tất";
  const unauthorizedMessage =
    texts.unauthorizedMessage ??
    "Vui lòng đăng nhập bằng tài khoản khách hàng để xem lịch sử đơn hàng.";

  const hasOrders = orders.length > 0;

  const formatPrice = (value) => {
    const numericValue = Number(value);
    if (Number.isNaN(numericValue)) {
      return value ?? "—";
    }
    return `${numericValue}k`;
  };

  const formatDateTime = (value) => {
    if (!value) {
      return "—";
    }

    try {
      return new Date(value).toLocaleString();
    } catch (error) {
      return value;
    }
  };

  const resolveStatus = (order) => {
    if (order?.status) {
      return order.status;
    }

    const progress =
      typeof order?.deliveryProgress === "number"
        ? order.deliveryProgress
        : typeof order?.progress === "number"
          ? order.progress
          : null;

    if (progress !== null && progress >= 0.99) {
      return statusCompleted;
    }

    return statusInTransit;
  };

  if (!isCustomer) {
    return (
      <main className="order-history-page" aria-labelledby="order-history-heading">
        <div className="order-history-empty">
          <p>{unauthorizedMessage}</p>
          <button type="button" className="order-history-btn" onClick={onBackHome}>
            {backHomeLabel}
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="order-history-page" aria-labelledby="order-history-heading">
      <header className="order-history-header">
        <div>
          <h2 id="order-history-heading">{title}</h2>
          <p>{subtitle}</p>
        </div>
        <button type="button" className="order-history-btn" onClick={onBackHome}>
          {backHomeLabel}
        </button>
      </header>

      {hasOrders ? (
        <ul className="order-history-list">
          {orders.map((order, index) => {
            const orderId = order.id ?? order.code ?? "—";
            const orderKey =
              orderId !== "—"
                ? orderId
                : `${order.confirmedAt ?? order.createdAt ?? "order"}-${index}`;
            const confirmedAt = order.confirmedAt ?? order.createdAt ?? null;
            const items = Array.isArray(order.items) ? order.items : [];
            const total =
              order.total ??
              order.grandTotal ??
              order.subtotal ??
              items.reduce(
                (sum, item) => sum + Number(item.price ?? 0) * Number(item.quantity ?? 0),
                0
              );
            const progress =
              typeof order?.deliveryProgress === "number"
                ? order.deliveryProgress
                : typeof order?.progress === "number"
                  ? order.progress
                  : null;
            const canTrack = typeof progress === "number" ? progress < 1.01 : true;

            return (
              <li key={orderKey} className="order-history-card">
                <div className="order-history-card__header">
                  <div>
                    <h3>{orderId}</h3>
                    <span className="order-history-meta">
                      {confirmedAtLabel}: {formatDateTime(confirmedAt)}
                    </span>
                  </div>
                  <span className="order-history-status">{statusLabel}: {resolveStatus(order)}</span>
                </div>

                <div className="order-history-card__body">
                  <div className="order-history-items">
                    <strong>{itemsLabel}:</strong>
                    <span>
                      {items.length > 0
                        ? items
                            .map((item) => `${item.quantity ?? 1}x ${item.name ?? item.id ?? "Món"}`)
                            .join(", ")
                        : "—"}
                    </span>
                  </div>
                  <div className="order-history-total">
                    <strong>{totalLabel}:</strong>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                <div className="order-history-card__actions">
                  <button
                    type="button"
                    className="order-history-btn order-history-btn--ghost"
                    onClick={() => onSelectOrder(orderId)}
                  >
                    {viewDetailsLabel}
                  </button>
                  <button
                    type="button"
                    className="order-history-btn order-history-btn--primary"
                    onClick={() => onTrackOrder(orderId)}
                    disabled={!canTrack}
                    aria-disabled={!canTrack}
                  >
                    {canTrack ? trackLabel : trackDisabledLabel}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="order-history-empty">
          <p>{emptyMessage}</p>
          <button type="button" className="order-history-btn" onClick={onBackHome}>
            {emptyCtaLabel}
          </button>
        </div>
      )}
    </main>
  );
}

export default OrderHistoryPage;
