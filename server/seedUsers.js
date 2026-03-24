// server/seed-users.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import dns from "dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

const testUsers = [
  {
    name: "Test User",
    email: "test@example.com",
    username: "testuser",
    password: "password123",
  },
  {
    name: "John Doe",
    email: "john@example.com",
    username: "johndoe",
    password: "password123",
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    username: "janesmith",
    password: "password123",
  },
];

async function seedUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Hash passwords
    const usersWithHashedPasswords = await Promise.all(
      testUsers.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10),
      })),
    );

    // Clear existing users (optional)
    await User.deleteMany({});
    console.log("✅ Cleared existing users");

    // Insert new users
    const inserted = await User.insertMany(usersWithHashedPasswords);
    console.log(`✅ Added ${inserted.length} test users`);

    console.log("\n📊 Test Users Created:");
    inserted.forEach((user, i) => {
      console.log(`${i + 1}. ${user.name} (@${user.username}) - ${user.email}`);
    });
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("\n👋 Disconnected from MongoDB");
    process.exit(0);
  }
}

seedUsers();
