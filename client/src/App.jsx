// App.jsx
import React, { useState, useEffect, useContext } from "react";
import "./App.css";
import Main from "./components/main";
import Contact from "./components/contact";
import Cart from "./components/cart";
import Logo from "./assets/Shop-Nexa-logo.png";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Notification from "./components/notification";
import ItemPage from "./components/itemPage";
import Login from "./components/login";
import Signup from "./components/signUp";
import { CartContext } from "./context/cartContext";
import { useAuth } from "./context/authContext";
import Checkout from "./components/checkout";
import Orders from "./components/orders";
import OrderReceipt from "./components/orderReceipt";

export default function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { cart, addToCart, removeFromCart } = useContext(CartContext);
  const { user, logout, loading } = useAuth();

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isMobileMenuOpen && !e.target.closest(".hamburger-menu")) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isMobileMenuOpen]);

  // Fetch categories on load (ONLY ONCE)
  useEffect(() => {
    async function fetchCategories() {
      const res = await fetch("https://dummyjson.com/products/categories");
      const data = await res.json();
      setCategories(data);
    }
    fetchCategories();
  }, []);

  const handleLogout = () => {
    logout();
  };

  // SINGLE FUNCTION for clearing search and category
  const handleHomeClick = () => {
    setSearchTerm(""); // Clears search
    setSelectedCategory(""); // Clears category filter
    // No fetchCategories needed! Main component will re-render automatically
  };

  return (
    <Router>
      <div className="button-container">
        <div className="navbar">
          {/* LEFT */}
          <div className="nav-left">
            <div className="home-icon" onClick={handleHomeClick}>
              <Link to="/" style={{ display: "contents" }}>
                <img src={Logo} alt="Shop Nexa" className="logo-img" />
              </Link>
            </div>
            <h1 className="site-title" onClick={handleHomeClick}>
              <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
                ShopNexa
              </Link>
            </h1>
          </div>

          {/* CENTER */}
          <div className="nav-center">
            {/* Desktop links: Home, Contact */}
            <div className="desktop-nav">
              <Link to="/" className="button" onClick={handleHomeClick}>
                Home
              </Link>
              <Link to="/Contact" className="button">
                Contact
              </Link>
            </div>

            {/* Categories (desktop only) */}
            <div className="category-menu desktop-only">
              <button className="category-btn">
                {selectedCategory
                  ? categories.find((c) => c.slug === selectedCategory)?.name
                  : "Categories"}
                ▾
              </button>

              <div className="category-dropdown">
                <div
                  className="category-item"
                  onClick={() => setSelectedCategory("")}
                >
                  All Products
                </div>

                {categories.map((cat) => (
                  <div
                    key={cat.slug}
                    className="category-item"
                    onClick={() => setSelectedCategory(cat.slug)}
                  >
                    {cat.name}
                  </div>
                ))}
              </div>
            </div>

            {/* Cart (desktop only) */}
            <div className="desktop-nav">
              <Link to="/Cart" className="button">
                Cart {cart.length > 0 && `(${cart.length})`}
              </Link>
            </div>

            {/* Search (always visible) */}
            <input
              type="text"
              placeholder="🔎 Search products…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-bar"
            />
          </div>

          {/* RIGHT */}
          <div className="nav-right">
            {/* Auth Buttons - Desktop */}
            <div className="desktop-auth">
              {!loading && (
                <>
                  {user ? (
                    <div className="user-info">
                      <span className="welcome-text">
                        Hi, {user.name || user.username}
                      </span>
                      <button
                        onClick={handleLogout}
                        className="button logout-btn"
                      >
                        Logout
                      </button>
                    </div>
                  ) : (
                    <>
                      <Link to="/login" className="button">
                        Login
                      </Link>
                      <Link to="/signup" className="button">
                        Sign Up
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>

            {/* Hamburger */}
            <div className="hamburger-menu">
              <button
                className="hamburger-btn"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                ☰
              </button>

              {isMobileMenuOpen && (
                <div className="mobile-menu">
                  <Link
                    to="/"
                    className="button"
                    onClick={() => {
                      handleHomeClick();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Home
                  </Link>
                  <Link
                    to="/Contact"
                    className="button"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Contact
                  </Link>
                  <Link
                    to="/Cart"
                    className="button"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Cart {cart.length > 0 && `(${cart.length})`}
                  </Link>

                  {/* Mobile Auth Links */}
                  {!loading && (
                    <>
                      {user ? (
                        <>
                          <span className="mobile-user-name">
                            Hi, {user.name || user.username}
                          </span>
                          <button
                            onClick={() => {
                              handleLogout();
                              setIsMobileMenuOpen(false);
                            }}
                            className="button mobile-logout-btn"
                          >
                            Logout
                          </button>
                        </>
                      ) : (
                        <>
                          <Link
                            to="/login"
                            className="button"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            Login
                          </Link>
                          <Link
                            to="/signup"
                            className="button"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            Sign Up
                          </Link>
                        </>
                      )}
                    </>
                  )}

                  <div className="mobile-category-menu">
                    <div className="mobile-category-header">Categories</div>
                    <div className="mobile-category-list">
                      <div
                        className="mobile-category-item"
                        onClick={() => {
                          setSelectedCategory("");
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        All Products
                      </div>

                      {categories.map((cat) => (
                        <div
                          key={cat.slug}
                          className="mobile-category-item"
                          onClick={() => {
                            setSelectedCategory(cat.slug);
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          {cat.name}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Notification />

      <Routes>
        <Route
          path="/"
          element={
            <Main
              searchTerm={searchTerm}
              selectedCategory={selectedCategory}
              cart={cart}
              addToCart={addToCart}
            />
          }
        />
        <Route path="/Contact" element={<Contact />} />
        <Route
          path="/Cart"
          element={<Cart cartItems={cart} removeFromCart={removeFromCart} />}
        />
        <Route path="/item/:itemId" element={<ItemPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/order-receipt/:orderId" element={<OrderReceipt />} />
      </Routes>
    </Router>
  );
}
