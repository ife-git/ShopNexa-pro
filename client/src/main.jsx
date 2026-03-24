import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import NotificationProvider from "./context/notificationContext.jsx";
import CartContext from "./context/cartContext.jsx";
import AuthProvider from "./context/authContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <NotificationProvider>
      <CartContext>
        <AuthProvider>
          <App />
        </AuthProvider>
      </CartContext>
    </NotificationProvider>
  </StrictMode>,
);
