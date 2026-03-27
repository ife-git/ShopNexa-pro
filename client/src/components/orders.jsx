// pages/Orders.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // Add useNavigate import
import { API_URL } from "../config";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Add this line

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_URL}/api/orders`, {
        credentials: "include",
      });
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      pending: "🟡",
      processing: "🔵",
      shipped: "🟠",
      delivered: "✅",
      cancelled: "❌",
    };
    return `${colors[status] || "⚪"} ${status}`;
  };

  if (loading) return <div className="loading">Loading orders...</div>;

  return (
    <div className="orders-page">
      <h1>My Orders</h1>

      {orders.length === 0 ? (
        <div className="no-orders">
          <p>You haven't placed any orders yet.</p>
          <Link to="/" className="shop-btn">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div
              key={order._id}
              className="order-card"
              onClick={() => navigate(`/order-receipt/${order._id}`)}
              style={{ cursor: "pointer" }}
            >
              <div className="order-header">
                <h3>Order #{order._id.slice(-8)}</h3>
                <span className="order-status">
                  {getStatusBadge(order.status)}
                </span>
              </div>

              <p className="order-date">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>

              <div className="order-items">
                {order.items.map((item, i) => (
                  <div key={i} className="order-item">
                    <img src={item.thumbnail} alt={item.title} />
                    <span>
                      {item.title} x{item.quantity}
                    </span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="order-footer">
                <strong>Total: ${order.totalAmount.toFixed(2)}</strong>
                {order.status === "pending" && (
                  <button className="cancel-order">Cancel</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
