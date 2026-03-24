// server/routes/orders.js
import express from "express";
import {
  checkout,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
} from "../controller/orderController.js";
import { requireAuth } from "../middleware/requireAuth.js";

export const ordersRouter = express.Router();

// All order routes require authentication
ordersRouter.use(requireAuth);

// Checkout - create order from cart
ordersRouter.post("/checkout", checkout);

// Get all user orders
ordersRouter.get("/", getUserOrders);

// Get single order by ID
ordersRouter.get("/:orderId", getOrderById);

// Cancel order (if pending)
ordersRouter.post("/:orderId/cancel", cancelOrder);

// Admin only - update order status
ordersRouter.patch("/:orderId/status", updateOrderStatus);
