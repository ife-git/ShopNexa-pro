// context/cartContext.jsx
import React, { createContext, useState } from "react";

export const CartContext = createContext();

export default function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  function addToCart(item) {
    setCart((prev) => {
      const existing = prev.find((p) => p.id === item.id);

      if (existing) {
        return prev.map((p) =>
          p.id === item.id ? { ...p, quantity: p.quantity + item.quantity } : p,
        );
      }

      return [...prev, item];
    });
  }

  function removeFromCart(indexToRemove) {
    setCart((prevCart) =>
      prevCart.filter((_, index) => index !== indexToRemove),
    );
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
}
