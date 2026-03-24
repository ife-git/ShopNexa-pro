// server/models/CartItem.js
import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productId: {
      type: Number, // DummyJSON uses numbers, not ObjectId
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    description: String,
    category: String,
    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity cannot be less than 1"],
      default: 1,
    },
  },
  {
    timestamps: true,
  },
);

// Ensure one user can't have duplicate products in cart - using productId
cartItemSchema.index({ user: 1, productId: 1 }, { unique: true });

export default mongoose.model("CartItem", cartItemSchema);
