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
    let timedOut = false;
    let settled = false;

    const cached = locationCache.get(normalizedQuery);
    if (cached) {
      lastCoordsRef.current = cached;
      setState({ coords: cached, status: "success", error: "" });
      return undefined;
    }

    const finishWithSuccess = (coords) => {
      if (settled || cancelled) return;
      settled = true;
      locationCache.set(normalizedQuery, coords);
      lastCoordsRef.current = coords;
      setState({ coords, status: "success", error: "" });
    };

    const finishWithError = (message) => {
      if (settled || cancelled) return;
      settled = true;
      setState({
        coords: lastCoordsRef.current ?? normalizedFallback,
        status: "error",
        error: message,
      });
    };

    const debounce = setTimeout(() => {
      setState((prev) => ({ ...prev, status: "loading", error: "" }));

      const timeoutId = setTimeout(() => {
        timedOut = true;
        controller.abort();
        finishWithError("Định vị quá thời gian. Đang dùng vị trí gần nhất để hiển thị bản đồ.");
      }, 6500);

      const fetchLocation = async () => {
        try {
          const response = await fetch(buildQueryUrl(normalizedQuery), {
            headers: {
              "Accept-Language": "vi",
            },
            signal: controller.signal,
          });

          if (cancelled) return;

          if (!response.ok) {
            throw new Error("Geocoding request failed");
          }

          const results = await response.json();
          if (cancelled) return;

          const [first] = results ?? [];
          const coords = normalizeCoords(first)
            ? { lat: Number(first.lat), lng: Number(first.lon ?? first.lng) }
            : null;

          if (coords) {
            finishWithSuccess(coords);
          } else {
            finishWithError("Không tìm thấy vị trí cho địa chỉ đã nhập.");
          }
        } catch (error) {
          if (cancelled) return;
          if (error.name === "AbortError" && !timedOut) return;

          finishWithError(
            timedOut
              ? "Định vị quá thời gian. Đang dùng vị trí gần nhất để hiển thị bản đồ."
              : "Không thể tải bản đồ. Vui lòng kiểm tra kết nối mạng.",
          );
        } finally {
          clearTimeout(timeoutId);
        }
      };

      fetchLocation();
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
