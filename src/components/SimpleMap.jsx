import { useEffect, useMemo, useRef, useState } from "react";
import "./SimpleMap.css";

const TILE_BASE_URL = "https://tile.openstreetmap.org";
const GRID_SIZE = 3;
const DEFAULT_CENTER = { lat: 10.776389, lng: 106.701111 };
const MIN_ZOOM = 3;
const MAX_ZOOM = 18;

const FALLBACK_TILE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256'%3E%3Crect width='256' height='256' fill='%23f4f4f6'/%3E%3Cpath d='M0 128h256M128 0v256' stroke='%23d4d4da' stroke-width='6'/%3E%3C/svg%3E";

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

const clampZoom = (value) => Math.min(Math.max(value, MIN_ZOOM), MAX_ZOOM);

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
  minHeight = 320,
  loading = false,
  className = "",
}) {
  const mapRef = useRef(null);
  const safeCenter = center ?? DEFAULT_CENTER;
  const [viewCenter, setViewCenter] = useState(safeCenter);
  const [zoomLevel, setZoomLevel] = useState(() => clampZoom(zoom));
  const [dragState, setDragState] = useState({ active: false });

  useEffect(() => {
    setViewCenter(safeCenter);
  }, [safeCenter.lat, safeCenter.lng]);

  useEffect(() => {
    setZoomLevel(clampZoom(zoom));
  }, [zoom]);

  const projectedCenter = useMemo(
    () => toTilePoint(viewCenter.lat, viewCenter.lng, zoomLevel),
    [viewCenter, zoomLevel],
  );
  const startX = Math.floor(projectedCenter.x) - 1;
  const startY = Math.floor(projectedCenter.y) - 1;
  const endX = startX + GRID_SIZE;
  const endY = startY + GRID_SIZE;

  const tileOffset = useMemo(() => {
    const centerOffsetX = projectedCenter.x - (startX + GRID_SIZE / 2);
    const centerOffsetY = projectedCenter.y - (startY + GRID_SIZE / 2);
    return { x: centerOffsetX, y: centerOffsetY };
  }, [projectedCenter.x, projectedCenter.y, startX, startY]);

  const bounds = useMemo(
    () => ({
      west: tile2lon(startX + tileOffset.x, zoomLevel),
      east: tile2lon(endX + tileOffset.x, zoomLevel),
      north: tile2lat(startY + tileOffset.y, zoomLevel),
      south: tile2lat(endY + tileOffset.y, zoomLevel),
    }),
    [endX, endY, startX, startY, tileOffset.x, tileOffset.y, zoomLevel],
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
        const wrappedX = wrapTile(x, zoomLevel);
        const clampedY = clampTileY(y, zoomLevel);
        images.push({
          key: `${wrappedX}-${clampedY}`,
          url: `${TILE_BASE_URL}/${zoomLevel}/${wrappedX}/${clampedY}.png`,
        });
      }
    }
    return images;
  }, [startX, startY, endX, endY, zoomLevel]);

  const overlayPath = path
    .map((point) => projectToPercent(point))
    .filter(Boolean)
    .map((point) => `${point.left},${point.top}`)
    .join(" ");

  const markerElements = markers
    .map((marker) => ({ ...marker, position: projectToPercent(marker) }))
    .filter((marker) => marker.position);

  const handlePointerDown = (event) => {
    if (!mapRef.current) return;

    mapRef.current.setPointerCapture?.(event.pointerId);
    setDragState({
      active: true,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startProjected: projectedCenter,
    });
  };

  const handlePointerMove = (event) => {
    if (!dragState.active || event.pointerId !== dragState.pointerId || !mapRef.current) return;

    const bounds = mapRef.current.getBoundingClientRect();
    const tileWidth = bounds.width / GRID_SIZE;
    const tileHeight = bounds.height / GRID_SIZE;

    const deltaTilesX = (event.clientX - dragState.startX) / tileWidth;
    const deltaTilesY = (event.clientY - dragState.startY) / tileHeight;

    const nextX = dragState.startProjected.x - deltaTilesX;
    const nextY = clampTileY(dragState.startProjected.y - deltaTilesY, zoomLevel);

    setViewCenter({
      lat: tile2lat(nextY, zoomLevel),
      lng: tile2lon(wrapTile(Math.round(nextX * 1000) / 1000, zoomLevel), zoomLevel),
    });
  };

  const handlePointerEnd = (event) => {
    if (dragState.pointerId && mapRef.current?.hasPointerCapture?.(dragState.pointerId)) {
      mapRef.current.releasePointerCapture(dragState.pointerId);
    }
    if (dragState.active && (!event.pointerId || event.pointerId === dragState.pointerId)) {
      setDragState({ active: false });
    }
  };

  const handleZoomChange = (delta) => {
    setZoomLevel((current) => clampZoom(current + delta));
  };

  return (
    <div
      ref={mapRef}
      className={`simple-map ${dragState.active ? "simple-map--dragging" : ""} ${className}`.trim()}
      style={{ height, minHeight }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      role="presentation"
    >
      <div
        className="simple-map__tiles"
        aria-hidden="true"
        style={{
          transform: `translate(${(-tileOffset.x * (100 / GRID_SIZE)).toFixed(4)}%, ${(-tileOffset.y * (100 / GRID_SIZE)).toFixed(4)}%)`,
        }}
      >
        {tileImages.map((tile) => (
          <img
            key={tile.key}
            src={tile.url}
            alt=""
            className="simple-map__tile"
            loading="lazy"
            onError={(event) => {
              event.currentTarget.src = FALLBACK_TILE;
            }}
          />
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

      <div
        className="simple-map__controls"
        aria-label="Điều khiển thu phóng bản đồ"
        onPointerDown={(event) => event.stopPropagation()}
        onPointerMove={(event) => event.stopPropagation()}
      >
        <button type="button" onClick={() => handleZoomChange(1)} aria-label="Phóng to">
          +
        </button>
        <button type="button" onClick={() => handleZoomChange(-1)} aria-label="Thu nhỏ">
          −
        </button>
        <span className="simple-map__zoom-label">{`x${zoomLevel}`}</span>
      </div>
    </div>
  );
}

export default SimpleMap;
