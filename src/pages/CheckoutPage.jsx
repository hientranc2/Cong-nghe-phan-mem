import { useMemo, useState } from "react";

function CheckoutPage({
  cart = [],
  texts = {},
  removeFromCart = () => {},
  onUpdateQuantity = () => {},
  onContinueShopping = () => {},
  onPlaceOrder = () => {},
}) {
  const steps = texts.steps ?? ["Order", "Checkout"];
  const bannerMessage = texts.bannerMessage ?? "Special gift: complimentary snack combo";
  const cartTitle = texts.cartTitle ?? "Your cart";
  const productHeader = texts.productHeader ?? "Item";
  const priceHeader = texts.priceHeader ?? "Unit price";
  const quantityHeader = texts.quantityHeader ?? "Qty";
  const totalHeader = texts.totalHeader ?? "Total";
  const noteTitle = texts.noteTitle ?? "Order note";
  const notePlaceholder = texts.notePlaceholder ?? "";
  const deliveryHeading = texts.deliveryHeading ?? "Estimated delivery";
  const deliveryToday = texts.deliveryToday ?? "Deliver within 30 minutes";
  const deliveryTodayDescription =
    texts.deliveryTodayDescription ??
    "Perfect for instant meals with the nearest courier.";
  const deliveryLater = texts.deliveryLater ?? "Schedule for another day";
  const deliveryLaterDescription =
    texts.deliveryLaterDescription ??
    "Pick a delivery slot later today or on the next day.";
  const infoBoxes = texts.infoBoxes ?? [];
  const summaryTitle = texts.summaryTitle ?? "Payment summary";
  const subtotalLabel = texts.subtotalLabel ?? "Subtotal";
  const shippingLabel = texts.shippingLabel ?? "Delivery fee";
  const shippingFree = texts.shippingFree ?? "Free";
  const discountLabel = texts.discountLabel ?? "Discount";
  const discountNone = texts.discountNone ?? "Not applied";
  const totalLabel = texts.totalLabel ?? "Grand total";
  const continueShoppingLabel = texts.continueShopping ?? "Back to menu";
  const confirmButton = texts.confirmButton ?? "Confirm order";
  const removeLabel = texts.removeItem ?? "Remove";
  const emptyMessage = texts.emptyMessage ?? "Your cart is empty. Please add some items first!";
  const successMessage =
    texts.successMessage ?? "Your order has been received! We'll reach out shortly to confirm.";

  const [deliveryOption, setDeliveryOption] = useState("today");
  const [orderNote, setOrderNote] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );
  const shippingValue = 0;
  const total = subtotal + shippingValue;
  const hasItems = cart.length > 0;

  const formatPrice = (value) => `${value}k`;

  const handleDecreaseQuantity = (item) => {
    const nextQuantity = item.quantity - 1;
    if (nextQuantity <= 0) {
      removeFromCart(item.id);
    } else {
      onUpdateQuantity(item.id, nextQuantity);
    }
  };

  const handleIncreaseQuantity = (item) => {
    onUpdateQuantity(item.id, item.quantity + 1);
  };

  const handleConfirmOrder = () => {
    if (!hasItems) {
      onContinueShopping();
      return;
    }

    setShowSuccess(true);
    onPlaceOrder();
  };

  return (
    <main className="checkout-page">
      <div className="checkout-banner">
        <span aria-hidden="true">🎁</span>
        <p>{bannerMessage}</p>
      </div>

      <ol className="checkout-steps" aria-label="Checkout progress">
        {steps.map((step, index) => {
          const status = index === steps.length - 1 ? "current" : "done";
          const isFirstStep = index === 0;

          const stepContent = (
            <>
              <span className="checkout-step__index">{index + 1}</span>
              <span className="checkout-step__label">{step}</span>
            </>
          );

          return (
            <li
              key={step}
              className={`checkout-step ${status} ${
                isFirstStep ? "clickable" : ""
              }`}
              aria-current={status === "current" ? "step" : undefined}
            >
              {isFirstStep ? (
                <button
                  type="button"
                  className="checkout-step__button"
                  onClick={onContinueShopping}
                >
                  {stepContent}
                </button>
              ) : (
                stepContent
              )}
            </li>
          );
        })}
      </ol>

      {showSuccess && (
        <div className="checkout-success" role="status" aria-live="polite">
          <span aria-hidden="true">✅</span>
          <p>{successMessage}</p>
        </div>
      )}

      {hasItems ? (
        <div className="checkout-layout">
          <section className="checkout-main" aria-labelledby="checkout-cart-heading">
            <div className="checkout-main__header">
              <h2 id="checkout-cart-heading">{cartTitle}</h2>
            </div>

            <div className="checkout-table-wrapper">
              <table className="checkout-table">
                <thead>
                  <tr>
                    <th scope="col">{productHeader}</th>
                    <th scope="col">{priceHeader}</th>
                    <th scope="col">{quantityHeader}</th>
                    <th scope="col">{totalHeader}</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="checkout-item">
                          <img src={item.img} alt={item.name} loading="lazy" />
                          <div className="checkout-item__info">
                            <p className="checkout-item__name">{item.name}</p>
                            <p className="checkout-item__desc">{item.description}</p>
                            <button
                              type="button"
                              className="checkout-item__remove"
                              onClick={() => removeFromCart(item.id)}
                            >
                              {removeLabel}
                            </button>
                          </div>
                        </div>
                      </td>
                      <td>{formatPrice(item.price)}</td>
                      <td>
                        <div className="checkout-quantity">
                          <button
                            type="button"
                            onClick={() => handleDecreaseQuantity(item)}
                            aria-label={`${quantityHeader} minus`}
                          >
                            −
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => handleIncreaseQuantity(item)}
                            aria-label={`${quantityHeader} plus`}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td>{formatPrice(item.price * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="checkout-note">
              <h3>{noteTitle}</h3>
              <textarea
                value={orderNote}
                onChange={(event) => setOrderNote(event.target.value)}
                placeholder={notePlaceholder}
                rows={3}
              />
            </div>

            <div className="checkout-delivery">
              <h3>{deliveryHeading}</h3>
              <div className="checkout-delivery__options" role="radiogroup">
                <button
                  type="button"
                  className={`checkout-delivery__option ${
                    deliveryOption === "today" ? "active" : ""
                  }`}
                  onClick={() => setDeliveryOption("today")}
                  aria-pressed={deliveryOption === "today"}
                >
                  <strong>{deliveryToday}</strong>
                  <p>{deliveryTodayDescription}</p>
                </button>
                <button
                  type="button"
                  className={`checkout-delivery__option ${
                    deliveryOption === "later" ? "active" : ""
                  }`}
                  onClick={() => setDeliveryOption("later")}
                  aria-pressed={deliveryOption === "later"}
                >
                  <strong>{deliveryLater}</strong>
                  <p>{deliveryLaterDescription}</p>
                </button>
              </div>
            </div>

            {infoBoxes.length > 0 && (
              <div className="checkout-info">
                {infoBoxes.map((box) => (
                  <div key={box.title} className="checkout-info__box">
                    <h4>{box.title}</h4>
                    <p>{box.description}</p>
                  </div>
                ))}
              </div>
            )}
          </section>

          <aside className="checkout-summary" aria-labelledby="checkout-summary-heading">
            <h3 id="checkout-summary-heading">{summaryTitle}</h3>
            <dl className="checkout-summary__list">
              <div className="checkout-summary__row">
                <dt>{subtotalLabel}</dt>
                <dd>{formatPrice(subtotal)}</dd>
              </div>
              <div className="checkout-summary__row">
                <dt>{shippingLabel}</dt>
                <dd>{shippingValue > 0 ? formatPrice(shippingValue) : shippingFree}</dd>
              </div>
              <div className="checkout-summary__row">
                <dt>{discountLabel}</dt>
                <dd>{discountNone}</dd>
              </div>
              <div className="checkout-summary__row checkout-summary__row--total">
                <dt>{totalLabel}</dt>
                <dd>{formatPrice(total)}</dd>
              </div>
            </dl>
            <div className="checkout-summary__actions">
              <button
                type="button"
                className="checkout-summary__continue"
                onClick={onContinueShopping}
              >
                {continueShoppingLabel}
              </button>
              <button
                type="button"
                className="checkout-summary__confirm"
                onClick={handleConfirmOrder}
                disabled={!hasItems}
              >
                {confirmButton}
              </button>
            </div>
          </aside>
        </div>
      ) : (
        <div className="checkout-empty">
          {!showSuccess && <p>{emptyMessage}</p>}
          <button type="button" onClick={onContinueShopping}>
            {continueShoppingLabel}
          </button>
        </div>
      )}
    </main>
  );
}

export default CheckoutPage;
