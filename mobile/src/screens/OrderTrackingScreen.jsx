import React, { useEffect, useMemo, useRef, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const formatTime = (value) => {
  if (!value) return "--";
  try {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "--";
    return new Intl.DateTimeFormat("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    return "--";
  }
};

const calculateProgress = (order) => {
  const progressFromOrder =
    typeof order?.progress === "number"
      ? order.progress
      : typeof order?.deliveryProgress === "number"
      ? order.deliveryProgress
      : null;

  if (typeof progressFromOrder === "number") {
    return clamp(progressFromOrder, 0.05, 0.98);
  }

  const created = order?.createdAt ? new Date(order.createdAt) : null;
  const eta = order?.estimatedDelivery ? new Date(order.estimatedDelivery) : null;
  if (created && eta && !Number.isNaN(created) && !Number.isNaN(eta)) {
    const now = Date.now();
    const total = eta.getTime() - created.getTime();
    const done = now - created.getTime();
    if (total > 0) {
      return clamp(done / total, 0.05, 0.98);
    }
  }

  return 0.3;
};

const DEFAULT_ORIGIN_COORD = { latitude: 10.776492, longitude: 106.700414 };
const DEFAULT_DESTINATION_COORD = { latitude: 10.780733, longitude: 106.700921 };
const NOMINATIM_BASE =
  "https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=vn&q=";
const geocodeCache = new Map();
const MAX_GEOCODE_DEVIATION_KM = 200; // tránh geocode lạc quá xa fallback

const normalizeCoords = (value, fallback = null) => {
  const lat = Number(value?.latitude ?? value?.lat);
  const lng = Number(value?.longitude ?? value?.lng ?? value?.lon);
  if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
    return { latitude: lat, longitude: lng };
  }
  return fallback;
};

const haversineDistanceKm = (from, to) => {
  if (!from || !to) return 0;
  const R = 6371;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(to.latitude - from.latitude);
  const dLng = toRad(to.longitude - from.longitude);
  const lat1 = toRad(from.latitude);
  const lat2 = toRad(to.latitude);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(Math.max(0, 1 - a)));
  return R * c;
};

const appendCountry = (query = "") => {
  const normalized = query.toLowerCase();
  if (normalized.includes("viet nam") || normalized.includes("vietnam")) {
    return query;
  }
  return `${query}, Viet Nam`;
};

const geocodeAddress = async (query, signal) => {
  const scopedQuery = appendCountry(query);

  if (geocodeCache.has(scopedQuery)) {
    return geocodeCache.get(scopedQuery);
  }

  const response = await fetch(`${NOMINATIM_BASE}${encodeURIComponent(scopedQuery)}`, {
    headers: {
      "Accept-Language": "vi",
      "User-Agent": "fco-mobile-tracking/1.0",
    },
    signal,
  });

  if (!response.ok) {
    throw new Error("Geocoding request failed");
  }

  const results = await response.json();
  const [first] = results ?? [];
  const coords = normalizeCoords(
    {
      latitude: first?.lat,
      longitude: first?.lon,
    },
    null
  );

  if (coords) {
    geocodeCache.set(scopedQuery, coords);
  }

  return coords;
};

