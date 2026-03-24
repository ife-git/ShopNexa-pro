// server/controllers/orderController.js
import Order from "../models/Order.js";
import CartItem from "../models/CartItem.js";
import User from "../models/User.js";

// @desc    Create order from cart (checkout)
export async function checkout(req, res) {
  try {
    const userId = req.session.userId;

    console.log("========== CHECKOUT ==========");
    console.log("1. User ID:", userId);

    // Get user info
    const user = await User.findById(userId);
    if (!user || !user.email) {
      console.log("❌ User not found or no email");
      return res.status(400).json({ error: "User email not found" });
    }
    console.log("2. User email:", user.email);

    // Get cart items from database
    const cartItems = await CartItem.find({ user: userId });
    console.log("3. Cart items found:", cartItems.length);

    if (cartItems.length === 0) {
      console.log("❌ Cart is empty");
      return res.status(400).json({ error: "Cart is empty" });
    }

    // Log cart items
    cartItems.forEach((item) => {
      console.log(`   - ${item.title}: ${item.quantity} x $${item.price}`);
    });

    // Calculate total and format items for order
    let totalAmount = 0;
    const orderItems = cartItems.map((item) => {
      const itemTotal = item.price * item.quantity;
      totalAmount += itemTotal;

      return {
        productId: item.productId,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        thumbnail: item.thumbnail,
      };
    });

    console.log("4. Total amount:", totalAmount);

    // Create the order
    const order = await Order.create({
      user: userId,
      items: orderItems,
      totalAmount,
      email: user.email,
      status: "pending",
    });
    console.log("5. Order created with ID:", order._id);

    // Clear the cart
    await CartItem.deleteMany({ user: userId });
    console.log("6. Cart cleared");

    console.log("✅ Checkout successful!");
    console.log("===============================");

    res.status(201).json({
      message: "Order placed successfully",
      order: {
        id: order._id,
        totalAmount: order.totalAmount,
        items: order.items.length,
        status: order.status,
      },
    });
  } catch (err) {
    console.error("❌ Checkout error:", err);
    console.error("Error stack:", err.stack);
    res
      .status(500)
      .json({ error: "Failed to process checkout: " + err.message });
  }
}

// Keep other functions (getUserOrders, getOrderById, etc.)

// @desc    Get all orders for logged-in user
export async function getUserOrders(req, res) {
  try {
    const userId = req.session.userId;

    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .select("-__v");

    res.json({
      count: orders.length,
      orders: orders,
    });
  } catch (err) {
    console.error("Get orders error:", err.message);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
}

// @desc    Get single order by ID
export async function getOrderById(req, res) {
  try {
    const { orderId } = req.params;
    const userId = req.session.userId;

    const order = await Order.findOne({
      _id: orderId,
      user: userId,
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    console.error("Get order error:", err.message);
    res.status(500).json({ error: "Failed to fetch order" });
  }
}

// @desc    Update order status (admin only)
export async function updateOrderStatus(req, res) {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true },
    );

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({
      message: "Order status updated",
      order: {
        id: order._id,
        status: order.status,
      },
    });
  } catch (err) {
    console.error("Update order error:", err.message);
    res.status(500).json({ error: "Failed to update order" });
  }
}

// @desc    Cancel order (if still pending)
export async function cancelOrder(req, res) {
  try {
    const { orderId } = req.params;
    const userId = req.session.userId;

    const order = await Order.findOne({ _id: orderId, user: userId });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (order.status !== "pending") {
      return res.status(400).json({
        error: "Cannot cancel order that is already processing or shipped",
      });
    }

    order.status = "cancelled";
    await order.save();

    res.json({
      message: "Order cancelled successfully",
      order: {
        id: order._id,
        status: order.status,
      },
    });
  } catch (err) {
    console.error("Cancel order error:", err.message);
    res.status(500).json({ error: "Failed to cancel order" });
  }
}
