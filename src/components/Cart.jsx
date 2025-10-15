function Cart({ cart, removeFromCart, onClose, onCheckout }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div
      className="cart-modal"
      role="dialog"
      aria-modal="true"
      aria-label="Giỏ hàng FCO"
      onClick={onClose}
    >
      <aside className="cart-panel" onClick={(e) => e.stopPropagation()}>
        <header className="cart-panel__header">
          <div>
            <h2>🛒 Giỏ hàng của bạn</h2>
            <p>{cart.length === 0 ? "Chưa có sản phẩm" : `${cart.length} sản phẩm trong giỏ`}</p>
          </div>
          <button type="button" className="cart-close" onClick={onClose}>
            ×
          </button>
        </header>

        <div className="cart-content">
          {cart.length === 0 ? (
            <div className="cart-empty">
              <p>Thêm món yêu thích để bắt đầu đơn hàng của bạn nhé!</p>
            </div>
          ) : (
            <ul className="cart-list">
              {cart.map((item) => (
                <li key={item.id} className="cart-item">
                  <img src={item.img} alt={item.name} />
                  <div className="cart-item__info">
                    <p className="cart-item__name">{item.name}</p>
                    <p className="cart-item__meta">Số lượng: x{item.quantity}</p>
                  </div>
                  <p className="cart-item__price">{item.price * item.quantity}k</p>
                  <button
                    type="button"
                    className="cart-item__remove"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Xóa
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <footer className="cart-footer">
          <div className="cart-total">
            <span>Tạm tính</span>
            <strong>{total}k</strong>
          </div>
          <div className="cart-actions">
            <button
              type="button"
              className="cart-continue"
              onClick={onClose}
            >
              Mua thêm món
            </button>
            <button
              type="button"
              className="cart-checkout"
              onClick={onCheckout}
              disabled={cart.length === 0}
            >
              Đi đến thanh toán
            </button>
          </div>
        </footer>
      </aside>
    </div>
  );
}

export default Cart;
