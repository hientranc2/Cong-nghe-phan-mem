import { useMemo } from "react";
import DroneDeliveryTracker from "../components/DroneDeliveryTracker.jsx";
import "./OrderTrackingPage.css";

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const readPersistedProgress = (orderId) => {
  if (!orderId || typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(`drone-progress:${orderId}`);
    if (raw === null) return null;
    const parsed = Number.parseFloat(raw);
    if (Number.isNaN(parsed)) return null;
    return clamp(parsed, 0, 0.995);
  } catch {
    return null;
  }
};

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
  const trackingTexts = texts.trackingTexts ?? {};

  const deliveryOption = activeOrder.deliveryOption ?? "today";
  const estimatedDeliveryMinutes =
    Number(activeOrder.estimatedDeliveryMinutes) || (deliveryOption === "today" ? 22 : 45);
  const distanceKm = Number(activeOrder.distanceKm) || 4.6;
  const deliveryProgress =
    typeof activeOrder.deliveryProgress === "number"
      ? activeOrder.deliveryProgress
      : typeof activeOrder.progress === "number"
        ? activeOrder.progress
        : 0.01;

  const customer = receipt?.customer ?? activeOrder.customer ?? null;
  const destination = customer?.address ?? activeOrder.address ?? "Địa chỉ khách hàng";
  const confirmedAt = receipt?.confirmedAt ?? activeOrder.confirmedAt ?? null;
  const orderId = receipt?.id ?? activeOrder.id ?? "--";
  const lastUpdate = receipt?.updatedAt ?? confirmedAt ?? new Date();
  const persistedProgress = useMemo(() => readPersistedProgress(orderId), [orderId]);
  const effectiveProgress = persistedProgress ?? deliveryProgress ?? 0.01;

  const statusMessage =
    texts.statusMessage ??
    "Drone đang trên đường giao hàng. Hãy giữ điện thoại bên bạn để nhận hàng nhanh nhất.";

  const restaurantName =
    activeOrder.restaurantName ??
    activeOrder.restaurant?.name ??
    activeOrder.storeName ??
    texts.restaurantFallback ??
    "Nhà hàng";
  const restaurantAddress =
    activeOrder.restaurantAddress ??
    activeOrder.restaurant?.address ??
    activeOrder.restaurantCity ??
    activeOrder.restaurant?.city ??
    activeOrder.city ??
    null;
  const restaurantOriginLabel = restaurantAddress
    ? `${restaurantName} • ${restaurantAddress}`
    : restaurantName;
  const restaurantOriginQuery = restaurantAddress
    ? `${restaurantName}, ${restaurantAddress}`
    : restaurantName;

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
            origin={restaurantOriginLabel}
            originQuery={restaurantOriginQuery}
            destination={destination}
          distanceKm={distanceKm}
          estimatedMinutes={estimatedDeliveryMinutes}
          lastUpdate={lastUpdate}
          initialProgress={effectiveProgress}
          texts={trackingTexts}
          statusMessage={statusMessage}
          orderId={orderId}
          confirmedAt={confirmedAt}
        />
        </section>
      </div>
    </main>
  );
}

export default OrderTrackingPage;
