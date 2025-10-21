import { useEffect, useMemo, useState } from "react";
import droneIcon from "../assets/drone-icon.svg";

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

const START_POINT = { x: 14, y: 74 };
const END_POINT = { x: 86, y: 24 };

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

  const routeSamples = useMemo(() => {
    const segments = 48;
    return Array.from({ length: segments + 1 }, (_, index) => {
      const ratio = index / segments;
      const wobble = Math.sin(ratio * Math.PI * 1.35) * 5.5;
      const curvature = Math.sin(ratio * Math.PI) * 22;
      const x = START_POINT.x + (END_POINT.x - START_POINT.x) * ratio + wobble;
      const y = START_POINT.y + (END_POINT.y - START_POINT.y) * ratio - curvature;
      return { x, y };
    });
  }, []);

  const positions = useMemo(() => {
    const count = Math.max(safeRoute.length, 2);
    return Array.from({ length: count }, (_, index) => {
      const ratio = index / (count - 1);
      const wobble = Math.sin(ratio * Math.PI * 1.2) * 4;
      const curvature = Math.sin(ratio * Math.PI) * 20;
      const x = START_POINT.x + (END_POINT.x - START_POINT.x) * ratio + wobble;
      const y = START_POINT.y + (END_POINT.y - START_POINT.y) * ratio - curvature;
      return { x, y };
    });
  }, [safeRoute.length]);

  const pathD = useMemo(() => {
    if (routeSamples.length === 0) {
      return "";
    }

    const [first, ...rest] = routeSamples;
    const commands = rest.map((point) => `L ${point.x} ${point.y}`);
    return [`M ${first.x} ${first.y}`, ...commands].join(" ");
  }, [routeSamples]);

  const dronePosition = useMemo(() => {
    if (routeSamples.length === 0) {
      return { x: 50, y: 50 };
    }

    const safeProgress = clamp(progress, 0, 0.999);
    const exact = safeProgress * (routeSamples.length - 1);
    const index = Math.floor(exact);
    const localProgress = exact - index;
    const start = routeSamples[index];
    const end = routeSamples[Math.min(routeSamples.length - 1, index + 1)];

    return {
      x: start.x + (end.x - start.x) * localProgress,
      y: start.y + (end.y - start.y) * localProgress,
    };
  }, [routeSamples, progress]);

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
        <svg viewBox="0 0 100 100" className="tracking-map__svg" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="trackingPathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(255, 90, 31, 0.75)" />
              <stop offset="100%" stopColor="rgba(255, 196, 31, 0.9)" />
            </linearGradient>
            <radialGradient id="trackingPointGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.95)" />
              <stop offset="100%" stopColor="rgba(255, 90, 31, 0.35)" />
            </radialGradient>
            <radialGradient id="trackingOriginGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.95)" />
              <stop offset="100%" stopColor="rgba(31, 138, 112, 0.4)" />
            </radialGradient>
            <radialGradient id="trackingDestinationGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.95)" />
              <stop offset="100%" stopColor="rgba(255, 90, 31, 0.5)" />
            </radialGradient>
          </defs>
          {pathD && (
            <path d={pathD} fill="none" stroke="url(#trackingPathGradient)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="tracking-map__route" />
          )}
          {positions.map((point, index) => (
            <g key={safeRoute[index]?.id ?? index}>
              <circle cx={point.x} cy={point.y} r={4.8} fill="url(#trackingPointGradient)" stroke="rgba(255, 90, 31, 0.65)" strokeWidth="0.8" />
            </g>
          ))}
          <circle cx={START_POINT.x} cy={START_POINT.y} r={6} fill="url(#trackingOriginGradient)" stroke="rgba(31, 138, 112, 0.6)" strokeWidth="1" />
          <circle cx={END_POINT.x} cy={END_POINT.y} r={6.4} fill="url(#trackingDestinationGradient)" stroke="rgba(255, 90, 31, 0.6)" strokeWidth="1" />
        </svg>
        <div
          className="tracking-map__landmark tracking-map__landmark--origin"
          style={{ left: `${START_POINT.x}%`, top: `${START_POINT.y}%` }}
        >
          <span aria-hidden="true">🍽️</span>
          <span>{origin}</span>
        </div>
        <div
          className="tracking-map__landmark tracking-map__landmark--destination"
          style={{ left: `${END_POINT.x}%`, top: `${END_POINT.y}%` }}
        >
          <span aria-hidden="true">📍</span>
          <span>{destination}</span>
        </div>
        <div
          className="tracking-map__drone"
          style={{ left: `${dronePosition.x}%`, top: `${dronePosition.y}%` }}
        >
                   <img src={droneIcon} alt="Drone giao hàng" />

        </div>
        <div className="tracking-map__pulse" style={{ left: `${dronePosition.x}%`, top: `${dronePosition.y}%` }} aria-hidden="true" />
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