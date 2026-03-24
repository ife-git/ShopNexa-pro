import User from "../models/User.js";

// @desc    Get current logged-in user info
// @route   GET /api/auth/me
export async function getCurrentUser(req, res) {
  try {
    // Check if user is logged in
    if (!req.session.userId) {
      return res.json({ isLoggedIn: false });
    }

    // Find user by ID (MongoDB way)
    const user = await User.findById(req.session.userId).select(
      "name email username",
    );

    if (!user) {
      // User ID in session but no user in database? Clear session
      req.session.destroy();
      return res.json({ isLoggedIn: false });
    }

    res.json({
      isLoggedIn: true,
      name: user.name,
      email: user.email,
      username: user.username,
      id: user._id,
    });
  } catch (err) {
    console.error("getCurrentUser error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
