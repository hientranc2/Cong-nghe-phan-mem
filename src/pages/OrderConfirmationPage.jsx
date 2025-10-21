import { useEffect, useMemo, useState } from "react";
import "./OrderConfirmationPage.css";

function OrderConfirmationPage({
  pendingOrder = null,
  receipt = null,
  user = null,
  texts = {},
  onConfirm = () => {},
  onBackHome = () => {},
  onBackToCheckout = () => {},
}) {
  const hasPendingOrder = Boolean(pendingOrder);
  const activeOrder = receipt ?? pendingOrder;

  const title = texts.title ?? "Xác nhận thông tin giao hàng";
  const subtitle =
    texts.subtitle ??
    "Vui lòng kiểm tra thông tin liên hệ và chọn phương thức thanh toán trước khi hoàn tất đơn hàng.";
  const customerTitle = texts.customerTitle ?? "Thông tin khách hàng";
  const paymentLabel = texts.paymentLabel ?? "Phương thức thanh toán";
  const contactLabel = texts.contactLabel ?? "Liên hệ";
  const addressLabel = texts.addressLabel ?? "Địa chỉ giao hàng";
  const phoneLabel = texts.phoneLabel ?? "Số điện thoại";
  const emailLabel = texts.emailLabel ?? "Email";
  const nameLabel = texts.nameLabel ?? "Họ và tên";
  const submitLabel = texts.submitLabel ?? "Xác nhận đơn hàng";
  const backHomeLabel = texts.backHomeLabel ?? "Về trang chủ";
  const backCheckoutLabel = texts.backCheckoutLabel ?? "Quay lại giỏ hàng";
  const summaryTitle = texts.summaryTitle ?? "Tóm tắt đơn hàng";
  const subtotalLabel = texts.subtotalLabel ?? "Tạm tính";
  const shippingLabel = texts.shippingLabel ?? "Phí vận chuyển";
  const totalLabel = texts.totalLabel ?? "Tổng thanh toán";
  const noteLabel = texts.noteLabel ?? "Ghi chú";
  const deliveryLabel = texts.deliveryLabel ?? "Thời gian giao hàng";
  const deliveryDescriptions = texts.deliveryDescriptions ?? {
    today: "Giao trong 30 phút",
    later: "Giao theo lịch hẹn",
  };
  const orderIdLabel = texts.orderIdLabel ?? "Mã đơn";
  const confirmedAtLabel = texts.confirmedAtLabel ?? "Thời gian xác nhận";
  const successTitle = texts.successTitle ?? "Đơn hàng đã ghi nhận";
  const successMessage =
    texts.successMessage ??
    "Cảm ơn bạn! Đơn hàng của bạn đã được ghi nhận. Đội ngũ FCO sẽ liên hệ để xác nhận trong ít phút.";
  const formErrorMessage =
    texts.errorMessage ?? "Không thể xác nhận đơn hàng. Vui lòng thử lại.";

  const paymentOptions = texts.paymentOptions ?? [
    { value: "cash", label: "Tiền mặt khi nhận hàng" },
    { value: "card", label: "Thẻ tín dụng/ghi nợ" },
    { value: "banking", label: "Chuyển khoản ngân hàng" },
  ];

  const paymentLabels = useMemo(() => {
    const entries = paymentOptions.map((option) => [option.value, option.label]);
    return Object.fromEntries(entries);
  }, [paymentOptions]);

  const [formState, setFormState] = useState(() => ({
    name: user?.name ?? "",
    phone: user?.phone ?? "",
    email: user?.email ?? "",
    address: user?.address ?? "",
    paymentMethod: paymentOptions[0]?.value ?? "cash",
  }));
  const [error, setError] = useState("");

  useEffect(() => {
    if (pendingOrder) {
      setFormState((prev) => ({
        ...prev,
        name: user?.name ?? prev.name,
        email: user?.email ?? prev.email,
      }));
    }
  }, [pendingOrder, user]);

  useEffect(() => {
    if (receipt?.customer) {
      setError("");
    }
  }, [receipt]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!hasPendingOrder) {
      return;
    }

    setError("");

    try {
      const result = onConfirm({ ...formState });
      if (!result?.success) {
        setError(result?.message ?? formErrorMessage);
      }
    } catch (submissionError) {
      setError(formErrorMessage);
    }
  };

  if (!activeOrder) {
    return null;
  }

  const items = activeOrder.items ?? [];
  const subtotal = activeOrder.subtotal ??
    items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping =
    activeOrder.shipping ?? activeOrder.shippingValue ?? 0;
  const total = activeOrder.total ?? subtotal + shipping;
  const note = activeOrder.note ?? "";
  const deliveryOption = activeOrder.deliveryOption ?? "today";
  const deliveryDescription =
    deliveryDescriptions[deliveryOption] ?? deliveryDescriptions.today;
  const formatPrice = (value) => `${value}k`;

  const customerInfo = receipt?.customer ?? null;
  const safeCustomer = customerInfo
    ? {
        name: customerInfo.name ?? "",
        phone: customerInfo.phone ?? "",
        email: customerInfo.email ?? "",
        address: customerInfo.address ?? "",
        paymentMethod: customerInfo.paymentMethod ?? formState.paymentMethod,
      }
    : null;
  const paymentMethodLabel = safeCustomer
    ? paymentLabels[safeCustomer.paymentMethod] ?? safeCustomer.paymentMethod
    : paymentLabels[formState.paymentMethod] ?? formState.paymentMethod;
  const confirmedAtText = receipt?.confirmedAt
    ? new Date(receipt.confirmedAt).toLocaleString()
    : new Date().toLocaleString();

  return (
    <main className="order-confirmation-page" aria-labelledby="order-confirmation-heading">
      <header className="order-confirmation-header">
        <h2 id="order-confirmation-heading">{title}</h2>
        <p>{subtitle}</p>
      </header>

      <div className="order-confirmation-layout">
        <section className="order-confirmation-details" aria-labelledby="order-details-heading">
          <h3 id="order-details-heading">{summaryTitle}</h3>
          <ul className="order-items">
            {items.map((item) => (
              <li key={item.id}>
                <div className="order-item__info">
                  <span className="order-item__name">{item.name}</span>
                  <span className="order-item__quantity">x{item.quantity}</span>
                </div>
                <span className="order-item__total">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <dl className="order-summary">
            <div className="order-summary__row">
              <dt>{subtotalLabel}</dt>
              <dd>{formatPrice(subtotal)}</dd>
            </div>
            <div className="order-summary__row">
              <dt>{shippingLabel}</dt>
              <dd>{shipping > 0 ? formatPrice(shipping) : "Miễn phí"}</dd>
            </div>
            <div className="order-summary__row order-summary__row--total">
              <dt>{totalLabel}</dt>
              <dd>{formatPrice(total)}</dd>
            </div>
          </dl>
          {note && (
            <div className="order-extra">
              <strong>{noteLabel}:</strong>
              <p>{note}</p>
            </div>
          )}
          {deliveryDescription && (
            <div className="order-extra">
              <strong>{deliveryLabel}:</strong>
              <p>{deliveryDescription}</p>
            </div>
          )}
        </section>

        {receipt?.customer ? (
          <section className="order-confirmation-result" aria-live="polite">
            <h3>{successTitle}</h3>
            <p>{successMessage}</p>
            <dl className="order-result__meta">
              <div>
                <dt>{orderIdLabel}</dt>
                <dd>{receipt.id}</dd>
              </div>
              <div>
                <dt>{confirmedAtLabel}</dt>
                <dd>{confirmedAtText}</dd>
              </div>
              <div>
                <dt>{paymentLabel}</dt>
                <dd>{paymentMethodLabel}</dd>
              </div>
            </dl>
            <div className="order-result__customer">
              <h4>{customerTitle}</h4>
              <ul>
                <li>
                  <strong>{nameLabel}:</strong> {safeCustomer?.name || "—"}
                </li>
                <li>
                  <strong>{phoneLabel}:</strong> {safeCustomer?.phone || "—"}
                </li>
                <li>
                  <strong>{emailLabel}:</strong> {safeCustomer?.email || "—"}
                </li>
                <li>
                  <strong>{addressLabel}:</strong> {safeCustomer?.address || "—"}
                </li>
              </ul>
            </div>
            <div className="order-result__actions">
              <button type="button" onClick={onBackHome} className="order-btn order-btn--primary">
                {backHomeLabel}
              </button>
            </div>
          </section>
        ) : (
          <section className="order-confirmation-form" aria-labelledby="customer-info-heading">
            <h3 id="customer-info-heading">{customerTitle}</h3>
            {error && (
              <div className="order-form__error" role="alert">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="order-form">
              <label htmlFor="order-name">
                {nameLabel}
                <input
                  id="order-name"
                  name="name"
                  type="text"
                  value={formState.name}
                  onChange={handleChange}
                  placeholder="Nguyễn Văn A"
                  required
                />
              </label>
              <label htmlFor="order-phone">
                {phoneLabel}
                <input
                  id="order-phone"
                  name="phone"
                  type="tel"
                  value={formState.phone}
                  onChange={handleChange}
                  placeholder="0901 234 567"
                  required
                />
              </label>
              <label htmlFor="order-email">
                {emailLabel}
                <input
                  id="order-email"
                  name="email"
                  type="email"
                  value={formState.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                />
              </label>
              <label htmlFor="order-address">
                {addressLabel}
                <textarea
                  id="order-address"
                  name="address"
                  value={formState.address}
                  onChange={handleChange}
                  placeholder="Số 123, đường ABC, quận 1, TP. Hồ Chí Minh"
                  rows={3}
                  required
                />
              </label>
              <fieldset className="order-payment">
                <legend>{paymentLabel}</legend>
                {paymentOptions.map((option) => (
                  <label key={option.value} className="order-payment__option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={option.value}
                      checked={formState.paymentMethod === option.value}
                      onChange={handleChange}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </fieldset>
              <div className="order-form__actions">
                <button
                  type="button"
                  className="order-btn order-btn--ghost"
                  onClick={onBackToCheckout}
                >
                  {backCheckoutLabel}
                </button>
                <button type="submit" className="order-btn order-btn--primary">
                  {submitLabel}
                </button>
              </div>
            </form>
          </section>
        )}
      </div>
    </main>
  );
}

export default OrderConfirmationPage;
