// server/controllers/cartController.js
import CartItem from "../models/CartItem.js";
import User from "../models/User.js";

// @desc    Add item to cart (or increment quantity)
export async function addToCart(req, res) {
  try {
    console.log("========== ADD TO CART ==========");
    console.log("1. Request body:", req.body);

    const { productId, quantity = 1 } = req.body;
    const userId = req.session.userId;

    console.log("2. User ID:", userId);
    console.log("3. Product ID:", productId);
    console.log("4. Quantity:", quantity);

    if (!userId) {
      console.log("❌ No user ID");
      return res.status(401).json({ error: "Not authenticated" });
    }

    if (!productId) {
      console.log("❌ No product ID");
      return res.status(400).json({ error: "Product ID is required" });
    }

    // Fetch product details from DummyJSON
    console.log("5. Fetching from DummyJSON...");
    const productRes = await fetch(
      `https://dummyjson.com/products/${productId}`,
    );

    console.log("6. DummyJSON response status:", productRes.status);

    if (!productRes.ok) {
      console.log("❌ Product not found on DummyJSON");
      return res.status(404).json({ error: "Product not found" });
    }

    const product = await productRes.json();
    console.log("7. Product found:", product.title);

    // Check if item already in cart
    console.log("8. Checking existing cart item...");
    let cartItem = await CartItem.findOne({
      user: userId,
      productId: productId,
    });

    if (cartItem) {
      console.log("9. Existing cart item found, quantity:", cartItem.quantity);
      cartItem.quantity += quantity;
      await cartItem.save();
      console.log("10. Updated quantity to:", cartItem.quantity);
    } else {
      console.log("9. Creating new cart item...");
      cartItem = await CartItem.create({
        user: userId,
        productId: productId,
        title: product.title,
        price: product.price,
        thumbnail: product.thumbnail,
        description: product.description,
        category: product.category,
        quantity: quantity,
      });
      console.log("10. Created new cart item with ID:", cartItem._id);
    }

    console.log("✅ SUCCESS!");
    console.log("================================");

    res.json({
      message: "Added to cart",
      cartItem: {
        id: cartItem._id,
        quantity: cartItem.quantity,
      },
    });
  } catch (err) {
    console.error("❌ Add to cart error:", err);
    console.error("Error stack:", err.stack);
    res
      .status(500)
      .json({ error: "Failed to add item to cart: " + err.message });
  }
}

// ... rest of your functions

// @desc    Get total item count for cart icon
export async function getCartCount(req, res) {
  try {
    const userId = req.session.userId;
    const cartItems = await CartItem.find({ user: userId });

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    res.json({ totalItems });
  } catch (err) {
    console.error("Get cart count error:", err);
    res.status(500).json({ error: "Failed to get cart count" });
  }
}

// @desc    Get all cart items with product details
export async function getAll(req, res) {
  try {
    const userId = req.session.userId;

    const cartItems = await CartItem.find({ user: userId }).sort({
      createdAt: -1,
    });

    const items = cartItems.map((item) => ({
      cartItemId: item._id,
      productId: item.productId,
      title: item.title,
      price: item.price,
      quantity: item.quantity,
      thumbnail: item.thumbnail,
      description: item.description,
      category: item.category,
    }));

    res.json({ items });
  } catch (err) {
    console.error("Get cart error:", err);
    res.status(500).json({ error: "Failed to get cart items" });
  }
}

// @desc    Delete single item from cart
export async function deleteItem(req, res) {
  try {
    const itemId = req.params.itemId;
    const userId = req.session.userId;

    const result = await CartItem.findOneAndDelete({
      _id: itemId,
      user: userId,
    });

    if (!result) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    res.status(204).send();
  } catch (err) {
    console.error("Delete item error:", err);
    res.status(500).json({ error: "Failed to delete item" });
  }
}

// @desc    Clear all items from cart
export async function deleteAll(req, res) {
  try {
    const userId = req.session.userId;
    await CartItem.deleteMany({ user: userId });
    res.status(204).send();
  } catch (err) {
    console.error("Clear cart error:", err);
    res.status(500).json({ error: "Failed to clear cart" });
  }
}
