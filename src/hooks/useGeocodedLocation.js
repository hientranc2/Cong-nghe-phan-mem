import { useEffect, useMemo, useRef, useState } from "react";

const locationCache = new Map();

const normalizeCoords = (value) => {
  if (!value) return null;
  const lat = Number.parseFloat(value.lat);
  const lng = Number.parseFloat(value.lng ?? value.lon);
  if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
  return { lat, lng };
};

const appendCountry = (query) => {
  const lower = query.toLowerCase();
  if (lower.includes("viet nam") || lower.includes("vietnam")) {
    return query;
  }
  return `${query}, Viet Nam`;
};

const buildQueryUrl = (query) => {
  const scopedQuery = appendCountry(query);
  return `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=vn&q=${encodeURIComponent(scopedQuery)}`;
};

const TIMEOUT_MESSAGE = "Định vị quá thời gian. Đang dùng vị trí gần nhất.";
const NETWORK_MESSAGE = "Không thể tải bản đồ. Kiểm tra kết nối mạng.";
const NOT_FOUND_MESSAGE = "Không tìm thấy vị trí cho địa chỉ đã nhập.";

function useGeocodedLocation(query, fallback = null) {
  const normalizedQuery = (query ?? "").trim();
  const normalizedFallback = useMemo(
    () => normalizeCoords(fallback),
    [fallback?.lat, fallback?.lng ?? fallback?.lon],
  );
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
        finishWithError(TIMEOUT_MESSAGE);
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
          const coords = normalizeCoords(first);

          if (coords) {
            finishWithSuccess(coords);
          } else {
            finishWithError(NOT_FOUND_MESSAGE);
          }
        } catch (error) {
          if (cancelled) return;
          if (error.name === "AbortError" && !timedOut) return;

          finishWithError(timedOut ? TIMEOUT_MESSAGE : NETWORK_MESSAGE);
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
  }, [normalizedQuery, normalizedFallback?.lat, normalizedFallback?.lng]);

  return {
    ...state,
    hasResult: Boolean(state.coords),
  };
}

export default useGeocodedLocation;
