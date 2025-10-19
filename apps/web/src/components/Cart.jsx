function Cart({ cart, removeFromCart, onClose, onCheckout, texts = {} }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const subtitle =
    cart.length === 0
      ? texts.subtitleEmpty ?? "Chưa có sản phẩm"
      : (texts.subtitleWithCount ?? "{count} sản phẩm trong giỏ").replace(
          "{count}",
          String(cart.length)
        );
  const quantityLabel = texts.quantityLabel ?? "Số lượng";
  const removeLabel = texts.removeItem ?? "Xóa";
  const emptyMessage =
    texts.emptyMessage ?? "Thêm món yêu thích để bắt đầu đơn hàng của bạn nhé!";
  const subtotalLabel = texts.subtotalLabel ?? "Tạm tính";
  const continueLabel = texts.continueButton ?? "Mua thêm món";
  const checkoutLabel = texts.checkoutButton ?? "Đi đến thanh toán";
  const title = texts.title ?? "🛒 Giỏ hàng của bạn";

  return (
    <div
      className="cart-modal"
      role="dialog"
      aria-modal="true"
      aria-label={texts.title ?? "Giỏ hàng FCO"}
      onClick={onClose}
    >
      <aside className="cart-panel" onClick={(e) => e.stopPropagation()}>
        <header className="cart-panel__header">
          <div>
            <h2>{title}</h2>
            <p>{subtitle}</p>
          </div>
          <button type="button" className="cart-close" onClick={onClose}>
            ×
          </button>
        </header>

        <div className="cart-content">
          {cart.length === 0 ? (
            <div className="cart-empty">
              <p>{emptyMessage}</p>
            </div>
          ) : (
            <ul className="cart-list">
              {cart.map((item) => (
                <li key={item.id} className="cart-item">
                  <img src={item.img} alt={item.name} />
                  <div className="cart-item__info">
                    <p className="cart-item__name">{item.name}</p>
                    <p className="cart-item__meta">
                      {quantityLabel}: x{item.quantity}
                    </p>
                  </div>
                  <p className="cart-item__price">{item.price * item.quantity}k</p>
                  <button
                    type="button"
                    className="cart-item__remove"
                    onClick={() => removeFromCart(item.id)}
                  >
                    {removeLabel}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <footer className="cart-footer">
          <div className="cart-total">
            <span>{subtotalLabel}</span>
            <strong>{total}k</strong>
          </div>
          <div className="cart-actions">
            <button
              type="button"
              className="cart-continue"
              onClick={onClose}
            >
              {continueLabel}
            </button>
            <button
              type="button"
              className="cart-checkout"
              onClick={onCheckout}
              disabled={cart.length === 0}
            >
              {checkoutLabel}
            </button>
          </div>
        </footer>
      </aside>
    </div>
  );
}

export default Cart;
