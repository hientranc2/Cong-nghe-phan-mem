import { useEffect, useMemo, useRef, useState } from "react";
import "./SimpleMap.css";

const TILE_BASE_URL = "https://tile.openstreetmap.org";

const tile2lon = (x, z) => (x / 2 ** z) * 360 - 180;
const tile2lat = (y, z) => {
  const n = Math.PI - (2 * Math.PI * y) / 2 ** z;
  return (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
};

const wrapTile = (value, z) => {
  const max = 2 ** z;
  return ((value % max) + max) % max;
};

const clampTileY = (value, z) => {
  const max = 2 ** z - 1;
  return Math.min(Math.max(value, 0), max);
};

const toTilePoint = (lat, lng, z) => {
  const latRad = (lat * Math.PI) / 180;
  const n = 2 ** z;
  return {
    x: ((lng + 180) / 360) * n,
    y: ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n,
  };
};

function SimpleMap({
  center,
  markers = [],
  path = [],
  zoom = 15,
  height = 320,
  loading = false,
  className = "",
}) {
  const mapRef = useRef(null);
  const [viewCenter, setViewCenter] = useState(center ?? { lat: 10.776389, lng: 106.701111 });
  const [dragState, setDragState] = useState({ isDragging: false, lastPoint: null });

  useEffect(() => {
    if (
      center &&
      typeof center.lat === "number" &&
      typeof center.lng === "number" &&
      !Number.isNaN(center.lat) &&
      !Number.isNaN(center.lng)
    ) {
      setViewCenter(center);
    }
  }, [center]);

  const projectedCenter = useMemo(
    () => toTilePoint(viewCenter.lat, viewCenter.lng, zoom),
    [viewCenter, zoom],
  );
  const gridSize = 3;
  const startX = Math.floor(projectedCenter.x) - 1;
  const startY = Math.floor(projectedCenter.y) - 1;
  const endX = startX + gridSize;
  const endY = startY + gridSize;

  const bounds = useMemo(
    () => ({
      west: tile2lon(startX, zoom),
      east: tile2lon(endX, zoom),
      north: tile2lat(startY, zoom),
      south: tile2lat(endY, zoom),
    }),
    [startX, startY, endX, endY, zoom],
  );

  const projectToPercent = (point) => {
    if (!point) return null;
    const left = ((point.lng - bounds.west) / (bounds.east - bounds.west)) * 100;
    const top = ((bounds.north - point.lat) / (bounds.north - bounds.south)) * 100;
    return { left, top };
  };

  const tileImages = useMemo(() => {
    const images = [];
    for (let y = startY; y < endY; y += 1) {
      for (let x = startX; x < endX; x += 1) {
        const wrappedX = wrapTile(x, zoom);
        const clampedY = clampTileY(y, zoom);
        images.push({
          key: `${wrappedX}-${clampedY}`,
          url: `${TILE_BASE_URL}/${zoom}/${wrappedX}/${clampedY}.png`,
        });
      }
    }
    return images;
  }, [startX, startY, endX, endY, zoom]);

  const overlayPath = path
    .map((point) => projectToPercent(point))
    .filter(Boolean)
    .map((point) => `${point.left},${point.top}`)
    .join(" ");

  const markerElements = markers
    .map((marker) => ({ ...marker, position: projectToPercent(marker) }))
    .filter((marker) => marker.position);

  const handlePointerDown = (event) => {
    setDragState({ isDragging: true, lastPoint: { x: event.clientX, y: event.clientY } });
    mapRef.current?.setPointerCapture?.(event.pointerId);
  };

  const handlePointerMove = (event) => {
    if (!dragState.isDragging || !dragState.lastPoint || !mapRef.current) return;

    const rect = mapRef.current.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const deltaX = event.clientX - dragState.lastPoint.x;
    const deltaY = event.clientY - dragState.lastPoint.y;
    const lngSpan = bounds.east - bounds.west;
    const latSpan = bounds.north - bounds.south;

    setViewCenter((prev) => {
      const nextLat = Math.max(Math.min(prev.lat + (deltaY / rect.height) * latSpan, 85), -85);
      const wrappedLng = ((prev.lng - (deltaX / rect.width) * lngSpan + 180 + 360) % 360) - 180;
      return { lat: nextLat, lng: wrappedLng };
    });

    setDragState({ isDragging: true, lastPoint: { x: event.clientX, y: event.clientY } });
  };

  const handlePointerUp = (event) => {
    if (dragState.isDragging) {
      mapRef.current?.releasePointerCapture?.(event.pointerId);
    }
    setDragState({ isDragging: false, lastPoint: null });
  };

  return (
    <div
      ref={mapRef}
      className={`simple-map ${className} ${dragState.isDragging ? "simple-map--dragging" : ""}`.trim()}
      style={{ minHeight: height }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <div className="simple-map__tiles" aria-hidden="true">
        {tileImages.map((tile) => (
          <img key={tile.key} src={tile.url} alt="" className="simple-map__tile" loading="lazy" />
        ))}
      </div>

      <svg className="simple-map__overlay" viewBox="0 0 100 100" preserveAspectRatio="none">
        {overlayPath && (
          <polyline
            points={overlayPath}
            fill="none"
            stroke="url(#simpleMapGradient)"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        )}
        <defs>
          <linearGradient id="simpleMapGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(31, 138, 112, 0.9)" />
            <stop offset="100%" stopColor="rgba(255, 90, 31, 0.95)" />
          </linearGradient>
        </defs>
      </svg>

      {markerElements.map((marker) => (
        <div
          key={marker.id ?? marker.label}
          className={`simple-map__marker simple-map__marker--${marker.type ?? "default"}`}
          style={{ left: `${marker.position.left}%`, top: `${marker.position.top}%` }}
        >
          <div className="simple-map__marker-dot" aria-hidden="true" />
          <div className="simple-map__marker-label">
            <strong>{marker.label}</strong>
            {marker.subLabel && <span>{marker.subLabel}</span>}
          </div>
        </div>
      ))}

      {loading && (
        <div className="simple-map__loading" aria-live="polite">
          <div className="simple-map__spinner" />
          <span>Đang tải bản đồ...</span>
        </div>
      )}
    </div>
  );
}

export default SimpleMap;
