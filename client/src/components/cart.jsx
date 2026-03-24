// components/cart.jsx
import React from "react";
import { useNavigate } from "react-router-dom"; // ADD THIS
import { useNotification } from "../context/notificationContext";
import { useAuth } from "../context/authContext"; // ADD THIS

export default function Cart({ cartItems, removeFromCart }) {
  const { showNotification } = useNotification();
  const { user } = useAuth(); // ADD THIS
  const navigate = useNavigate(); // ADD THIS

  const handleRemove = (item, index) => {
    removeFromCart(index);
    showNotification(`🗑 ${item.title} removed from cart`, "info");
  };

  const handleCheckout = () => {
    if (!user) {
      showNotification("Please login to checkout", "info");
      navigate("/login");
      return;
    }

    if (cartItems.length === 0) {
      showNotification("Your cart is empty", "info");
      return;
    }

    navigate("/checkout");
  };

  const total = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  return (
    <>
      <h1>🛒 Shopping Cart</h1>

      {cartItems.length === 0 && (
        <div className="cart-message">
          <p>Your added items will appear here.</p>
        </div>
      )}

      {cartItems.length > 0 && (
        <>
          <div className="cart-display">
            {cartItems.map((item, index) => (
              <div className="cart-cards" key={item.id}>
                <div className="quantity-badge">{item.quantity}</div>
                <img src={item.thumbnail} alt={item.title} />
                <h3>{item.title}</h3>
                <p>${item.price}</p>

                <button
                  className="remove-from-cart"
                  onClick={() => handleRemove(item, index)}
                >
                  🗑 Remove
                </button>
              </div>
            ))}
          </div>

          <div className="cart-footer">
            <h2 className="total-price">🧾 Total: ${total.toFixed(2)}</h2>

            <button
              className="checkout-btn"
              onClick={handleCheckout}
              disabled={cartItems.length === 0}
            >
              Proceed to Checkout 🚀
            </button>
          </div>
        </>
      )}
    </>
  );
}
