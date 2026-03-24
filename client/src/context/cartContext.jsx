// client/src/context/cartContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";

export const CartContext = createContext();

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

export default function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load cart from backend when user logs in or page loads
  useEffect(() => {
    fetchCart();
  }, []);

  // Fetch cart from backend
  const fetchCart = async () => {
    try {
      const response = await fetch("/api/cart", {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        // Convert backend cart format to frontend format
        const formattedCart = data.items.map((item) => ({
          id: item.productId,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          thumbnail: item.thumbnail,
          description: item.description,
          category: item.category,
        }));
        setCart(formattedCart);
      }
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    } finally {
      setLoading(false);
    }
  };

  // Add to cart - sync with backend
  const addToCart = async (item) => {
    try {
      const response = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          productId: item.id,
          quantity: item.quantity || 1,
        }),
      });

      if (response.ok) {
        // Refetch cart to get updated state
        await fetchCart();
      }
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  // Remove from cart - sync with backend
  const removeFromCart = async (indexToRemove) => {
    const itemToRemove = cart[indexToRemove];
    if (!itemToRemove) return;

    try {
      // First, get the cart item ID from backend
      const cartResponse = await fetch("/api/cart", { credentials: "include" });
      const cartData = await cartResponse.json();
      const backendItem = cartData.items.find(
        (item) => item.productId === itemToRemove.id,
      );

      if (backendItem) {
        await fetch(`/api/cart/${backendItem.cartItemId}`, {
          method: "DELETE",
          credentials: "include",
        });
        await fetchCart(); // Refetch after removal
      }
    } catch (error) {
      console.error("Failed to remove from cart:", error);
    }
  };

  // Clear cart - sync with backend
  const clearCart = async () => {
    try {
      await fetch("/api/cart/all", {
        method: "DELETE",
        credentials: "include",
      });
      setCart([]); // Clear local state
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, loading, addToCart, removeFromCart, clearCart, fetchCart }}
    >
      {children}
    </CartContext.Provider>
  );
}
