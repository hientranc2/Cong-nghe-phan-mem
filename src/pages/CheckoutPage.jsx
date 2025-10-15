function CheckoutPage({
  cart = [],
  texts = {},
  onBackToMenu = () => {},
  onConfirm = () => {},
  removeFromCart = () => {},
}) {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const isEmpty = cart.length === 0;

  if (isEmpty) {
    return (
      <main className="checkout-page">
        <section className="checkout-banner">
          <span>{texts.bannerMessage}</span>
        </section>
        <section className="checkout-progress">
          {(texts.steps ?? []).map((step, index) => (
            <div
              key={step}
              className={`checkout-step ${index <= 1 ? "active" : ""}`}
            >
              <span className="step-index">{index + 1}</span>
              <span className="step-label">{step}</span>
            </div>
          ))}
        </section>
        <div className="checkout-empty">
          <h2>{texts.cartTitle}</h2>
          <p>{texts.emptyMessage}</p>
          <button type="button" onClick={onBackToMenu}>
            {texts.continueShopping}
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <section className="checkout-banner">
        <span>{texts.bannerMessage}</span>
      </section>
      <section className="checkout-progress">
        {(texts.steps ?? []).map((step, index) => (
          <div key={step} className={`checkout-step ${index <= 1 ? "active" : ""}`}>
            <span className="step-index">{index + 1}</span>
            <span className="step-label">{step}</span>
          </div>
        ))}
      </section>
      <div className="checkout-layout">
        <div className="checkout-main">
          <h2>{texts.cartTitle}</h2>
          <div className="checkout-table">
            <div className="checkout-table__header">
              <span className="col-product">{texts.productHeader}</span>
              <span>{texts.priceHeader}</span>
              <span>{texts.quantityHeader}</span>
              <span>{texts.totalHeader}</span>
            </div>
            {cart.map((item) => (
              <div key={item.id} className="checkout-row">
                <div className="checkout-product">
                  <img src={item.img} alt={item.name} />
                  <div className="checkout-product__info">
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                  </div>
                </div>
                <span className="checkout-price">{item.price}k</span>
                <span className="checkout-quantity">x{item.quantity}</span>
                <span className="checkout-item-total">{item.price * item.quantity}k</span>
                <button
                  type="button"
                  className="checkout-remove"
                  onClick={() => removeFromCart(item.id)}
                  aria-label={`${texts.removeItem ?? "Remove"} ${item.name}`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <div className="checkout-note">
            <label htmlFor="checkout-note">{texts.noteTitle}</label>
            <textarea
              id="checkout-note"
              rows={3}
              placeholder={texts.notePlaceholder}
            />
          </div>

          <div className="checkout-delivery">
            <h3>{texts.deliveryHeading}</h3>
            <div className="checkout-delivery__options">
              <div className="delivery-card selected">
                <div className="delivery-icon">🚀</div>
                <div>
                  <h4>{texts.deliveryToday}</h4>
                  <p>{texts.deliveryTodayDescription}</p>
                </div>
              </div>
              <div className="delivery-card">
                <div className="delivery-icon">🗓️</div>
                <div>
                  <h4>{texts.deliveryLater}</h4>
                  <p>{texts.deliveryLaterDescription}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="checkout-info-grid">
            {(texts.infoBoxes ?? []).map((box) => (
              <div key={box.title} className="checkout-info-card">
                <h4>{box.title}</h4>
                <p>{box.description}</p>
              </div>
            ))}
          </div>
        </div>
        <aside className="checkout-summary">
          <h3>{texts.summaryTitle}</h3>
          <div className="summary-row">
            <span>{texts.subtotalLabel}</span>
            <span>{subtotal}k</span>
          </div>
          <div className="summary-row">
            <span>{texts.shippingLabel}</span>
            <span className="tag-free">{texts.shippingFree}</span>
          </div>
          <div className="summary-row">
            <span>{texts.discountLabel}</span>
            <span>{texts.discountNone}</span>
          </div>
          <div className="summary-total">
            <span>{texts.totalLabel}</span>
            <strong>{subtotal}k</strong>
          </div>
          <div className="summary-actions">
            <button type="button" className="summary-secondary" onClick={onBackToMenu}>
              {texts.continueShopping}
            </button>
            <button type="button" className="summary-primary" onClick={onConfirm}>
              {texts.confirmButton}
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
}

export default CheckoutPage;
