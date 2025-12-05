import { useEffect, useMemo, useState } from "react";
import SimpleMap from "./SimpleMap.jsx";
import useGeocodedLocation from "../hooks/useGeocodedLocation.js";

import "./DroneDeliveryTracker.css";

const DEFAULT_ROUTE = [
  {
    id: "kitchen",
    title: "Nhà hàng đang chuẩn bị",
    description: "Đơn của bạn đã được xác nhận và đang được đóng gói.",
    icon: "🍳",
  },
  {
    id: "hub",
    title: "Drone nhận hàng",
    description: "Máy bay không người lái xuất phát từ trung tâm điều phối.",
    icon: "🚁",
  },
  {
    id: "enroute",
    title: "Đang bay đến",
    description: "Drone đang bay tới khu vực của bạn.",
    icon: "🛰️",
  },
  {
    id: "landing",
    title: "Chuẩn bị hạ cánh",
    description: "Drone đang hạ độ cao và chuẩn bị giao hàng.",
    icon: "📍",
  },
];

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const parseDate = (value) => {
  if (!value) {
    return new Date();
  }

  if (value instanceof Date) {
    return value;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return new Date();
  }
  return parsed;
};

const DEFAULT_ORIGIN_COORDS = { lat: 10.776492, lng: 106.700414 };
const DEFAULT_DESTINATION_COORDS = { lat: 10.780733, lng: 106.700921 };