const useGeocodedLocation = (query, fallbackCoords = null) => {
  const normalizedQuery = (query ?? "").trim();
  const normalizedFallback = useMemo(
    () => normalizeCoords(fallbackCoords),
    [fallbackCoords?.latitude, fallbackCoords?.longitude, fallbackCoords?.lat, fallbackCoords?.lng, fallbackCoords?.lon]
  );
  const [state, setState] = useState(() => ({
    coords: normalizedFallback,
    status: normalizedFallback ? "success" : "idle",
    error: "",
  }));

  useEffect(() => {
    if (!normalizedQuery) {
      setState({
        coords: normalizedFallback,
        status: normalizedFallback ? "success" : "idle",
        error: "",
      });
      return undefined;
    }

    let cancelled = false;
    const controller = new AbortController();
    const debounce = setTimeout(async () => {
      setState((prev) => ({ ...prev, status: "loading", error: "" }));
      const timeoutId = setTimeout(() => controller.abort(), 6500);

      try {
        const coords = await geocodeAddress(normalizedQuery, controller.signal);
        if (!cancelled && coords) {
          const tooFar =
            normalizedFallback &&
            haversineDistanceKm(normalizedFallback, coords) > MAX_GEOCODE_DEVIATION_KM;
          if (tooFar) {
            setState({
              coords: normalizedFallback,
              status: "error",
              error: "Định vị nhà hàng quá xa. Đang dùng vị trí mặc định gần bạn.",
            });
            return;
          }
          setState({ coords, status: "success", error: "" });
        } else if (!cancelled) {
          setState({
            coords: normalizedFallback,
            status: "error",
            error: "Khong tim thay vi tri theo dia chi.",
          });
        }
      } catch (error) {
        if (cancelled) return;
        const isAbort = error?.name === "AbortError";
        setState({
          coords: normalizedFallback,
          status: isAbort ? "idle" : "error",
          error: isAbort
            ? ""
            : "Khong the ket noi ban do. Dang dung vi tri gan nhat.",
        });
      } finally {
        clearTimeout(timeoutId);
      }
    }, 420);

    return () => {
      cancelled = true;
      clearTimeout(debounce);
      controller.abort();
    };
  }, [normalizedQuery, fallbackCoords?.latitude, fallbackCoords?.longitude]);

  return state;
};

