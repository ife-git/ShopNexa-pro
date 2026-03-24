// client/src/config.js
export const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? "https://shopnexa-pro.onrender.com" // ← Changed to match your actual URL
    : "http://localhost:8000"); // ← Also change to port 8000 (your backend runs on 8000)
console.log("🌐 API URL:", API_URL);
