// pages/OrderReceipt.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useNotification } from "../context/notificationContext";
import { API_URL } from "../config";

export default function OrderReceipt() {
  const { orderId } = useParams();
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`${API_URL}/api/orders/${orderId}`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Order not found");
      }

      const data = await response.json();
      setOrder(data);
    } catch (error) {
      showNotification("Failed to load order details", "error");
      navigate("/orders");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <div className="loading-spinner">Loading receipt...</div>;
  }

  if (!order) {
    return <div>Order not found</div>;
  }

  return (
    <div className="receipt-container">
      <div className="receipt-actions no-print">
        <button onClick={() => navigate("/")} className="continue-btn">
          ← Continue Shopping
        </button>
        <button onClick={handlePrint} className="print-btn">
          🖨️ Print Receipt
        </button>
      </div>

      <div className="receipt-card">
        {/* Header */}
        <div className="receipt-header">
          <h1>ShopNexa</h1>
          <p className="receipt-title">Order Confirmed! 🎉</p>
        </div>

        {/* Order Info */}
        <div className="receipt-info">
          <div className="info-row">
            <span>Order Number:</span>
            <strong>#{order._id.slice(-8).toUpperCase()}</strong>
          </div>
          <div className="info-row">
            <span>Date:</span>
            <strong>{new Date(order.createdAt).toLocaleDateString()}</strong>
          </div>
          <div className="info-row">
            <span>Customer:</span>
            <strong>{user?.name || "Valued Customer"}</strong>
          </div>
          <div className="info-row">
            <span>Email:</span>
            <strong>{order.email}</strong>
          </div>
          <div className="info-row">
            <span>Status:</span>
            <strong className={`status-badge ${order.status}`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </strong>
          </div>
        </div>

        {/* Items Table */}
        <div className="receipt-items">
          <h3>Order Items</h3>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, index) => (
                <tr key={index}>
                  <td className="item-info">
                    <img src={item.thumbnail} alt={item.title} />
                    <span>{item.title}</span>
                  </td>
                  <td>{item.quantity}</td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3" className="total-label">
                  Subtotal:
                </td>
                <td>${order.totalAmount.toFixed(2)}</td>
              </tr>
              <tr>
                <td colSpan="3" className="total-label">
                  Shipping:
                </td>
                <td>$0.00</td>
              </tr>
              <tr className="grand-total">
                <td colSpan="3" className="total-label">
                  Total:
                </td>
                <td>${order.totalAmount.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Footer Message */}
        <div className="receipt-footer">
          <p className="thank-you-message">
            🎉 Thank you for your order, {user?.name || "Valued Customer"}!
          </p>
          <p className="shipping-message">
            Your order is confirmed and will be processed shortly. We'll notify
            you when it's on its way.
          </p>
          <p className="help-message">
            Questions? <Link to="/contact">Contact our support team</Link>
          </p>
        </div>

        {/* Decorative Border */}
        <div className="receipt-divider">
          <span>✦</span>
          <span>✦</span>
          <span>✦</span>
        </div>

        <p className="receipt-note">
          This is your official order receipt. Keep it for your records.
        </p>
      </div>
    </div>
  );
}
