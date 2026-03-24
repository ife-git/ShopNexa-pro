// components/itemCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function ItemCard({ title, price, image, id }) {
  const navigate = useNavigate();

  return (
    <div
      className="item-cards"
      onClick={() => navigate(`/item/${id}`)}
      style={{ cursor: "pointer" }}
    >
      <img src={image} alt={title} />
      <h3>{title}</h3>
      <p>${price}</p>
    </div>
  );
}
