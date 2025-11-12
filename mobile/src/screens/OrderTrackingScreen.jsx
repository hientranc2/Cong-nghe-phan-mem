import React, { useEffect, useMemo, useRef } from "react";
import {
  Animated,
  Easing,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const formatTime = (value) => {
  if (!value) {
    return "--";
  }

  try {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return "--";
    }

    return new Intl.DateTimeFormat("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch (error) {
    return "--";
  }
};

const OrderTrackingScreen = ({ order, onBack, onGoHome }) => {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    progress.setValue(0);
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: 8000,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: true,
    });

    animation.start();

    return () => {
      animation.stop();
    };
  }, [progress]);

  const trackingSteps = useMemo(() => {
    if (!order) {
      return [];
    }

    const createdAt = formatTime(order.createdAt);
    const etaTime = formatTime(order.estimatedDelivery);
    const deliveryAddress = order.address ?? "--";
    const distanceHint = order.distance ?? "4.6 km";

    return [
      {
        id: "received",
        title: "Đơn hàng đã được ghi nhận",
        description:
          "Nhà hàng đã nhận thông tin và đang chuẩn bị món ngon cho bạn.",
        meta: createdAt !== "--" ? `Lúc ${createdAt}` : undefined,
      },
      {
        id: "preparing",
        title: "Nhà hàng đang hoàn tất món",
        description:
          "Đầu bếp đang đóng gói để sẵn sàng bàn giao cho drone giao hàng.",
        meta: "Dự kiến 8 phút",
      },
      {
        id: "pickup",
        title: "Drone tiếp nhận đơn",
        description: "Drone đã đến điểm nhận hàng và đang chuẩn bị cất cánh.",
        meta: "Đang diễn ra",
      },
      {
        id: "enroute",
        title: "Drone đang bay đến bạn",
        description: `Quãng đường còn lại khoảng ${distanceHint}. Bạn có thể xem drone đang di chuyển trên bản đồ.`,
        meta: etaTime !== "--" ? `Dự kiến giao lúc ${etaTime}` : undefined,
      },
      {
        id: "landing",
        title: "Chuẩn bị hạ cánh",
        description: `Điểm giao nhận: ${deliveryAddress}. Vui lòng chuẩn bị nhận món ngon nhé!`,
        meta: "Xin chờ trong giây lát",
      },
    ];
  }, [order]);

  const activeStepIndex = 3;

  const droneTranslateX = progress.interpolate({
    inputRange: [0, 0.35, 0.65, 1],
    outputRange: [24, 120, 188, 236],
  });
  const droneTranslateY = progress.interpolate({
    inputRange: [0, 0.35, 0.65, 1],
    outputRange: [168, 118, 76, 36],
  });
  const droneRotate = progress.interpolate({
    inputRange: [0, 0.5, 1],
   outputRange: ["-8deg", "4deg", "0deg"],
  });
  const droneShadowScale = progress.interpolate({
    inputRange: [0, 0.5, 1],
  outputRange: [1, 0.8, 0.7],
  });

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
          <Text style={styles.emptyTitle}>Không có dữ liệu đơn hàng</Text>
          <Text style={styles.emptySubtitle}>
            Vui lòng quay lại trang chủ để tiếp tục đặt món và theo dõi đơn hàng của bạn.
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            activeOpacity={0.85}
            onPress={handleGoHome}
          >
            <Text style={styles.emptyButtonLabel}>Quay về trang chủ</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.85}>
          <Text style={styles.backLabel}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Theo dõi drone giao hàng</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mapCard}>
          <Text style={styles.mapTitle}>Hành trình trực tiếp</Text>
          <View style={styles.mapIllustration}>
            <View style={[styles.pathSegment, styles.pathSegmentFirst]} />
            <View style={[styles.pathSegment, styles.pathSegmentSecond]} />
            <View style={[styles.pathSegment, styles.pathSegmentThird]} />

            <View style={[styles.marker, styles.markerStart]}>
              <View style={styles.markerIcon}>
                <Text style={styles.markerEmoji}>🏠</Text>
              </View>
              <Text style={styles.markerLabel}>Nhà hàng</Text>
              <Text style={styles.markerMeta}>{formatTime(order.createdAt)}</Text>
            </View>

            <View style={[styles.marker, styles.markerEnd]}>
              <View style={[styles.markerIcon, styles.markerIconDestination]}>
                <Text style={styles.markerEmoji}>📍</Text>
              </View>
              <Text style={styles.markerLabel}>Địa chỉ giao</Text>
              <Text style={styles.markerMeta}>{formatTime(order.estimatedDelivery)}</Text>
            </View>

            <Animated.View
              pointerEvents="none"
              style={[
                styles.droneWrapper,
                {
                  transform: [
                    { translateX: droneTranslateX },
                    { translateY: droneTranslateY },
                    { rotate: droneRotate },
                  ],
                },
              ]}
            >
              <Animated.View
                style={[
                  styles.droneShadow,
                  {
                    transform: [{ scale: droneShadowScale }],
                  },
                ]}
              />
              <View style={styles.droneBody}>
                <Text style={styles.droneIcon}>🚁</Text>
              </View>
            </Animated.View>
          </View>

          <View style={styles.mapMeta}>
            <View style={styles.mapMetaItem}>
              <Text style={styles.mapMetaLabel}>Mã đơn</Text>
              <Text style={styles.mapMetaValue}>{order.id}</Text>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.mapMetaItem}>
              <Text style={styles.mapMetaLabel}>Địa chỉ</Text>
              <Text style={[styles.mapMetaValue, styles.mapMetaValueMultiline]}>
                {order.address}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.timelineCard}>
          <Text style={styles.timelineTitle}>Trạng thái giao hàng</Text>
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
          <Text style={styles.footerButtonLabel}>Quay về trang chủ</Text>
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
    gap: 16,
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
  mapIllustration: {
    height: 220,
    borderRadius: 24,
    backgroundColor: "#fff7ed",
    overflow: "hidden",
  },
  pathSegment: {
    position: "absolute",
    height: 6,
    borderRadius: 3,
    backgroundColor: "#fed7aa",
  },
  pathSegmentFirst: {
    left: 32,
    bottom: 70,
    width: 120,
    transform: [{ rotate: "18deg" }],
  },
  pathSegmentSecond: {
    left: 100,
    bottom: 134,
    width: 132,
    transform: [{ rotate: "-12deg" }],
  },
  pathSegmentThird: {
    left: 158,
    bottom: 188,
    width: 120,
    transform: [{ rotate: "-28deg" }],
  },
  marker: {
    position: "absolute",
    backgroundColor: "#ffffff",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    shadowColor: "#000000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 16,
    elevation: 5,
    alignItems: "center",
    gap: 4,
  },
  markerStart: {
    left: 20,
    bottom: 20,
  },
  markerEnd: {
    right: 20,
    top: 20,
  },
  markerIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#fff7ed",
    alignItems: "center",
    justifyContent: "center",
  },
  markerIconDestination: {
    backgroundColor: "#f97316",
  },
  markerEmoji: {
    fontSize: 18,
  },
  markerLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1f1f24",
  },
  markerMeta: {
    fontSize: 12,
    color: "#6b6b75",
  },
  droneWrapper: {
    position: "absolute",
    width: 54,
    height: 54,
    alignItems: "center",
    justifyContent: "center",
  },
  droneShadow: {
    position: "absolute",
    bottom: 2,
    width: 36,
    height: 12,
    borderRadius: 18,
    backgroundColor: "rgba(0, 0, 0, 0.12)",
  },
  droneBody: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#f97316",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#f97316",
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 18,
    elevation: 8,
  },
  droneIcon: {
    fontSize: 26,
    color: "#ffffff",
  },
  mapMeta: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
  },
  mapMetaItem: {
    flex: 1,
    gap: 4,
  },
  mapMetaLabel: {
    fontSize: 12,
    color: "#6b6b75",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  mapMetaValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f1f24",
  },
  mapMetaValueMultiline: {
    lineHeight: 18,
  },
  metaDivider: {
    width: 1,
    backgroundColor: "#f1f1f5",
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
