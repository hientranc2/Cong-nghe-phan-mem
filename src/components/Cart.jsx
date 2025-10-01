function Cart({ cart, removeFromCart }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="cart">
      <h2>🛒 Giỏ hàng</h2>
      {cart.length === 0 ? (
        <p>Chưa có sản phẩm</p>
      ) : (
        <>
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={item.img} alt={item.name} />
              <div style={{ flex: 1 }}>
                <p>{item.name}</p>
                <p>x{item.quantity}</p>
              </div>
              <p>{item.price * item.quantity}k</p>
              <button onClick={() => removeFromCart(item.id)}>Xóa</button>
            </div>
          ))}
          <div className="cart-total">Tổng: {total}k</div>
        </>
      )}
    </div>
  );
}

export default Cart;
