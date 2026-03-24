// components/itemCardDetails.jsx
import React from "react";
import { useNotification } from "../context/notificationContext";

export default function ItemCardDetails({ product, onClose, addToCart }) {
  const [quantity, setQuantity] = React.useState(1);
  const { showNotification } = useNotification();

  function plus() {
    setQuantity((q) => q + 1);
  }

  function minus() {
    setQuantity((q) => Math.max(1, q - 1));
  }

  function handleAddToCart() {
    addToCart({ ...product, quantity: quantity });
    showNotification(
      `${quantity} × ${product.title} added to cart!`,
      "success",
    );
    console.log(
      `${product.title} has been added to cart. It costs $${
        product.price * quantity
      }. It was added ${quantity} times`,
    );
    onClose();
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>

        <img src={product.thumbnail} alt={product.title} />
        <h2>{product.title}</h2>
        <p>${product.price}</p>
        <p>{product.description}</p>

        <div className="detail-buttons">
          <button className="quant-btn" onClick={minus}>
            {" "}
            -{" "}
          </button>
          <button className="add-to-cart-btn" onClick={handleAddToCart}>
            Add ( {quantity} ) to Cart 🛒
          </button>
          <button className="quant-btn" onClick={plus}>
            {" "}
            +{" "}
          </button>
        </div>
      </div>
    </div>
  );
}
