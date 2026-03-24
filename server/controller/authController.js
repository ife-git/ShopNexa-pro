import User from "../models/User.js";
import validator from "validator";
import bcrypt from "bcryptjs";

// @desc    Register a new user
// @route   POST /api/auth/register
export async function registerUser(req, res) {
  let { name, email, username, password } = req.body;

  // Validation
  if (!name || !email || !username || !password) {
    return res.status(400).json({ error: "All fields are required." });
  }

  name = name.trim();
  email = email.trim().toLowerCase(); // Store emails in lowercase for consistency
  username = username.trim();

  // Username format validation
  if (!/^[a-zA-Z0-9_-]{1,20}$/.test(username)) {
    return res.status(400).json({
      error:
        "Username must be 1–20 characters, using letters, numbers, _ or -.",
    });
  }

  // Email validation
  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  // Password strength check
  if (password.length < 6) {
    return res
      .status(400)
      .json({ error: "Password must be at least 6 characters" });
  }

  try {
    // Check if user already exists - MongoDB way
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        error: "Email or username already in use.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user in MongoDB
    const user = await User.create({
      name,
      email,
      username,
      password: hashedPassword,
    });

    // Set session with MongoDB's _id
    req.session.userId = user._id;

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Registration error:", err.message);
    res.status(500).json({ error: "Registration failed. Please try again." });
  }
}

// @desc    Login user
// @route   POST /api/auth/login
export async function loginUser(req, res) {
  let { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  username = username.trim();

  try {
    // Find user by username - MongoDB way
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Compare passwords
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Set session with MongoDB's _id
    req.session.userId = user._id;

    res.json({
      message: "Logged in successfully",
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ error: "Login failed. Please try again." });
  }
}

// @desc    Logout user
// @route   GET /api/auth/logout
export async function logoutUser(req, res) {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).json({ error: "Logout failed" });
    }
    res.clearCookie("connect.sid"); // Clear the session cookie
    res.json({ message: "Logged out successfully" });
  });
}
