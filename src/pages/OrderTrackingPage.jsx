import DroneDeliveryTracker from "../components/DroneDeliveryTracker.jsx";
import "./OrderTrackingPage.css";

function OrderTrackingPage({
  receipt = null,
  pendingOrder = null,
  texts = {},
  onBackToOrder = () => {},
  onBackHome = () => {},
}) {
  const activeOrder = receipt ?? pendingOrder;

  if (!activeOrder) {
    return null;
  }

  const title = texts.title ?? "Theo dõi đơn hàng";
  const subtitle =
    texts.subtitle ??
    "Xem lộ trình drone giao hàng của bạn theo thời gian thực và cập nhật trạng thái mới nhất.";
  const backToOrderLabel = texts.backToOrderLabel ?? "Quay lại đơn hàng";
  const backHomeLabel = texts.backHomeLabel ?? "Về trang chủ";
  const orderInfoTitle = texts.orderInfoTitle ?? "Thông tin đơn";
  const customerInfoTitle = texts.customerInfoTitle ?? "Thông tin người nhận";
  const destinationLabel = texts.destinationLabel ?? "Điểm đến";
  const paymentLabel = texts.paymentLabel ?? "Thanh toán";
  const statusLabel = texts.statusLabel ?? "Trạng thái hiện tại";
  const summaryTitle = texts.summaryTitle ?? "Tóm tắt món";
  const subtotalLabel = texts.subtotalLabel ?? "Tạm tính";
  const shippingLabel = texts.shippingLabel ?? "Phí vận chuyển";
  const totalLabel = texts.totalLabel ?? "Tổng thanh toán";
  const trackingTexts = texts.trackingTexts ?? {};

  const items = activeOrder.items ?? [];
  const subtotal =
    activeOrder.subtotal ?? items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = activeOrder.shipping ?? activeOrder.shippingValue ?? 0;
  const total = activeOrder.total ?? subtotal + shipping;

  const deliveryOption = activeOrder.deliveryOption ?? "today";
  const estimatedDeliveryMinutes =
    Number(activeOrder.estimatedDeliveryMinutes) || (deliveryOption === "today" ? 22 : 45);
  const distanceKm = Number(activeOrder.distanceKm) || 4.6;
  const deliveryProgress =
    typeof activeOrder.deliveryProgress === "number"
      ? activeOrder.deliveryProgress
      : typeof activeOrder.progress === "number"
        ? activeOrder.progress
        : 0.32;

  const customer = receipt?.customer ?? activeOrder.customer ?? null;
  const destination = customer?.address ?? activeOrder.address ?? "—";
  const paymentMethod = customer?.paymentMethod ?? activeOrder.paymentMethod ?? "cash";
  const paymentMethodLabel = texts.paymentOptions?.find((option) => option.value === paymentMethod)?.label;
  const formattedPayment = paymentMethodLabel ?? paymentMethod;

  const formatPrice = (value) => `${value}k`;
  const confirmedAt = receipt?.confirmedAt ?? activeOrder.confirmedAt ?? null;
  const orderId = receipt?.id ?? activeOrder.id ?? "—";
  const lastUpdate = receipt?.updatedAt ?? confirmedAt ?? new Date();

  const statusMessage =
    texts.statusMessage ??
    "Drone đang trên đường giao hàng. Hãy giữ điện thoại bên bạn để nhận hàng nhanh nhất.";

  return (
    <main className="order-tracking-page" aria-labelledby="order-tracking-heading">
      <header className="order-tracking-header">
        <div>
          <h2 id="order-tracking-heading">{title}</h2>
          <p>{subtitle}</p>
        </div>
        <div className="order-tracking-actions">
          <button type="button" className="order-btn order-btn--ghost" onClick={onBackToOrder}>
            {backToOrderLabel}
          </button>
          <button type="button" className="order-btn order-btn--primary" onClick={onBackHome}>
            {backHomeLabel}
          </button>
        </div>
      </header>

      <div className="order-tracking-layout">
        <section className="order-tracking-map-panel">
          <DroneDeliveryTracker
            destination={destination}
            distanceKm={distanceKm}
            estimatedMinutes={estimatedDeliveryMinutes}
            lastUpdate={lastUpdate}
            initialProgress={deliveryProgress}
            texts={trackingTexts}
          />
        </section>

        <aside className="order-tracking-sidebar">
          <section className="order-tracking-card" aria-label={orderInfoTitle}>
            <h3>{orderInfoTitle}</h3>
            <dl>
              <div>
                <dt>Mã đơn</dt>
                <dd>{orderId}</dd>
              </div>
              <div>
                <dt>{statusLabel}</dt>
                <dd>{statusMessage}</dd>
              </div>
              {confirmedAt && (
                <div>
                  <dt>Đã xác nhận lúc</dt>
                  <dd>{new Date(confirmedAt).toLocaleString()}</dd>
                </div>
              )}
            </dl>
          </section>

          <section className="order-tracking-card" aria-label={customerInfoTitle}>
            <h3>{customerInfoTitle}</h3>
            <ul>
              <li>
                <strong>{destinationLabel}:</strong> {destination || "—"}
              </li>
              {customer?.phone && (
                <li>
                  <strong>Điện thoại:</strong> {customer.phone}
                </li>
              )}
              {customer?.email && (
                <li>
                  <strong>Email:</strong> {customer.email}
                </li>
              )}
              <li>
                <strong>{paymentLabel}:</strong> {formattedPayment}
              </li>
            </ul>
          </section>

          <section className="order-tracking-card" aria-label={summaryTitle}>
            <h3>{summaryTitle}</h3>
            <ul className="order-tracking-items">
              {items.map((item) => (
                <li key={item.id}>
                  <span>{item.name} × {item.quantity}</span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <dl className="order-tracking-totals">
              <div>
                <dt>{subtotalLabel}</dt>
                <dd>{formatPrice(subtotal)}</dd>
              </div>
              <div>
                <dt>{shippingLabel}</dt>
                <dd>{shipping > 0 ? formatPrice(shipping) : "Miễn phí"}</dd>
              </div>
              <div className="order-tracking-total">
                <dt>{totalLabel}</dt>
                <dd>{formatPrice(total)}</dd>
              </div>
            </dl>
          </section>
        </aside>
      </div>
    </main>
  );
}

export default OrderTrackingPage;
