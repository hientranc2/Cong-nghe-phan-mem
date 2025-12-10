import { useEffect, useMemo, useRef, useState } from "react";
import SimpleMap from "./SimpleMap.jsx";
import useGeocodedLocation from "../hooks/useGeocodedLocation.js";

import "./DroneDeliveryTracker.css";

const DEFAULT_ROUTE = [
  {
    id: "kitchen",
    title: "Nhà hàng đang chuẩn bị",
    description: "Đơn của bạn đã được xác nhận và đang được đóng gói.",
    icon: "*",
  },
  {
    id: "hub",
    title: "Drone nhận hàng",
    description: "Máy bay không người lái xuất phát từ trung tâm điều phối.",
    icon: "*",
  },
  {
    id: "enroute",
    title: "Đang bay đến",
    description: "Drone đang bay tới khu vực của bạn.",
    icon: "*",
  },
  {
    id: "landing",
    title: "Chuẩn bị hạ cánh",
    description: "Drone đang hạ độ cao và chuẩn bị giao hàng.",
    icon: "*",
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

const haversineDistanceKm = (from, to) => {
  if (!from || !to) return 0;
  const R = 6371;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(to.lat - from.lat);
  const dLng = toRad(to.lng - from.lng);
  const lat1 = toRad(from.lat);
  const lat2 = toRad(to.lat);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(Math.max(0, 1 - a)));
  return R * c;
};

const buildProgressKey = (orderId) => (orderId ? `drone-progress:${orderId}` : null);

function DroneDeliveryTracker({
  origin = "Nhà hàng",
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
  orderId = "--",
  confirmedAt = null,
  onDeliveryComplete = null,
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
  const [toast, setToast] = useState(null);
  const milestonesRef = useRef({
    oneThird: false,
    twoThird: false,
    arrival: false,
  });
  const completionRef = useRef(initialProgress >= 0.99);
  const loadedProgressRef = useRef(0);
  const [trackPoints, setTrackPoints] = useState([]);
  const timestamp = useMemo(() => parseDate(lastUpdate), [lastUpdate]);
  const positionProgress = progress;

  useEffect(() => {
    const normalizedInitial = clamp(initialProgress ?? 0.01, 0.01, 0.995); // keep min 1% for visibility but allow existing progress
    const key = buildProgressKey(orderId);
    if (!key) {
      setProgress(normalizedInitial);
      loadedProgressRef.current = normalizedInitial;
      completionRef.current = normalizedInitial >= 0.99;
      return;
    }
    try {
      const saved = localStorage.getItem(key);
      if (saved !== null) {
        const parsed = clamp(Number.parseFloat(saved), 0, 0.995);
        if (!Number.isNaN(parsed)) {
          setProgress(parsed);
          loadedProgressRef.current = parsed;
          completionRef.current = parsed >= 0.99;
          return;
        }
      }
    } catch {
      // ignore storage failures
    }
    setProgress(normalizedInitial);
    loadedProgressRef.current = normalizedInitial;
    completionRef.current = normalizedInitial >= 0.99;
  }, [orderId, initialProgress]);

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

  useEffect(() => {
    if (completionRef.current || !onDeliveryComplete) return undefined;

    if (positionProgress >= 0.995) {
      completionRef.current = true;
      onDeliveryComplete();
    }

    return undefined;
  }, [positionProgress, onDeliveryComplete]);

  useEffect(() => {
    const key = buildProgressKey(orderId);
    if (!key) return undefined;
    try {
      localStorage.setItem(key, progress.toFixed(4));
    } catch {
      // ignore storage write errors
    }
    return undefined;
  }, [orderId, progress]);

  useEffect(() => {
    if (!toast) return undefined;
    const duration = toast.duration ?? 3800;
    const id = setTimeout(() => setToast(null), duration);
    return () => clearTimeout(id);
  }, [toast?.key]);

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

  useEffect(() => {
    const startPoint =
      originLocation.coords ??
      destinationLocation.coords ??
      DEFAULT_ORIGIN_COORDS;
    const points = [startPoint];
    if (loadedProgressRef.current > 0 && originLocation.coords && destinationLocation.coords) {
      const ratio = clamp(loadedProgressRef.current, 0, 1);
      points.push({
        lat: startPoint.lat + (destinationLocation.coords.lat - startPoint.lat) * ratio,
        lng: startPoint.lng + (destinationLocation.coords.lng - startPoint.lng) * ratio,
      });
    }
    setTrackPoints(points);
    milestonesRef.current = { oneThird: false, twoThird: false, arrival: false };
  }, [orderId, originLocation.coords, destinationLocation.coords]);

  const routeDistanceKm = useMemo(() => {
    const calculated = haversineDistanceKm(originLocation.coords, destinationLocation.coords);
    return calculated > 0 ? calculated : distanceKm;
  }, [originLocation.coords, destinationLocation.coords, distanceKm]);

  const traveledDistanceKm = useMemo(() => {
    if (trackPoints.length < 2) return 0;
    let total = 0;
    for (let i = 1; i < trackPoints.length; i += 1) {
      total += haversineDistanceKm(trackPoints[i - 1], trackPoints[i]);
    }
    return total;
  }, [trackPoints]);

  const distanceProgress = useMemo(() => {
    if (!routeDistanceKm) return 0;
    return clamp(traveledDistanceKm / routeDistanceKm, 0, 1);
  }, [routeDistanceKm, traveledDistanceKm]);

  // Hiển thị tiến độ theo quãng đường thực đã bay; vị trí vẫn chạy theo progress để drone di chuyển mượt.
  const displayProgress = Math.max(distanceProgress, progress, 0.01);

  const droneCoords = useMemo(() => {
    const start = originLocation.coords ?? DEFAULT_ORIGIN_COORDS;
    const end = destinationLocation.coords ?? DEFAULT_DESTINATION_COORDS;
    const ratio = clamp(positionProgress, 0, 1);
    return {
      lat: start.lat + (end.lat - start.lat) * ratio,
      lng: start.lng + (end.lng - start.lng) * ratio,
    };
  }, [destinationLocation.coords, originLocation.coords, positionProgress]);

  useEffect(() => {
    if (!droneCoords?.lat || !droneCoords?.lng) return;
    setTrackPoints((prev) => {
      if (!prev.length) return [droneCoords];
      const last = prev[prev.length - 1];
      const delta = haversineDistanceKm(last, droneCoords);
      if (delta < 0.005) return prev; // ignore jitter < ~5m
      const trimmed = prev.length > 600 ? prev.slice(-300) : prev;
      return [...trimmed, droneCoords];
    });
  }, [droneCoords.lat, droneCoords.lng]);

  const mapMarkers = useMemo(() => {
    const markers = [];
    if (originLocation.coords) {
      markers.push({
        id: "origin",
        label: origin,
        subLabel: "Điểm xuất phát",
        type: "origin",
        ...originLocation.coords,
        offsetX: -60,
        offsetY: -32,
      });
    }
    if (destinationLocation.coords) {
      markers.push({
        id: "destination",
        label: destination,
        subLabel: "Điểm giao",
        type: "destination",
        ...destinationLocation.coords,
        offsetX: 60,
        offsetY: 36,
      });
    }
    markers.push({
      id: "drone",
      label: "Drone đang bay",
      subLabel: `${Math.round(displayProgress * 100)}% lộ trình`,
      type: "drone",
      ...droneCoords,
      offsetX: 0,
      offsetY: 12,
    });
    return markers;
  }, [destinationLocation.coords, droneCoords, origin, originLocation.coords, destination, displayProgress]);

  const pathPositions = useMemo(() => {
    if (trackPoints.length > 1) return trackPoints;
    if (!originLocation.coords || !destinationLocation.coords) {
      return [];
    }
    return [originLocation.coords, droneCoords, destinationLocation.coords];
  }, [destinationLocation.coords, droneCoords, originLocation.coords, trackPoints]);

  const statuses = useMemo(() => {
    const denominator = Math.max(safeRoute.length - 1, 1);
    return safeRoute.map((point, index) => {
      const startThreshold = index / denominator;
      const nextThreshold = (index + 1) / denominator;
      let state = "upcoming";
      if (displayProgress >= nextThreshold - 0.001) {
        state = "done";
      } else if (displayProgress >= startThreshold - 0.001) {
        state = "active";
      }
      return { ...point, state };
    });
  }, [safeRoute, displayProgress]);

  const baseSpeedKmPerMin =
    routeDistanceKm > 0 && estimatedMinutes > 0
      ? routeDistanceKm / estimatedMinutes
      : null;

  const dynamicEtaMinutes = useMemo(() => {
    if (!baseSpeedKmPerMin) return estimatedMinutes;
    const remaining = Math.max(routeDistanceKm - traveledDistanceKm, 0);
    const eta = remaining / baseSpeedKmPerMin;
    return Math.max(1, eta); // keep at least 1 minute for readability
  }, [baseSpeedKmPerMin, estimatedMinutes, routeDistanceKm, traveledDistanceKm]);

  const formattedDistance = `${routeDistanceKm.toFixed(2)} km`;
  const formattedEta = `~${Math.round(dynamicEtaMinutes)} ${minutesSuffix}`;
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

  useEffect(() => {
    const ratio = distanceProgress ?? 0;
    const milestones = milestonesRef.current;

    if (ratio >= 1 / 3 && !milestones.oneThird) {
      milestones.oneThird = true;
      setToast({ message: "Drone đã bay được 1/3 quãng đường", key: "oneThird" });
    }

    if (ratio >= 2 / 3 && !milestones.twoThird) {
      milestones.twoThird = true;
      setToast({ message: "Drone đã bay được 2/3 quãng đường", key: "twoThird" });
    }

    if (ratio >= 0.999 && !milestones.arrival) {
      milestones.arrival = true;
      setToast({
        message: "Drone đã đến địa chỉ của bạn, vui lòng nhận hàng!",
        key: "arrival",
        duration: 5200,
      });
    }
  }, [distanceProgress]);

  return (
    <>
      {toast && (
        <div className="tracking-toast" role="status" aria-live="polite">
          {toast.message}
        </div>
      )}
      <section className="order-tracking" aria-label={title} id="tracking">
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
            <dt>Đã bay</dt>
            <dd>{`${traveledDistanceKm.toFixed(2)} km`}</dd>
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

      <div className="tracking-map" role="presentation">
        <SimpleMap
          center={mapCenter}
          markers={mapMarkers}
          path={pathPositions}
          height="100%"
          minHeight={420}
          loading={originLocation.status === "loading" || destinationLocation.status === "loading"}
          className="tracking-map__leaflet"
        />
        <div className="tracking-map__status">
          <div>
            <strong>Kết nối bản đồ</strong>
            <p>
              {originLocation.status === "error" || destinationLocation.status === "error"
                ? "Không thể tải bản đồ trong lúc định vị. Đang dùng vị trí gần nhất."
                : "Drone hiển thị trên bản đồ trực tuyến giống Google Maps."}
            </p>
            <p className="tracking-map__distance">
              {`Đã bay: ${traveledDistanceKm.toFixed(2)} km / ${routeDistanceKm.toFixed(2)} km`}
            </p>
          </div>
          <div className="tracking-map__status-pill">
            {originLocation.status === "loading" || destinationLocation.status === "loading"
              ? "Đang cập nhật vị trí"
              : "Theo dõi trực tiếp"}
          </div>
        </div>
      </div>
      </section>
    </>
  );
}

export default DroneDeliveryTracker;
