// server/server.js
import dns from "dns";
import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

// Import all routers
import { authRouter } from "./routes/auth.js";
import { productsRouter } from "./routes/product.js";
import { cartRouter } from "./routes/cart.js";
import { ordersRouter } from "./routes/order.js";

// FORCE GOOGLE DNS - fixes connection issues!
dns.setServers(["8.8.8.8", "8.8.4.4"]);

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config({ path: path.join(__dirname, ".env") });

// Connect to MongoDB
try {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("✅ MongoDB connected");

  // Drop old cartitems collection to fix index issue
  try {
    await mongoose.connection.collection("cartitems").drop();
    console.log("✅ Dropped old cartitems collection");
  } catch (err) {
    console.log("No old cartitems collection to drop");
  }

  // Handle connection events
  mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err);
  });

  mongoose.connection.on("disconnected", () => {
    console.log("MongoDB disconnected");
  });
} catch (error) {
  console.error("❌ MongoDB connection failed:", error);
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// server/server.js - Replace your current CORS setup with this:

// Configure CORS - MUST come before routes
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);

    // Allowed origins for production and development
    const allowedOrigins = [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://shopnexa.vercel.app", // Your Vercel frontend
      "https://shopnexa-git-main.vercel.app", // Vercel preview URLs
      "https://shopnexa-*.vercel.app", // All Vercel preview deployments
      "https://shopnexa-frontend.onrender.com", // ← ADD THIS LINE!
      "https://*.onrender.com",
    ];

    // Check if origin matches any allowed pattern
    const isAllowed = allowedOrigins.some((allowed) => {
      if (allowed.includes("*")) {
        // Handle wildcard patterns
        const pattern = allowed.replace("*", ".*");
        return new RegExp(pattern).test(origin);
      }
      return origin === allowed || origin.endsWith(allowed);
    });

    if (isAllowed) {
      callback(null, origin);
    } else {
      console.log("❌ CORS blocked origin:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  optionsSuccessStatus: 200,
};

// Trust proxy (for Render)
app.set("trust proxy", 1);

// Apply CORS
app.use(cors(corsOptions));

// Session setup - MUST come before routes
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: "sessions",
      touchAfter: 24 * 3600,
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  }),
);

// Static files
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));
} else {
  app.use(express.static(path.join(__dirname, "public")));
}

// Test route
app.get("/api/test", (req, res) => {
  res.json({
    message: "🚀 Backend is working!",
    timestamp: new Date().toISOString(),
    dns: "Google DNS forced (8.8.8.8, 8.8.4.4)",
  });
});

// ========== API ROUTES ==========
app.use("/api/auth", authRouter);
app.use("/api/products", productsRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", ordersRouter);

// API info route
app.get("/api", (req, res) => {
  res.status(200).json({
    message: "ShopNexa API",
    endpoints: ["/auth", "/products", "/cart", "/orders"],
    documentation: "Visit /api/test for server status",
  });
});

// 404 handler for API routes
app.use("/api", (req, res) => {
  res.status(404).json({ error: "API route not found" });
});

// Handle React routing in production
// Handle React routing in production
// Handle React routing in production
if (process.env.NODE_ENV === "production") {
  // Serve index.html for any non-API request
  app.use((req, res, next) => {
    // Skip if it's an API request
    if (req.path.startsWith("/api")) {
      return next();
    }
    // Skip if it's a static file (has extension)
    if (req.path.includes(".")) {
      return next();
    }
    // Serve index.html for all other routes
    res.sendFile(path.join(__dirname, "../client/dist/index.html"));
  });
} else {
  app.use((req, res) => {
    if (req.path.startsWith("/api")) {
      res.status(404).json({ error: "API route not found" });
    } else {
      res.status(404).json({ error: "Route not found" });
    }
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("❌ Server error:", err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`📝 Registered routes:`);
  console.log(`   - Auth: /api/auth`);
  console.log(`   - Products: /api/products`);
  console.log(`   - Cart: /api/cart`);
  console.log(`   - Orders: /api/orders`);
  console.log(`🔧 DNS: Forced Google DNS (8.8.8.8, 8.8.4.4)`);
});
