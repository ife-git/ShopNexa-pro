import React, { useState, useEffect } from "react";
import ItemCard from "./itemCard";
import ItemCardDetails from "./itemCardDetails";

export default function Main({ searchTerm, selectedCategory, addToCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  /* ================= SINGLE FETCH LOGIC ================= */
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setNoResults(false);

      try {
        let url = "https://dummyjson.com/products";

        if (searchTerm.trim() !== "") {
          url = `https://dummyjson.com/products/search?q=${searchTerm}`;
        } else if (selectedCategory !== "") {
          url = `https://dummyjson.com/products/category/${selectedCategory}`;
        }

        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();

        setProducts(data.products);
        setNoResults(data.products.length === 0);
      } catch (err) {
        console.error("Error fetching products:", err);
        setNoResults(true);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [searchTerm, selectedCategory]);

  /* ================= PRODUCT CLICK ================= */
  async function handleProductClick(id) {
    const res = await fetch(`https://dummyjson.com/products/${id}`);
    const item = await res.json();
    setSelectedProduct(item);
  }

  function closeModal() {
    setSelectedProduct(null);
  }

  return (
    <>
      {loading && <h2 style={{ textAlign: "center" }}>Loading...</h2>}

      {!loading && noResults && (
        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <h2>Sorry, no product found ❌</h2>
          <p style={{ color: "#666" }}>
            Try checking your spelling or searching something else.
          </p>
        </div>
      )}

      {!loading && products.length > 0 && (
        <div className="products-grid">
          {products.map((p) => (
            <ItemCard
              key={p.id}
              id={p.id}
              title={p.title}
              price={p.price}
              image={p.thumbnail}
              onClick={() => handleProductClick(p.id)}
            />
          ))}
        </div>
      )}

      {selectedProduct && (
        <ItemCardDetails
          product={selectedProduct}
          onClose={closeModal}
          addToCart={addToCart}
        />
      )}
    </>
  );
}
