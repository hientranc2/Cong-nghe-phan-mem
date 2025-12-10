import { Fragment, useMemo, useState } from "react";
import DroneDeliveryTracker from "../../components/DroneDeliveryTracker.jsx";

const inferProgressFromStatus = (status) => {
  const normalized = String(status || "").toLowerCase();
  if (normalized.includes("hoàn")) return 1;
  if (normalized.includes("giao")) return 0.38;
  if (normalized.includes("chuẩn")) return 0.08;
  if (normalized.includes("hoãn")) return 0.16;
  return 0.12;
};

const statusClassName = (status) => {
  const slug = String(status || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug ? `status-${slug}` : "status-unknown";
};

const normalizeStatus = (value) =>
  String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

function AdminOrdersSection({
  orders,
  onEdit,
  onAcceptOrder,
  onCancelOrder,
  emptyMessage,
  formatCurrency,
  onOrderDelivered,
  onAddDrone,
}) {
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [progressMap, setProgressMap] = useState({});

  const activeOrders = useMemo(
    () => (orders.length === 0 ? orders : orders.map((order) => ({ ...order }))),
    [orders]
  );

  const handleToggle = (order) => {
    setExpandedOrderId((current) => (current === order.id ? null : order.id));
    setProgressMap((current) =>
      current[order.id]
        ? current
        : { ...current, [order.id]: inferProgressFromStatus(order.status) }
    );
  };

  const handleMarkDelivered = (order) => {
    setProgressMap((current) => ({ ...current, [order.id]: 1 }));
    onOrderDelivered?.(order.id);
  };

  return (
    <section className="collection" id="orders">
      <div className="collection-heading">
        <div>
          <h2>Đơn hàng</h2>
          <p>Theo dõi các chuyến giao và giá trị đơn theo từng drone.</p>
        </div>
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
              activeOrders.map((order) => {
                const isExpanded = expandedOrderId === order.id;
                const initialProgress = progressMap[order.id] ?? inferProgressFromStatus(order.status);
                return (
                  <Fragment key={order.id}>
                    <tr
                      className={`order-row ${isExpanded ? "order-row--expanded" : ""}`}
                      onClick={() => handleToggle(order)}
                    >
                      <td>{order.id}</td>
                      <td>{order.customer}</td>
                      <td>{order.destination}</td>
                      <td>
                        {order.droneId ? (
                          order.droneId
                        ) : (
                          <button
                            type="button"
                            className="pill-button danger"
                            onClick={(event) => {
                              event.stopPropagation();
                              onAddDrone?.();
                            }}
                          >
                            Them drone
                          </button>
                        )}
                      </td>
                      <td>{formatCurrency(order.total)}</td>
                      <td>
                        <span className={`status-pill ${statusClassName(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="actions">
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            onEdit?.(order);
                          }}
                        >
                          Sửa
                        </button>
                        {(() => {
                          const normalizedStatus = normalizeStatus(order.status);
                          const awaitingConfirmation = normalizedStatus.includes("cho xac nhan");
                          const isCompleted = normalizedStatus.includes("hoan tat");
                          const isCanceled = normalizedStatus.includes("huy");

                          return (
                            <>
                              {awaitingConfirmation && (
                                <button
                                  type="button"
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    onAcceptOrder?.(order.id);
                                  }}
                                >
                                  Nhận đơn
                                </button>
                              )}
                              {!isCompleted && !isCanceled && (
                                <button
                                  type="button"
                                  className="danger"
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    onCancelOrder?.(order.id);
                                  }}
                                >
                                  Hủy đơn
                                </button>
                              )}
                            </>
                          );
                        })()}
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className="order-tracking-row">
                        <td colSpan={7}>
                          <div className="order-tracking-panel">
                            <div className="order-tracking-panel__header">
                              <div>
                                <p className="order-tracking-panel__eyebrow">Theo dõi tiến độ</p>
                                <h4>{order.destination}</h4>
                                <p className="order-tracking-panel__meta">
                                  Drone: {order.droneId} • Giá trị: {formatCurrency(order.total)}
                                </p>
                              </div>
                              <div className="order-tracking-panel__meta">
                                <span>Khách: {order.customer}</span>
                                <span className="dot" />
                                <span>Mã đơn: {order.id}</span>
                              </div>
                            </div>

                            <DroneDeliveryTracker
                              origin={order.origin || order.restaurantName || "Bếp trung tâm"}
                              destination={order.destination}
                              distanceKm={order.distanceKm || 4.6}
                              estimatedMinutes={order.estimatedDeliveryMinutes || 22}
                              lastUpdate={order.updatedAt || new Date()}
                              initialProgress={initialProgress}
                              autoAdvance={order.status?.toLowerCase() !== "hoàn tất"}
                              statusMessage="Theo dõi hành trình vận chuyển và tự động cập nhật khi drone giao hàng."
                              orderId={order.id}
                              confirmedAt={order.confirmedAt}
                              onDeliveryComplete={() => handleMarkDelivered(order)}
                            />
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default AdminOrdersSection;
