// client/src/config.js
export const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? "https://shopnexa-backend.onrender.com"
    : "http://localhost:5000");
console.log("🌐 API URL:", API_URL);
