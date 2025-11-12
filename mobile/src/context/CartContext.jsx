import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

const CartContext = createContext(undefined);

const ensurePositiveInteger = (value, defaultValue = 1) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return defaultValue;
  }
  const rounded = Math.floor(parsed);
  return rounded > 0 ? rounded : defaultValue;
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  const addToCart = useCallback((product, quantity = 1) => {
    if (!product) {
      return { product: null, quantity: 0 };
    }

    const safeQuantity = ensurePositiveInteger(quantity);

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (cartItem) => cartItem.product.id === product.id
      );

      if (existingIndex === -1) {
        return [
          ...prevItems,
          {
            product,
            quantity: safeQuantity,
          },
        ];
      }

      const nextItems = [...prevItems];
      const existingItem = nextItems[existingIndex];
      nextItems[existingIndex] = {
        ...existingItem,
        quantity: existingItem.quantity + safeQuantity,
      };
      return nextItems;
    });

    return { product, quantity: safeQuantity };
  }, []);

  const removeFromCart = useCallback((productId) => {
    if (!productId) {
      return;
    }

    setItems((prevItems) =>
      prevItems.filter((cartItem) => cartItem.product.id !== productId)
    );
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    if (!productId) {
      return;
    }

    const safeQuantity = ensurePositiveInteger(quantity);

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (cartItem) => cartItem.product.id === productId
      );

      if (existingIndex === -1) {
        return prevItems;
      }

      const nextItems = [...prevItems];

      nextItems[existingIndex] = {
        ...nextItems[existingIndex],
        quantity: safeQuantity,
      };

      return nextItems;
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = useMemo(
    () => items.reduce((total, item) => total + ensurePositiveInteger(item.quantity, 0), 0),
    [items]
  );

  const subtotal = useMemo(
    () =>
      items.reduce((total, item) => {
        const price = Number(item?.product?.price ?? 0);
        const quantity = ensurePositiveInteger(item?.quantity, 0);
        return total + price * quantity;
      }, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      totalItems,
      subtotal,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
    }),
    [items, totalItems, subtotal, addToCart, removeFromCart, updateQuantity, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
};

export default CartContext;
