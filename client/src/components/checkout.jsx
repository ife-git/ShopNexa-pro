// pages/Checkout.jsx
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/cartContext";
import { useAuth } from "../context/authContext";
import { useNotification } from "../context/notificationContext";
import { API_URL } from "../config"; // ← ADD THIS IMPORT

export default function Checkout() {
  const { cart, clearCart } = useContext(CartContext);
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const [processing, setProcessing] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePlaceOrder = async () => {
    setProcessing(true);

    try {
      // CHANGE THIS:
      // const response = await fetch("/api/orders/checkout", {

      // TO THIS:
      const response = await fetch(`${API_URL}/api/orders/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        clearCart();
        showNotification("✅ Order placed successfully!", "success");
        navigate(`/order-receipt/${data.order.id}`);
      } else {
        showNotification("❌ Checkout failed: " + data.error, "error");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      showNotification("❌ Failed to process order", "error");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

      <div className="checkout-grid">
        <div className="order-summary">
          <h2>Order Summary</h2>
          {cart.map((item) => (
            <div key={item.id} className="checkout-item">
              <img src={item.thumbnail} alt={item.title} />
              <div>
                <h4>{item.title}</h4>
                <p>Qty: {item.quantity}</p>
              </div>
              <p>${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
          <div className="checkout-total">
            <h3>Total: ${total.toFixed(2)}</h3>
          </div>
        </div>

        <div className="payment-section">
          <h2>Payment Details</h2>
          <p className="demo-note">🔧 Demo - No payment processing yet</p>

          <button
            className="place-order-btn"
            onClick={handlePlaceOrder}
            disabled={processing}
          >
            {processing ? "Processing..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
}
