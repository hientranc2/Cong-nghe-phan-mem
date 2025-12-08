import { useEffect, useRef, useState } from "react";

const locationCache = new Map();

const normalizeCoords = (value) => {
  if (!value || Number.isNaN(value.lat) || Number.isNaN(value.lng)) {
    return null;
  }
  return {
    lat: Number.parseFloat(value.lat),
    lng: Number.parseFloat(value.lng),
  };
};

const buildQueryUrl = (query) =>
  `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`;

function useGeocodedLocation(query, fallback = null) {
  const normalizedQuery = (query ?? "").trim();
  const normalizedFallback = normalizeCoords(fallback);
  const [state, setState] = useState(() => ({
    coords: normalizedFallback,
    status: "idle",
    error: "",
  }));
  const lastCoordsRef = useRef(normalizedFallback);

  useEffect(() => {
    if (!normalizedQuery) {
      setState((prev) => ({
        ...prev,
        coords: normalizedFallback,
        status: "idle",
        error: "",
      }));
      lastCoordsRef.current = normalizedFallback;
      return undefined;
    }

    let cancelled = false;
    const controller = new AbortController();

    const cached = locationCache.get(normalizedQuery);
    if (cached) {
      lastCoordsRef.current = cached;
      setState({ coords: cached, status: "success", error: "" });
      return undefined;
    }

    const debounce = setTimeout(() => {
      setState((prev) => ({ ...prev, status: "loading", error: "" }));

      fetch(buildQueryUrl(normalizedQuery), {
        headers: {
          "Accept-Language": "vi",
          "User-Agent": "FCO-Delivery-Demo/1.0",
        },
        signal: controller.signal,
      })
        .then((response) => response.json())
        .then((results) => {
          if (cancelled) return;
          const [first] = results ?? [];
          const coords = normalizeCoords(first)
            ? { lat: Number(first.lat), lng: Number(first.lon ?? first.lng) }
            : null;

          if (coords) {
            locationCache.set(normalizedQuery, coords);
            lastCoordsRef.current = coords;
            setState({ coords, status: "success", error: "" });
          } else {
            setState({
              coords: lastCoordsRef.current ?? normalizedFallback,
              status: "error",
              error: "Không tìm thấy vị trí cho địa chỉ đã nhập.",
            });
          }
        })
        .catch((error) => {
          if (cancelled || error.name === "AbortError") return;
          setState({
            coords: lastCoordsRef.current ?? normalizedFallback,
            status: "error",
            error: "Không thể tải bản đồ. Vui lòng kiểm tra kết nối mạng.",
          });
        });
    }, 480);

    return () => {
      cancelled = true;
      clearTimeout(debounce);
      controller.abort();
    };
  }, [normalizedFallback, normalizedQuery]);

  return {
    ...state,
    hasResult: Boolean(state.coords),
  };
}

export default useGeocodedLocation;
