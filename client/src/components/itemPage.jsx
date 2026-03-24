// components/itemPage.jsx
import React, { useState, useEffect, useContext, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useNotification } from "../context/notificationContext";
import { CartContext } from "../context/cartContext";

export default function ItemPage() {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [product, setProduct] = useState(null);

  const { showNotification } = useNotification();
  const { addToCart } = useContext(CartContext);
  const { itemId } = useParams();
  const navigate = useNavigate();

  // Memoize the fetch function to prevent unnecessary rerenders
  const fetchProductDetails = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`https://dummyjson.com/products/${itemId}`);

      if (!res.ok) {
        throw new Error("Product not found");
      }

      const data = await res.json();
      setProduct(data);
      setError("");
    } catch (err) {
      setError("Failed to load product ❌");
      showNotification("Failed to load product ❌", "error");
    } finally {
      setLoading(false);
    }
  }, [itemId]); // Only rerun when itemId changes

  // Fetch product details
  useEffect(() => {
    if (itemId) {
      fetchProductDetails();
    }
  }, [itemId, fetchProductDetails]); // Now includes fetchProductDetails

  function plus() {
    setQuantity((q) => q + 1);
  }

  function minus() {
    setQuantity((q) => Math.max(1, q - 1));
  }

  // components/itemPage.jsx - in handleAddToCart
  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
    showNotification(
      `${quantity} × ${product.title} added to cart!`,
      "success",
    );
    // addToCart now handles the backend API call
  };

  if (loading) {
    return (
      <div className="item-loading">
        <h2>Loading product details...</h2>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="item-error">
        <h2>{error || "Product not found"}</h2>
        <button onClick={() => navigate("/")} className="item-error-btn">
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="item-page">
      <div className="item-container">
        {/* Back button */}
        <button onClick={() => navigate(-1)} className="item-back-btn">
          ← Back
        </button>

        {/* Product image */}
        <img
          src={product.thumbnail}
          alt={product.title}
          className="item-image"
        />

        <h1 className="item-title">{product.title}</h1>
        <p className="item-price">${product.price}</p>
        <p className="item-description">{product.description}</p>

        {/* Quantity and Add to Cart */}
        <div className="item-actions">
          <button
            onClick={minus}
            className="item-quantity-btn"
            aria-label="Decrease quantity"
          >
            -
          </button>

          <span className="item-quantity-display">{quantity}</span>

          <button
            onClick={plus}
            className="item-quantity-btn"
            aria-label="Increase quantity"
          >
            +
          </button>

          <button onClick={handleAddToCart} className="item-add-to-cart">
            Add to Cart 🛒 ({quantity})
          </button>
        </div>
      </div>
    </div>
  );
}