function DroneDeliveryTracker({
  origin = "Nhà hàng ",
  destination = "Địa chỉ khách hàng",
  distanceKm = 4.2,
  estimatedMinutes = 18,
  lastUpdate = new Date(),
  routePoints = DEFAULT_ROUTE,
  initialProgress = 0,
  texts = {},
  autoAdvance = true,
  statusMessage =
    "Drone đang trên đường giao hàng. Hãy giữ điện thoại bên bạn để nhận hàng nhanh nhất.",
  orderId = "—",
  confirmedAt = null,
}) {
  const {
    title = "Theo dõi hành trình drone",
    description = "Theo dõi trực tiếp quãng đường di chuyển của drone giao hàng.",
    distanceLabel = "Quãng đường",
    etaLabel = "Dự kiến đến nơi",
    destinationLabel = "Điểm đến",
    updatedLabel = "Cập nhật cuối",
    minutesSuffix = "phút",
    originLabel = "Nhà hàng",
    orderLabel = "Mã đơn",
    statusHeading = "Trạng thái",
    confirmedLabel = "Đã xác nhận",
  } = texts;

  const safeRoute = routePoints.length > 1 ? routePoints : DEFAULT_ROUTE;
  const [progress, setProgress] = useState(() => clamp(initialProgress, 0, 0.95));
  const timestamp = useMemo(() => parseDate(lastUpdate), [lastUpdate]);

  useEffect(() => {
    setProgress((prev) => clamp(initialProgress ?? prev, 0, 0.98));
  }, [initialProgress]);

  useEffect(() => {
    if (!autoAdvance) {
      return undefined;
    }

    const durationMs = Math.max(estimatedMinutes, 8) * 4000;
    const interval = 1200;
    const increment = interval / durationMs;

    const id = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 0.995) {
          clearInterval(id);
          return 1;
        }
        return clamp(prev + increment, 0, 1);
      });
    }, interval);

    return () => clearInterval(id);
  }, [estimatedMinutes, autoAdvance]);

  const originLocation = useGeocodedLocation(origin, DEFAULT_ORIGIN_COORDS);
  const destinationLocation = useGeocodedLocation(destination, DEFAULT_DESTINATION_COORDS);

  const mapCenter = useMemo(() => {
    if (originLocation.coords && destinationLocation.coords) {
      return {
        lat: (originLocation.coords.lat + destinationLocation.coords.lat) / 2,
        lng: (originLocation.coords.lng + destinationLocation.coords.lng) / 2,
      };
    }
    return originLocation.coords ?? destinationLocation.coords ?? DEFAULT_ORIGIN_COORDS;
  }, [originLocation.coords, destinationLocation.coords]);

  const droneCoords = useMemo(() => {
    const start = originLocation.coords ?? DEFAULT_ORIGIN_COORDS;
    const end = destinationLocation.coords ?? DEFAULT_DESTINATION_COORDS;
    const ratio = clamp(progress, 0, 1);
    return {
      lat: start.lat + (end.lat - start.lat) * ratio,
      lng: start.lng + (end.lng - start.lng) * ratio,
    };
  }, [destinationLocation.coords, originLocation.coords, progress]);

  const mapMarkers = useMemo(() => {
    const markers = [];
    if (originLocation.coords) {
      markers.push({
        id: "origin",
        label: origin,
        subLabel: "Điểm xuất phát",
        type: "origin",
        ...originLocation.coords,
      });
    }
    if (destinationLocation.coords) {
      markers.push({
        id: "destination",
        label: destination,
        subLabel: "Điểm giao",
        type: "destination",
        ...destinationLocation.coords,
      });
    }
    markers.push({
      id: "drone",
      label: "Drone đang bay",
      subLabel: `${Math.round(progress * 100)}% lộ trình`,
      type: "drone",
      ...droneCoords,
    });
    return markers;
  }, [destinationLocation.coords, droneCoords, origin, originLocation.coords, destination, progress]);

  const pathPositions = useMemo(() => {
    if (!originLocation.coords || !destinationLocation.coords) {
      return [];
    }
    return [originLocation.coords, droneCoords, destinationLocation.coords];
  }, [destinationLocation.coords, droneCoords, originLocation.coords]);

  const statuses = useMemo(() => {
    const denominator = Math.max(safeRoute.length - 1, 1);
    return safeRoute.map((point, index) => {
      const startThreshold = index / denominator;
      const nextThreshold = (index + 1) / denominator;
      let state = "upcoming";
      if (progress >= nextThreshold - 0.001) {
        state = "done";
      } else if (progress >= startThreshold - 0.001) {
        state = "active";
      }
      return { ...point, state };
    });
  }, [safeRoute, progress]);

  const formattedDistance = `${distanceKm.toFixed(1)} km`;
  const formattedEta = `~${Math.round(estimatedMinutes)} ${minutesSuffix}`;
  const formattedUpdatedAt = useMemo(
    () => timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    [timestamp],
  );
  const formattedConfirmedAt = useMemo(() => {
    if (!confirmedAt) {
      return null;
    }
    return parseDate(confirmedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }, [confirmedAt]);

  return (
    <section className="order-tracking" aria-label={title} id="tracking">
      <div className="tracking-map" role="presentation">
        <SimpleMap
          center={mapCenter}
          markers={mapMarkers}
          path={pathPositions}
          height={320}
          loading={originLocation.status === "loading" || destinationLocation.status === "loading"}
          className="tracking-map__leaflet"
        />
        <div className="tracking-map__status">
          <div>
            <strong>Kết nối bản đồ</strong>
            <p>
              {originLocation.status === "error" || destinationLocation.status === "error"
                ? "Không thể định vị tự động. Đang dùng tọa độ mặc định của khu vực."
                : "Drone hiển thị trên nền bản đồ trực tuyến giống Google Maps."}
            </p>
          </div>
          <div className="tracking-map__status-pill">
            {originLocation.status === "loading" || destinationLocation.status === "loading"
              ? "Đang cập nhật vị trí"
              : "Theo dõi trực tiếp"}
          </div>
        </div>
      </div>

      <div className="tracking-info">
        <header className="tracking-info__header">
          <h4>{title}</h4>
          <p>{description}</p>
        </header>
        <div className="tracking-status-card">
          <div className="tracking-status-card__meta">
            <div>
              <span className="tracking-status-card__label">{orderLabel}</span>
              <strong className="tracking-status-card__value">{orderId}</strong>
            </div>
            {confirmedAt && formattedConfirmedAt && (
              <div>
                <span className="tracking-status-card__label">{confirmedLabel}</span>
                <time className="tracking-status-card__value">{formattedConfirmedAt}</time>
              </div>
            )}
          </div>
          <div className="tracking-status-card__message">
            <h5>{statusHeading}</h5>
            <p>{statusMessage}</p>
          </div>
        </div>
        <dl className="tracking-stats">
          <div>
            <dt>{distanceLabel}</dt>
            <dd>{formattedDistance}</dd>
          </div>
          <div>
            <dt>{etaLabel}</dt>
            <dd>{formattedEta}</dd>
          </div>
          <div>
            <dt>{updatedLabel}</dt>
            <dd>{formattedUpdatedAt}</dd>
          </div>
        </dl>
        <div className="tracking-destination tracking-destination--origin">
          <span className="tracking-destination__label">{originLabel}</span>
          <span className="tracking-destination__value">{origin}</span>
        </div>
        <div className="tracking-destination">
          <span className="tracking-destination__label">{destinationLabel}</span>
          <span className="tracking-destination__value">{destination}</span>
        </div>
        <ul className="tracking-steps">
          {statuses.map((step) => (
            <li key={step.id ?? step.title} className={`tracking-step tracking-step--${step.state}`}>
              <div className="tracking-step__icon" aria-hidden="true">
                {step.icon}
              </div>
              <div className="tracking-step__content">
                <strong>{step.title}</strong>
                <p>{step.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default DroneDeliveryTracker;