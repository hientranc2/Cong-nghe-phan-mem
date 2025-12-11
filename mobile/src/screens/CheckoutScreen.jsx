import React, { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useCart } from "../context/CartContext.jsx";

const PAYMENT_METHODS = [
  {
    id: "cod",
    label: "Thanh toán khi nhận hàng",
    description: "Thanh toán tiền mặt hoặc quẹt thẻ khi giao món",
  },
  {
    id: "bank",
    label: "Chuyển khoản ngân hàng",
    description: "Nhân viên sẽ liên hệ gửi thông tin tài khoản",
  },
];

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

const CheckoutScreen = ({ onBack, user, onOrderPlaced }) => {
  const { items, subtotal, clearCart } = useCart();
  const [selectedPayment, setSelectedPayment] = useState(PAYMENT_METHODS[0].id);
  const [customerName, setCustomerName] = useState(user?.fullName ?? "");
  const [customerPhone, setCustomerPhone] = useState(user?.phone ?? "");
  const [customerEmail, setCustomerEmail] = useState(user?.email ?? "");
  const [deliveryAddress, setDeliveryAddress] = useState(
    "123 Đường Ẩm Thực, Quận 1, TP.HCM"
  );
  const [formSubmitted, setFormSubmitted] = useState(false);

  const trimmedCustomerName = useMemo(() => customerName.trim(), [customerName]);
  const trimmedCustomerPhone = useMemo(() => customerPhone.trim(), [customerPhone]);
  const trimmedDeliveryAddress = useMemo(
    () => deliveryAddress.trim(),
    [deliveryAddress]
  );

  const hasItems = items.length > 0;
  const hasCustomerName = trimmedCustomerName.length > 0;
  const hasCustomerPhone = trimmedCustomerPhone.length > 0;
  const hasDeliveryAddress = trimmedDeliveryAddress.length > 0;

  const canPlaceOrder =
    hasItems && hasCustomerName && hasCustomerPhone && hasDeliveryAddress;

  const showNameError = formSubmitted && !hasCustomerName;
  const showPhoneError = formSubmitted && !hasCustomerPhone;
  const showAddressError = formSubmitted && !hasDeliveryAddress;

  const handlePlaceOrder = () => {
    setFormSubmitted(true);

    if (!canPlaceOrder) {
      return;
    }

    const orderItems = items.map((item) => ({
      id: item?.product?.id,
      name: item?.product?.name,
      price: Number(item?.product?.price ?? 0),
      quantity: item?.quantity ?? 0,
    }));
    const now = new Date();
    const estimatedDelivery = new Date(now.getTime() + 45 * 60 * 1000);
    const paymentMethod = PAYMENT_METHODS.find(
      (method) => method.id === selectedPayment
    );

    const orderPayload = {
      id: `ORD-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(
        now.getDate()
      ).padStart(2, "0")}-${now.getTime()}`,
      createdAt: now.toISOString(),
      status: "\u0110ang chu\u1ea9n b\u1ecb",
      estimatedDelivery: estimatedDelivery.toISOString(),
      paymentMethod: paymentMethod?.label,
      paymentDescription: paymentMethod?.description,
      subtotal,
      total: subtotal,
      customer: {
        name: trimmedCustomerName,
        phone: trimmedCustomerPhone,
        email: customerEmail?.trim?.() ?? customerEmail,
      },
      address: trimmedDeliveryAddress,
      itemsCount: items.reduce(
        (sum, item) => sum + (Number(item.quantity) || 1),
        0
      ),
      source: "mobile",
      items: orderItems,
    };

    setFormSubmitted(false);
    clearCart();

    if (onOrderPlaced) {
      onOrderPlaced(orderPayload);
      return;
    }

    onBack?.();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onBack}
          style={styles.backButton}
          activeOpacity={0.85}
        >
          <Text style={styles.backLabel}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thanh toán</Text>
        <View style={styles.headerPlaceholder} />
      </View>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tóm tắt đơn hàng</Text>
          {items.length === 0 ? (
            <Text style={styles.emptyCartText}>
              Giỏ hàng của bạn đang trống. Vui lòng quay lại chọn món.
            </Text>
          ) : (
            items.map((item) => {
              const price = Number(item?.product?.price ?? 0);
              const total = price * (item?.quantity ?? 0);

              return (
                <View key={item.product.id} style={styles.summaryRow}>
                  <View style={styles.summaryInfo}>
                    <Text style={styles.summaryName}>{item.product.name}</Text>
                    <Text style={styles.summaryQuantity}>
                      Số lượng: x{item.quantity}
                    </Text>
                  </View>
                  <Text style={styles.summaryPrice}>{formatCurrency(total)}</Text>
                </View>
              );
            })
          )}
          <View style={styles.divider} />
          <View style={styles.summaryTotalRow}>
            <Text style={styles.summaryTotalLabel}>Tổng cộng</Text>
            <Text style={styles.summaryTotalValue}>{formatCurrency(subtotal)}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin khách hàng</Text>
          <TextInput
            style={[styles.input, showNameError && styles.inputError]}
            placeholder="Họ và tên"
            value={customerName}
            onChangeText={setCustomerName}
          />
          {showNameError ? (
            <Text style={styles.errorText}>Vui lòng nhập họ và tên của bạn</Text>
          ) : null}
          <TextInput
            style={[styles.input, showPhoneError && styles.inputError]}
            placeholder="Số điện thoại"
            keyboardType="phone-pad"
            value={customerPhone}
            onChangeText={setCustomerPhone}
          />
          {showPhoneError ? (
            <Text style={styles.errorText}>Vui lòng nhập số điện thoại liên hệ</Text>
          ) : null}
          <TextInput
            style={styles.input}
            placeholder="Email (không bắt buộc)"
            keyboardType="email-address"
            value={customerEmail}
            onChangeText={setCustomerEmail}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Địa chỉ giao hàng</Text>
          <TextInput
            style={[styles.input, styles.addressInput, showAddressError && styles.inputError]}
            multiline
            numberOfLines={3}
            value={deliveryAddress}
            onChangeText={setDeliveryAddress}
          />
          {showAddressError ? (
            <Text style={styles.errorText}>Vui lòng nhập địa chỉ giao hàng</Text>
          ) : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
          {PAYMENT_METHODS.map((method) => {
            const isSelected = method.id === selectedPayment;
            return (
              <TouchableOpacity
                key={method.id}
                style={[styles.paymentOption, isSelected && styles.paymentOptionSelected]}
                activeOpacity={0.9}
                onPress={() => setSelectedPayment(method.id)}
              >
                <View style={styles.paymentIndicator}>
                  <View
                    style={[styles.paymentDot, isSelected && styles.paymentDotActive]}
                  />
                </View>
                <View style={styles.paymentInfo}>
                  <Text style={styles.paymentLabel}>{method.label}</Text>
                  <Text style={styles.paymentDescription}>{method.description}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <View style={styles.footerSummary}>
          <Text style={styles.footerLabel}>Tổng thanh toán</Text>
          <Text style={styles.footerValue}>{formatCurrency(subtotal)}</Text>
        </View>
        <TouchableOpacity
          style={[styles.checkoutButton, !canPlaceOrder && styles.checkoutButtonDisabled]}
          activeOpacity={0.85}
          onPress={handlePlaceOrder}
          disabled={!canPlaceOrder}
        >
          <Text style={styles.checkoutLabel}>Hoàn tất đặt hàng</Text>
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
    backgroundColor: "#fff8f2",
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
    paddingBottom: 160,
    paddingHorizontal: 20,
    gap: 20,
  },
  section: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 18,
    gap: 14,
    shadowColor: "#000000",
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1f1f24",
  },
  emptyCartText: {
    fontSize: 13,
    color: "#6b6b75",
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
    fontSize: 14,
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
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryTotalLabel: {
    fontSize: 15,
    color: "#4a4a55",
  },
  summaryTotalValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#f97316",
  },
  input: {
    backgroundColor: "#f9fafb",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: "#1f1f24",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  inputError: {
    borderColor: "#ef4444",
    backgroundColor: "#fef2f2",
  },
  errorText: {
    fontSize: 12,
    color: "#ef4444",
    marginTop: -6,
    alignSelf: "flex-start",
  },
  addressInput: {
    minHeight: 88,
    textAlignVertical: "top",
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    backgroundColor: "#f9fafb",
  },
  paymentOptionSelected: {
    borderColor: "#f97316",
    backgroundColor: "#fff7ed",
  },
  paymentIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#f97316",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  paymentDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "transparent",
  },
  paymentDotActive: {
    backgroundColor: "#f97316",
  },
  paymentInfo: {
    flex: 1,
    gap: 4,
  },
  paymentLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f1f24",
  },
  paymentDescription: {
    fontSize: 12,
    color: "#6b6b75",
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 16,
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: "#000000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: -6 },
    shadowRadius: 20,
    elevation: 20,
    gap: 16,
  },
  footerSummary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  footerLabel: {
    fontSize: 14,
    color: "#4a4a55",
  },
  footerValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#f97316",
  },
  checkoutButton: {
    backgroundColor: "#f97316",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  checkoutButtonDisabled: {
    backgroundColor: "#fed7aa",
  },
  checkoutLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#ffffff",
  },
});

export default CheckoutScreen;




