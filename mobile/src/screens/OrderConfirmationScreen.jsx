import React, { useMemo } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const formatCurrency = (value) => {
  if (typeof value !== "number") {
    return "--";
  }

  try {
    return `${new Intl.NumberFormat("vi-VN").format(value)} đ`;
  } catch (error) {
    return `${value} đ`;
  }
};

const formatDateTime = (value) => {
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
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  } catch (error) {
    return "--";
  }
};

const OrderConfirmationScreen = ({ order, onBack, onTrackOrder, onViewOrders }) => {
  const summaryItems = order?.items ?? [];
  const productCount = useMemo(
    () =>
      summaryItems.reduce(
        (count, item) => (Number(item?.quantity ?? 0) > 0 ? count + 1 : count),
        0
      ),
    [summaryItems]
  );

  if (!order) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <View style={styles.heroIcon}>
            <Text style={styles.heroIconLabel}>?</Text>
          </View>
          <Text style={styles.heroTitle}>Không tìm thấy đơn hàng</Text>
          <Text style={styles.heroSubtitle}>
            Vui lòng quay lại trang chủ để tiếp tục đặt món ngon cho bạn nhé!
          </Text>
          <TouchableOpacity
            style={[styles.primaryButton, styles.primaryButtonFullWidth]}
            activeOpacity={0.85}
            onPress={onBack}
          >
            <Text style={styles.primaryButtonLabel}>Quay về trang chủ</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <View style={styles.heroIcon}>
            <Text style={styles.heroIconLabel}>✓</Text>
          </View>
          <Text style={styles.heroTitle}>Đơn hàng đã được ghi nhận!</Text>
          <Text style={styles.heroSubtitle}>
            Cảm ơn bạn đã tin tưởng FoodCourt Online. Chúng tôi đang chuẩn bị món ngon để
            giao ngay cho bạn.
          </Text>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Tóm tắt đơn hàng</Text>
          {summaryItems.length === 0 ? (
            <Text style={styles.emptyMessage}>
              Đơn hàng của bạn chưa có món nào. Vui lòng quay lại trang chủ để đặt thêm.
            </Text>
          ) : (
            <View style={styles.summaryList}>
              {summaryItems.map((item) => {
                const itemTotal = Number(item.price ?? 0) * Number(item.quantity ?? 0);
                return (
                  <View key={item.id} style={styles.summaryRow}>
                    <View style={styles.summaryInfo}>
                      <Text style={styles.summaryName}>{item.name}</Text>
                      <Text style={styles.summaryQuantity}>Số lượng: x{item.quantity}</Text>
                    </View>
                    <Text style={styles.summaryPrice}>{formatCurrency(itemTotal)}</Text>
                  </View>
                );
              })}
            </View>
          )}
          <View style={styles.divider} />
          <View style={styles.summaryTotalRow}>
            <View>
              <Text style={styles.summaryTotalLabel}>Tổng cộng</Text>
              <Text style={styles.summaryTotalSubLabel}>{productCount} món</Text>
            </View>
            <Text style={styles.summaryTotalValue}>{formatCurrency(order.subtotal)}</Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Đơn hàng đã ghi nhận</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Mã đơn</Text>
            <Text style={styles.detailValue}>{order.id}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Thời gian đặt</Text>
            <Text style={styles.detailValue}>{formatDateTime(order.createdAt)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Thời gian giao dự kiến</Text>
            <Text style={styles.detailValue}>{formatDateTime(order.estimatedDelivery)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Phương thức thanh toán</Text>
            <Text style={styles.detailValue}>{order.paymentMethod ?? "--"}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Địa chỉ giao hàng</Text>
            <Text style={[styles.detailValue, styles.detailValueMultiline]}>
              {order.address}
            </Text>
          </View>
          <View style={styles.detailDivider} />
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Người nhận</Text>
            <Text style={styles.detailValue}>{order.customer?.name ?? "--"}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>SĐT</Text>
            <Text style={styles.detailValue}>{order.customer?.phone ?? "--"}</Text>
          </View>
          {order.customer?.email ? (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Email</Text>
              <Text style={styles.detailValue}>{order.customer.email}</Text>
            </View>
          ) : null}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.secondaryButton, styles.secondaryButtonFullWidth]}
          activeOpacity={0.85}
          onPress={onTrackOrder ?? onBack}
        >
          <Text style={styles.secondaryButtonLabel}>Theo dõi đơn hàng</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.primaryButton, styles.primaryButtonFullWidth]}
          activeOpacity={0.85}
          onPress={onViewOrders ?? onBack}
        >
          <Text style={styles.primaryButtonLabel}>Quay về trang chủ</Text>
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
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 160,
    paddingTop: 24,
    gap: 20,
  },
  heroCard: {
    backgroundColor: "#fff1e6",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    gap: 16,
    shadowColor: "#f97316",
    shadowOpacity: 0.16,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 24,
    elevation: 6,
  },
  heroIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#f97316",
    alignItems: "center",
    justifyContent: "center",
  },
  heroIconLabel: {
    fontSize: 28,
    fontWeight: "700",
    color: "#ffffff",
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1f1f24",
    textAlign: "center",
  },
  heroSubtitle: {
    fontSize: 14,
    color: "#4a4a55",
    textAlign: "center",
    lineHeight: 20,
  },
  sectionCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 20,
    gap: 16,
    shadowColor: "#000000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 20,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1f1f24",
  },
  emptyMessage: {
    fontSize: 14,
    color: "#6b6b75",
  },
  summaryList: {
    gap: 14,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  summaryInfo: {
    flex: 1,
    gap: 6,
  },
  summaryName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1f1f24",
  },
  summaryQuantity: {
    fontSize: 12,
    color: "#6b6b75",
  },
  summaryPrice: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f1f24",
  },
  divider: {
    height: 1,
    backgroundColor: "#f1f1f5",
  },
  summaryTotalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  summaryTotalLabel: {
    fontSize: 14,
    color: "#4a4a55",
  },
  summaryTotalSubLabel: {
    fontSize: 12,
    color: "#a1a1aa",
  },
  summaryTotalValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#f97316",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  detailLabel: {
    width: 140,
    fontSize: 13,
    color: "#6b6b75",
    fontWeight: "500",
  },
  detailValue: {
    flex: 1,
    fontSize: 14,
    color: "#1f1f24",
    textAlign: "right",
  },
  detailValueMultiline: {
    lineHeight: 20,
  },
  detailDivider: {
    height: 1,
    backgroundColor: "#f4f4f5",
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingBottom: 28,
    paddingTop: 16,
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: "#000000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: -6 },
    shadowRadius: 20,
    elevation: 20,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: "#f97316",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#ffffff",
  },
  primaryButtonFullWidth: {
    width: "100%",
  },
  secondaryButton: {
    backgroundColor: "#fff7ed",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#f97316",
  },
  secondaryButtonLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#f97316",
  },
  secondaryButtonFullWidth: {
    width: "100%",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    gap: 20,
  },
});

export default OrderConfirmationScreen;
