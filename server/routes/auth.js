// routes/auth.js
import {
  registerUser,
  loginUser,
  logoutUser,
} from "../controller/authController.js";
import express from "express";

export const authRouter = express.Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.get("/logout", logoutUser);

// Add this missing endpoint
authRouter.get("/me", (req, res) => {
  if (!req.session.userId) {
    return res.json({ isLoggedIn: false });
  }

  // You could also fetch user details from database
  res.json({
    isLoggedIn: true,
    userId: req.session.userId,
    // Add more user details if needed
  });
});