const OrderTrackingScreen = ({ order, onBack, onGoHome, onComplete }) => {
  const derivedProgress = useMemo(() => calculateProgress(order), [order]);
  const [progressValue, setProgressValue] = useState(() =>
    clamp(derivedProgress, 0.01, 0.98)
  );
  const milestonesRef = useRef({
    oneThird: false,
    twoThird: false,
    arrival: false,
  });
  const completionRef = useRef(false);

  const restaurantName =
    order?.restaurantName ?? order?.restaurant?.name ?? "Nha hang";
  const restaurantAddress =
    order?.restaurantAddress ??
    order?.restaurant?.address ??
    order?.restaurantCity ??
    order?.city ??
    "";
  const originLabel = restaurantAddress
    ? `${restaurantName} - ${restaurantAddress}`
    : restaurantName;
  const originQuery = restaurantAddress
    ? `${restaurantName}, ${restaurantAddress}`
    : restaurantName;
  const destinationAddress =
    order?.customer?.address ?? order?.address ?? "Dia chi khach hang";

  const estimatedMinutes = useMemo(() => {
    const created = order?.createdAt ? new Date(order.createdAt) : null;
    const eta = order?.estimatedDelivery ? new Date(order.estimatedDelivery) : null;
    if (created && eta && !Number.isNaN(created) && !Number.isNaN(eta)) {
      const diffMinutes = (eta.getTime() - created.getTime()) / (60 * 1000);
      if (diffMinutes > 0) {
        return diffMinutes;
      }
    }
    return Number(order?.estimatedMinutes) || 22;
  }, [order?.createdAt, order?.estimatedDelivery, order?.estimatedMinutes]);

  useEffect(() => {
    setProgressValue(clamp(derivedProgress, 0.01, 0.98));
  }, [derivedProgress, order?.id]);

  useEffect(() => {
    milestonesRef.current = { oneThird: false, twoThird: false, arrival: false };
    completionRef.current = false;
  }, [order?.id]);

  useEffect(() => {
    const durationMs = Math.max(estimatedMinutes, 8) * 4000;
    const interval = 1200;
    const increment = interval / durationMs;

    const id = setInterval(() => {
      setProgressValue((prev) => {
        if (prev >= 0.995) {
          clearInterval(id);
          return prev;
        }
        return clamp(prev + increment, 0, 1);
      });
    }, interval);

    return () => clearInterval(id);
  }, [estimatedMinutes, order?.id]);

  const trackingSteps = useMemo(() => {
    if (!order) return [];

    const createdAt = formatTime(order.createdAt);
    const etaTime = formatTime(order.estimatedDelivery);
    const deliveryAddress = order.address ?? "--";
    const distanceHint = order.distance ?? order.distanceKm ?? "4.6 km";

    return [
      {
        id: "received",
        title: "Don hang da duoc ghi nhan",
        description:
          "Nha hang vua nhan thong tin va dang chuan bi mon.",
        meta: createdAt !== "--" ? `Luc ${createdAt}` : undefined,
      },
      {
        id: "preparing",
        title: "Nha hang dang hoan tat mon",
        description: "Bep dang trong goi san sang ban giao cho drone giao hang.",
        meta: "Du kien 8 phut",
      },
      {
        id: "pickup",
        title: "Drone tiep nhan don",
        description: "Drone da den diem nhan hang va dang chuan bi cat canh.",
        meta: "Dang dien ra",
      },
      {
        id: "enroute",
        title: "Drone dang bay den ban",
        description: `Quang duong con lai khoang ${distanceHint}. Drone dang di chuyen toi diem giao.`,
        meta: etaTime !== "--" ? `Du kien giao luc ${etaTime}` : undefined,
      },
      {
        id: "landing",
        title: "Chuan bi ha canh",
        description: `Dia chi giao: ${deliveryAddress}. Vui long chuan bi nhan mon ngon nhe!`,
        meta: "Xin cho trong giay lat",
      },
    ];
  }, [order]);

  const fallbackOriginCoord = useMemo(
    () =>
      normalizeCoords(
        {
          latitude: Number(order?.originLat),
          longitude: Number(order?.originLng),
        },
        DEFAULT_ORIGIN_COORD
      ),
    [order?.originLat, order?.originLng]
  );

  const fallbackDestinationCoord = useMemo(
    () =>
      normalizeCoords(
        {
          latitude: Number(order?.destLat ?? order?.latitude),
          longitude: Number(order?.destLng ?? order?.longitude),
        },
        DEFAULT_DESTINATION_COORD
      ),
    [order?.destLat, order?.destLng, order?.latitude, order?.longitude]
  );

  const originLocation = useGeocodedLocation(originQuery, fallbackOriginCoord);
  const destinationLocation = useGeocodedLocation(
    destinationAddress,
    fallbackDestinationCoord
  );
  const isGeocoding =
    originLocation.status === "loading" || destinationLocation.status === "loading";
  const locationError = originLocation.error || destinationLocation.error;

  const originCoord = originLocation.coords ?? fallbackOriginCoord;
  const destinationCoord = destinationLocation.coords ?? fallbackDestinationCoord;

  const mapRegion = useMemo(() => {
    const coords = [originCoord, destinationCoord].filter(Boolean);
    if (!coords.length) {
      return {
        ...DEFAULT_ORIGIN_COORD,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      };
    }

    const lats = coords.map((c) => c.latitude);
    const lngs = coords.map((c) => c.longitude);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    const deltaLat = Math.max(maxLat - minLat, 0.01);
    const deltaLng = Math.max(maxLng - minLng, 0.01);

    return {
      latitude: (minLat + maxLat) / 2,
      longitude: (minLng + maxLng) / 2,
      latitudeDelta: deltaLat * 1.8,
      longitudeDelta: deltaLng * 1.8,
    };
  }, [destinationCoord, originCoord]);

  const droneCoord = useMemo(() => {
    const start = originCoord ?? DEFAULT_ORIGIN_COORD;
    const end = destinationCoord ?? DEFAULT_DESTINATION_COORD;
    const t = clamp(progressValue, 0, 1);
    return {
      latitude: start.latitude + (end.latitude - start.latitude) * t,
      longitude: start.longitude + (end.longitude - start.longitude) * t,
    };
  }, [destinationCoord, originCoord, progressValue]);

  const [trackPoints, setTrackPoints] = useState(() =>
    originCoord ? [originCoord] : []
  );

  useEffect(() => {
    setTrackPoints(originCoord ? [originCoord] : []);
  }, [order?.id, originCoord]);

  useEffect(() => {
    if (!droneCoord?.latitude || !droneCoord?.longitude) return;
    setTrackPoints((prev) => {
      if (!prev.length) return [droneCoord];
      const last = prev[prev.length - 1];
      const delta = haversineDistanceKm(last, droneCoord);
      if (delta < 0.005) return prev;
      const trimmed = prev.length > 400 ? prev.slice(-250) : prev;
      return [...trimmed, droneCoord];
    });
  }, [droneCoord]);

  const pathCoords = useMemo(() => {
    if (trackPoints.length > 1) {
      return trackPoints;
    }
    if (originCoord && destinationCoord) {
      return [originCoord, destinationCoord];
    }
    return [];
  }, [destinationCoord, originCoord, trackPoints]);

  const routeDistanceKm = useMemo(() => {
    const calculated = haversineDistanceKm(originCoord, destinationCoord);
    if (calculated > 0) {
      return calculated;
    }
    const fallbackDistance = Number(order?.distanceKm ?? order?.distance);
    return Number.isFinite(fallbackDistance) && fallbackDistance > 0
      ? fallbackDistance
      : 4.6;
  }, [destinationCoord, originCoord, order?.distance, order?.distanceKm]);

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

  const displayProgress = useMemo(
    () => clamp(Math.max(distanceProgress, progressValue), 0.01, 1),
    [distanceProgress, progressValue]
  );

  const activeStepIndex = useMemo(
    () =>
      Math.min(
        trackingSteps.length - 1,
        Math.floor(displayProgress * trackingSteps.length)
      ),
    [displayProgress, trackingSteps.length]
  );

  const distanceLabel = useMemo(
    () => `${routeDistanceKm.toFixed(2)} km`,
    [routeDistanceKm]
  );

  const baseSpeedKmPerMin =
    routeDistanceKm > 0 && estimatedMinutes > 0
      ? routeDistanceKm / estimatedMinutes
      : null;

  const dynamicEtaMinutes = useMemo(() => {
    if (!baseSpeedKmPerMin) return estimatedMinutes;
    const remaining = Math.max(routeDistanceKm - traveledDistanceKm, 0);
    return Math.max(1, remaining / baseSpeedKmPerMin);
  }, [baseSpeedKmPerMin, estimatedMinutes, routeDistanceKm, traveledDistanceKm]);

  const etaLabel = useMemo(() => {
    if (dynamicEtaMinutes) {
      return `~${Math.round(dynamicEtaMinutes)} phut`;
    }
    return formatTime(order?.estimatedDelivery);
  }, [dynamicEtaMinutes, order?.estimatedDelivery]);

  useEffect(() => {
    const ratio = distanceProgress;
    const milestones = milestonesRef.current;

    if (ratio >= 1 / 3 && !milestones.oneThird) {
      milestones.oneThird = true;
      Alert.alert("Drone đã bay 1/3 quãng đường", "Đang tiếp tục bay tới bạn.");
    }

    if (ratio >= 2 / 3 && !milestones.twoThird) {
      milestones.twoThird = true;
      Alert.alert("Drone đã bay 2/3 quãng đường", "Sắp tới điểm giao, bạn chuẩn bị nhé.");
    }

    if (ratio >= 0.995 && !milestones.arrival) {
      milestones.arrival = true;
      Alert.alert("Drone ?? t?i", "Vui l?ng nh?n h?ng ngay khi drone h? c?nh.");
      if (!completionRef.current && typeof onComplete === "function") {
        completionRef.current = true;
        try {
          onComplete(order);
        } catch (error) {
          console.warn("onComplete tracking callback failed", error);
        }
      }
    }
  }, [distanceProgress]);

  const handleGoHome = () => {
    if (typeof onGoHome === "function") {
      onGoHome();
      return;
    }

    if (typeof onBack === "function") {
      onBack();
    }
  };

  if (!order) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>Khong co du lieu don hang</Text>
          <Text style={styles.emptySubtitle}>
            Vui long quay lai trang chu de tiep tuc dat mon va theo doi don hang cua ban.
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            activeOpacity={0.85}
            onPress={handleGoHome}
          >
            <Text style={styles.emptyButtonLabel}>Quay ve trang chu</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.85}>
          <Text style={styles.backLabel}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Theo doi drone giao hang</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mapCard}>
          <Text style={styles.mapTitle}>Hanh trinh truc tiep</Text>
          <View style={styles.mapWrapper}>
            <MapView
              style={styles.mapPreview}
              region={mapRegion}
              scrollEnabled
              rotateEnabled={false}
              pitchEnabled={false}
              loadingEnabled
            >
              {pathCoords.length > 1 ? (
                <Polyline coordinates={pathCoords} strokeColor="#f97316" strokeWidth={4} />
              ) : null}
              <Marker
                coordinate={originCoord}
                title="Diem xuat phat"
                description={originLabel}
                pinColor="#16a34a"
              />
              <Marker
                coordinate={destinationCoord}
                title="Diem giao"
                description={order.address ?? destinationAddress}
              />
              <Marker coordinate={droneCoord} title="Drone dang bay">
                <View style={styles.mapDrone}>
                  <Text style={styles.mapDroneEmoji}>🚁</Text>
                </View>
              </Marker>
            </MapView>
            <View style={styles.mapCallout}>
              <Text style={styles.calloutTitle}>Drone dang bay</Text>
              <Text style={styles.calloutMeta}>
                {isGeocoding
                  ? "Dang dinh vi theo dia chi"
                  : `${Math.round(displayProgress * 100)}% lo trinh`}
              </Text>
            </View>
            <View style={[styles.mapCallout, styles.calloutOrigin]}>
              <Text style={styles.calloutTitle}>Diem xuat phat</Text>
              <Text style={styles.calloutMeta} numberOfLines={1}>
                {originLabel}
              </Text>
            </View>
            <View style={[styles.mapCallout, styles.calloutDestination]}>
              <Text style={styles.calloutTitle}>Diem giao</Text>
              <Text style={styles.calloutMeta} numberOfLines={1}>
                {order.address ?? destinationAddress}
              </Text>
            </View>
          </View>
          <Text style={styles.mapStatus} numberOfLines={2}>
            {locationError
              ? locationError
              : isGeocoding
              ? "Dang dinh vi lo trinh giong web va cap nhat vi tri thuc te."
              : "Map da ghep dia chi giong phien ban web."}
          </Text>
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Drone dang giao</Text>
              <Text style={styles.progressEta}>
                Giao luc <Text style={styles.progressEtaValue}>{etaLabel}</Text>
              </Text>
            </View>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, { width: `${displayProgress * 100}%` }]} />
            </View>
            <View style={styles.progressStats}>
              <View style={styles.progressStatItem}>
                <Text style={styles.statLabel}>MA DON</Text>
                <Text style={styles.statValue}>{order.id}</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.progressStatItem}>
                <Text style={styles.statLabel}>QUANG DUONG</Text>
                <Text style={styles.statValue}>{distanceLabel}</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.progressStatItem}>
                <Text style={styles.statLabel}>DA BAY</Text>
                <Text style={styles.statValueSmall}>
                  {`${traveledDistanceKm.toFixed(2)} / ${routeDistanceKm.toFixed(2)} km`}
                </Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.progressStatItem}>
                <Text style={styles.statLabel}>DIA CHI</Text>
                <Text style={styles.statValueSmall} numberOfLines={2}>
                  {order.address ?? "--"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.timelineCard}>
          <Text style={styles.timelineTitle}>Trang thai giao hang</Text>
          <View style={styles.timelineList}>
            {trackingSteps.map((step, index) => {
              const isLast = index === trackingSteps.length - 1;
              const isActive = index === activeStepIndex;
              const isCompleted = index < activeStepIndex;
              const topLineActive = index <= activeStepIndex;
              const bottomLineActive = index < activeStepIndex;

              return (
                <View key={step.id} style={styles.timelineItem}>
                  <View style={styles.timelineIndicator}>
                    <View
                      style={[
                        styles.timelineLine,
                        index === 0 && styles.timelineLineHidden,
                        topLineActive && styles.timelineLineActive,
                      ]}
                    />
                    <View
                      style={[
                        styles.timelineDot,
                        isCompleted && styles.timelineDotCompleted,
                        isActive && styles.timelineDotActive,
                      ]}
                    >
                      {isCompleted ? <Text style={styles.timelineDotCheck}>✓</Text> : null}
                    </View>
                    <View
                      style={[
                        styles.timelineLine,
                        isLast && styles.timelineLineHidden,
                        bottomLineActive && styles.timelineLineActive,
                      ]}
                    />
                  </View>
                  <View
                    style={[
                      styles.timelineContent,
                      isActive && styles.timelineContentActive,
                    ]}
                  >
                    <Text style={styles.timelineStepTitle}>{step.title}</Text>
                    <Text style={styles.timelineDescription}>{step.description}</Text>
                    {step.meta ? (
                      <Text style={styles.timelineMeta}>{step.meta}</Text>
                    ) : null}
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerButton}
          activeOpacity={0.85}
          onPress={handleGoHome}
        >
          <Text style={styles.footerButtonLabel}>Quay ve trang chu</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff8f2",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  backLabel: {
    fontSize: 18,
    color: "#1f1f24",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f1f24",
  },
  headerPlaceholder: {
    width: 36,
    height: 36,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 160,
    gap: 20,
  },
  mapCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 20,
    gap: 14,
    shadowColor: "#000000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 24,
    elevation: 6,
  },
  mapTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1f1f24",
  },
  progressCard: {
    backgroundColor: "#fff7ed",
    borderRadius: 18,
    padding: 16,
    gap: 12,
  },
  mapWrapper: {
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ffe0cc",
    marginBottom: 8,
  },
  mapPreview: {
    height: 220,
    width: "100%",
  },
  mapCallout: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#ffffff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    shadowColor: "#000000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 5,
  },
  calloutDestination: {
    left: 12,
    right: undefined,
    top: undefined,
    bottom: 12,
  },
  calloutOrigin: {
    left: 12,
    right: undefined,
    top: 12,
    bottom: undefined,
  },
  calloutTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1f1f24",
  },
  calloutMeta: {
    fontSize: 12,
    color: "#6b6b75",
    marginTop: 2,
  },
  mapStatus: {
    fontSize: 12,
    color: "#6b6b75",
    lineHeight: 18,
    marginTop: -4,
  },
  mapDrone: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#ffffff",
    borderWidth: 3,
    borderColor: "#f97316",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#f97316",
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 8,
  },
  mapDroneEmoji: {
    fontSize: 22,
    color: "#f97316",
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1f1f24",
  },
  progressEta: {
    fontSize: 13,
    color: "#6b6b75",
  },
  progressEtaValue: {
    fontWeight: "700",
    color: "#f97316",
  },
  progressBarBackground: {
    height: 10,
    borderRadius: 999,
    backgroundColor: "#ffe0cc",
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#f97316",
    borderRadius: 999,
  },
  progressStats: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  progressStatItem: {
    flex: 1,
    gap: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#6b6b75",
    letterSpacing: 0.4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1f1f24",
  },
  statValueSmall: {
    fontSize: 13,
    color: "#1f1f24",
    lineHeight: 18,
  },
  statDivider: {
    width: 1,
    backgroundColor: "#f6d6c2",
  },
  timelineCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 20,
    gap: 16,
    shadowColor: "#000000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 24,
    elevation: 5,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1f1f24",
  },
  timelineList: {
    gap: 18,
  },
  timelineItem: {
    flexDirection: "row",
    gap: 16,
  },
  timelineIndicator: {
    width: 26,
    alignItems: "center",
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: "#e5e7eb",
  },
  timelineLineHidden: {
    opacity: 0,
  },
  timelineLineActive: {
    backgroundColor: "#f97316",
  },
  timelineDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
  },
  timelineDotCompleted: {
    borderColor: "#f97316",
    backgroundColor: "#f97316",
  },
  timelineDotActive: {
    borderColor: "#f97316",
    shadowColor: "#f97316",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 4,
  },
  timelineDotCheck: {
    fontSize: 12,
    color: "#ffffff",
    fontWeight: "700",
  },
  timelineContent: {
    flex: 1,
    backgroundColor: "#fff7ed",
    borderRadius: 18,
    padding: 16,
    gap: 6,
  },
  timelineContentActive: {
    backgroundColor: "#fde68a",
  },
  timelineStepTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1f1f24",
  },
  timelineDescription: {
    fontSize: 13,
    color: "#4a4a55",
    lineHeight: 18,
  },
  timelineMeta: {
    fontSize: 12,
    color: "#6b6b75",
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: "#fff8f2",
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  emptyCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 24,
    gap: 16,
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f1f24",
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#4a4a55",
    textAlign: "center",
    lineHeight: 20,
  },
  emptyButton: {
    marginTop: 8,
    backgroundColor: "#f97316",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
  },
  emptyButtonLabel: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#ffe8d9",
    backgroundColor: "#fff8f2",
  },
  footerButton: {
    backgroundColor: "#f97316",
    paddingVertical: 16,
    borderRadius: 999,
    alignItems: "center",
  },
  footerButtonLabel: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
});

export default OrderTrackingScreen;
