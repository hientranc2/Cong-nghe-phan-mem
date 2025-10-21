import { useEffect, useMemo, useState } from "react";
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

const START_POINT = { x: 38, y: 14 };
const END_POINT = { x: 48, y: 86 };

const MAP_OUTLINE_PATH =
  "M34 8 C40 10 50 15 56 22 C62 29 63 36 58 44 C52 52 57 57 61 64 C65 71 63 79 56 86 C49 93 40 94 32 88 C24 82 22 72 26 62 C30 52 28 46 22 38 C16 30 18 20 26 14 C30 11 32 9.5 34 8 Z";

const MAP_CITIES = [
  { id: "hanoi", label: "Hà Nội", x: 38, y: 12, position: "north" },
  { id: "ninhbinh", label: "Ninh Bình", x: 42, y: 28, position: "east" },
  { id: "hue", label: "Huế", x: 46, y: 46, position: "west" },
  { id: "nhatrang", label: "Nha Trang", x: 54, y: 64, position: "east" },
  { id: "hochiminh", label: "TP.HCM", x: 48, y: 88, position: "south" },
];

function DroneDeliveryTracker({
  origin = "Nhà hàng đối tác",
  destination = "Địa chỉ khách hàng",
  distanceKm = 4.2,
  estimatedMinutes = 18,
  lastUpdate = new Date(),
  routePoints = DEFAULT_ROUTE,
  initialProgress = 0.25,
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
    mapStatusLabel = "Đang vận chuyển",
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
    const pathPoints = [
      { x: 38, y: 14 },
      { x: 44, y: 24 },
      { x: 50, y: 36 },
      { x: 50, y: 46 },
      { x: 48, y: 56 },
      { x: 56, y: 66 },
      { x: 54, y: 76 },
      { x: 48, y: 86 },
    ];

    const segments = 64;
    return Array.from({ length: segments + 1 }, (_, index) => {
      const ratio = index / segments;
      const scaled = ratio * (pathPoints.length - 1);
      const lowerIndex = Math.floor(scaled);
      const upperIndex = Math.min(pathPoints.length - 1, lowerIndex + 1);
      const localT = scaled - lowerIndex;
      const start = pathPoints[lowerIndex];
      const end = pathPoints[upperIndex];
      const x = start.x + (end.x - start.x) * localT;
      const y = start.y + (end.y - start.y) * localT;
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
            <linearGradient id="trackingWaterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(12, 90, 160, 0.22)" />
              <stop offset="100%" stopColor="rgba(12, 120, 180, 0.12)" />
            </linearGradient>
            <linearGradient id="trackingLandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.92)" />
              <stop offset="100%" stopColor="rgba(255, 196, 31, 0.32)" />
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
          <rect x="0" y="0" width="100" height="100" fill="url(#trackingWaterGradient)" />
          <path d={MAP_OUTLINE_PATH} fill="url(#trackingLandGradient)" className="tracking-map__land" />
          {pathD && (
            <path
              d={pathD}
              fill="none"
              stroke="url(#trackingPathGradient)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="tracking-map__route"
            />
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
          <span className="tracking-map__origin-icon" aria-hidden="true" />
          <span>{origin}</span>
        </div>
        <div
          className="tracking-map__landmark tracking-map__landmark--destination"
          style={{ left: `${END_POINT.x}%`, top: `${END_POINT.y}%` }}
        >
          <span className="tracking-map__destination-icon" aria-hidden="true">📍</span>
          <span>{destination}</span>
        </div>
        {MAP_CITIES.map((city) => (
          <div
            key={city.id}
            className={`tracking-map__city tracking-map__city--${city.position}`}
            style={{ left: `${city.x}%`, top: `${city.y}%` }}
          >
            <span className="tracking-map__city-dot" aria-hidden="true" />
            <span>{city.label}</span>
          </div>
        ))}
        <div
          className="tracking-map__drone"
          style={{ left: `${dronePosition.x}%`, top: `${dronePosition.y}%` }}
          aria-hidden="true"
        >
          <span role="img" aria-label="Drone giao hàng">
            🚁
          </span>
        </div>
        <div className="tracking-map__pulse" style={{ left: `${dronePosition.x}%`, top: `${dronePosition.y}%` }} aria-hidden="true" />
        <div
          className="tracking-map__status"
          style={{ left: `${dronePosition.x}%`, top: `${dronePosition.y - 8}%` }}
        >
          {mapStatusLabel}
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