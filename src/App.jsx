import { useState } from "react";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Menu from "./components/Menu";
import Cart from "./components/Cart";

function App() {
  const [cart, setCart] = useState([]);

  // Thêm sản phẩm
  const addToCart = (item) => {
    const exists = cart.find((c) => c.id === item.id);
    if (exists) {
      setCart(
        cart.map((c) =>
          c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
        )
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  // Xóa sản phẩm
  const removeFromCart = (id) => {
    setCart(cart.filter((c) => c.id !== id));
  };

  return (
    <div className="app">
      <Header />
      <main className="app-container">
        <Menu addToCart={addToCart} />
        <Cart cart={cart} removeFromCart={removeFromCart} />
      </main>
      <Footer />
    </div>
  );
}

export default App;
