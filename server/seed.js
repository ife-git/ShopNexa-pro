import dns from "dns";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Product from "./models/Product.js";

// FORCE GOOGLE DNS - fixes connection issues
dns.setServers(["8.8.8.8", "8.8.4.4"]);

// Test DNS resolution
dns.resolve("spiral-sounds.rto9wd2.mongodb.net", (err, addr) => {
  console.log("DNS Test:", err ? "❌ Failed" : "✅ Success", addr);
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

// Product data for ShopNexa - matching your Product schema
const productData = [
  // Electronics
  {
    title: "Wireless Noise-Cancelling Headphones",
    description:
      "Premium over-ear headphones with active noise cancellation, 30-hour battery life, and crystal clear sound quality.",
    price: 249.99,
    discountPercentage: 15,
    rating: 4.7,
    stock: 45,
    brand: "SoundMaster",
    category: "electronics",
    thumbnail:
      "https://cdn.dummyjson.com/products/images/electronics/headphones/1.jpg",
    images: [
      "https://cdn.dummyjson.com/products/images/electronics/headphones/1.jpg",
      "https://cdn.dummyjson.com/products/images/electronics/headphones/2.jpg",
    ],
  },
  {
    title: "Ultra HD 4K Smart TV - 55 Inch",
    description:
      "Experience stunning 4K resolution with HDR, built-in streaming apps, and voice control compatibility.",
    price: 599.99,
    discountPercentage: 10,
    rating: 4.5,
    stock: 23,
    brand: "VisionTech",
    category: "electronics",
    thumbnail: "https://cdn.dummyjson.com/products/images/electronics/tv/1.jpg",
    images: [
      "https://cdn.dummyjson.com/products/images/electronics/tv/1.jpg",
      "https://cdn.dummyjson.com/products/images/electronics/tv/2.jpg",
    ],
  },
  {
    title: "Professional DSLR Camera",
    description:
      "24.2 megapixel DSLR with 4K video, Wi-Fi connectivity, and interchangeable lens system.",
    price: 899.99,
    discountPercentage: 5,
    rating: 4.8,
    stock: 12,
    brand: "PhotoPro",
    category: "electronics",
    thumbnail:
      "https://cdn.dummyjson.com/products/images/electronics/camera/1.jpg",
    images: [
      "https://cdn.dummyjson.com/products/images/electronics/camera/1.jpg",
      "https://cdn.dummyjson.com/products/images/electronics/camera/2.jpg",
    ],
  },

  // Smartphones
  {
    title: "Galaxy S24 Ultra",
    description:
      "Latest flagship smartphone with 200MP camera, S-Pen support, and all-day battery life.",
    price: 1199.99,
    discountPercentage: 8,
    rating: 4.9,
    stock: 34,
    brand: "Samsung",
    category: "smartphones",
    thumbnail:
      "https://cdn.dummyjson.com/products/images/smartphones/samsung/1.jpg",
    images: [
      "https://cdn.dummyjson.com/products/images/smartphones/samsung/1.jpg",
      "https://cdn.dummyjson.com/products/images/smartphones/samsung/2.jpg",
    ],
  },
  {
    title: "iPhone 15 Pro Max",
    description:
      "A17 Pro chip, titanium design, and pro camera system for the ultimate iPhone experience.",
    price: 1299.99,
    discountPercentage: 5,
    rating: 4.9,
    stock: 28,
    brand: "Apple",
    category: "smartphones",
    thumbnail:
      "https://cdn.dummyjson.com/products/images/smartphones/iphone/1.jpg",
    images: [
      "https://cdn.dummyjson.com/products/images/smartphones/iphone/1.jpg",
      "https://cdn.dummyjson.com/products/images/smartphones/iphone/2.jpg",
    ],
  },
  {
    title: "Pixel 8 Pro",
    description:
      "Google's AI-powered phone with advanced computational photography and 7 years of updates.",
    price: 999.99,
    discountPercentage: 10,
    rating: 4.7,
    stock: 19,
    brand: "Google",
    category: "smartphones",
    thumbnail:
      "https://cdn.dummyjson.com/products/images/smartphones/pixel/1.jpg",
    images: [
      "https://cdn.dummyjson.com/products/images/smartphones/pixel/1.jpg",
      "https://cdn.dummyjson.com/products/images/smartphones/pixel/2.jpg",
    ],
  },

  // Laptops
  {
    title: "MacBook Pro 16-inch",
    description:
      "M3 Max chip, 64GB unified memory, and stunning Liquid Retina XDR display for professionals.",
    price: 2499.99,
    discountPercentage: 5,
    rating: 4.9,
    stock: 15,
    brand: "Apple",
    category: "laptops",
    thumbnail:
      "https://cdn.dummyjson.com/products/images/laptops/macbook/1.jpg",
    images: [
      "https://cdn.dummyjson.com/products/images/laptops/macbook/1.jpg",
      "https://cdn.dummyjson.com/products/images/laptops/macbook/2.jpg",
    ],
  },
  {
    title: "ThinkPad X1 Carbon",
    description:
      "Ultra-light business laptop with military-grade durability and exceptional keyboard.",
    price: 1899.99,
    discountPercentage: 12,
    rating: 4.8,
    stock: 22,
    brand: "Lenovo",
    category: "laptops",
    thumbnail:
      "https://cdn.dummyjson.com/products/images/laptops/thinkpad/1.jpg",
    images: [
      "https://cdn.dummyjson.com/products/images/laptops/thinkpad/1.jpg",
      "https://cdn.dummyjson.com/products/images/laptops/thinkpad/2.jpg",
    ],
  },

  // Fragrances
  {
    title: "Midnight Essence",
    description:
      "Sophisticated woody and amber fragrance for evening wear, long-lasting 12+ hours.",
    price: 89.99,
    discountPercentage: 15,
    rating: 4.6,
    stock: 56,
    brand: "Luxury Scents",
    category: "fragrances",
    thumbnail:
      "https://cdn.dummyjson.com/products/images/fragrances/midnight/1.jpg",
    images: [
      "https://cdn.dummyjson.com/products/images/fragrances/midnight/1.jpg",
      "https://cdn.dummyjson.com/products/images/fragrances/midnight/2.jpg",
    ],
  },
  {
    title: "Ocean Breeze",
    description:
      "Fresh marine scent with notes of sea salt, citrus, and white musk - perfect for daily wear.",
    price: 59.99,
    discountPercentage: 10,
    rating: 4.5,
    stock: 78,
    brand: "Aqua Scents",
    category: "fragrances",
    thumbnail:
      "https://cdn.dummyjson.com/products/images/fragrances/ocean/1.jpg",
    images: [
      "https://cdn.dummyjson.com/products/images/fragrances/ocean/1.jpg",
      "https://cdn.dummyjson.com/products/images/fragrances/ocean/2.jpg",
    ],
  },

  // Furniture
  {
    title: "Ergonomic Office Chair",
    description:
      "Adjustable lumbar support, breathable mesh back, and 4D armrests for all-day comfort.",
    price: 299.99,
    discountPercentage: 20,
    rating: 4.7,
    stock: 31,
    brand: "ComfortPlus",
    category: "furniture",
    thumbnail:
      "https://cdn.dummyjson.com/products/images/furniture/chair/1.jpg",
    images: [
      "https://cdn.dummyjson.com/products/images/furniture/chair/1.jpg",
      "https://cdn.dummyjson.com/products/images/furniture/chair/2.jpg",
    ],
  },
  {
    title: "Minimalist Wood Desk",
    description:
      "Solid oak desk with cable management and sleek design, fits any modern home office.",
    price: 449.99,
    discountPercentage: 10,
    rating: 4.6,
    stock: 17,
    brand: "ModernLiving",
    category: "furniture",
    thumbnail: "https://cdn.dummyjson.com/products/images/furniture/desk/1.jpg",
    images: [
      "https://cdn.dummyjson.com/products/images/furniture/desk/1.jpg",
      "https://cdn.dummyjson.com/products/images/furniture/desk/2.jpg",
    ],
  },

  // Skin Care
  {
    title: "Vitamin C Serum",
    description:
      "Brightening serum with 20% Vitamin C, hyaluronic acid, and vitamin E for radiant skin.",
    price: 34.99,
    discountPercentage: 15,
    rating: 4.8,
    stock: 92,
    brand: "GlowLab",
    category: "skin-care",
    thumbnail: "https://cdn.dummyjson.com/products/images/skincare/serum/1.jpg",
    images: [
      "https://cdn.dummyjson.com/products/images/skincare/serum/1.jpg",
      "https://cdn.dummyjson.com/products/images/skincare/serum/2.jpg",
    ],
  },
  {
    title: "Hydrating Face Moisturizer",
    description:
      "Lightweight, non-comedogenic moisturizer with SPF 30 for daily hydration and protection.",
    price: 24.99,
    discountPercentage: 10,
    rating: 4.7,
    stock: 105,
    brand: "PureSkin",
    category: "skin-care",
    thumbnail:
      "https://cdn.dummyjson.com/products/images/skincare/moisturizer/1.jpg",
    images: [
      "https://cdn.dummyjson.com/products/images/skincare/moisturizer/1.jpg",
      "https://cdn.dummyjson.com/products/images/skincare/moisturizer/2.jpg",
    ],
  },
];

async function seedMongoDB() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing products
    const deleted = await Product.deleteMany({});
    console.log(`✅ Cleared ${deleted.deletedCount} existing products`);

    // Insert new products
    const inserted = await Product.insertMany(productData);
    console.log(`✅ Added ${inserted.length} products to database`);

    // Log the inserted products
    console.log("\n📊 Products in database:");
    console.log("------------------------");
    inserted.forEach((product, index) => {
      console.log(
        `${index + 1}. ${product.title} - ${product.brand} (${product.category}) - $${product.price} ⭐${product.rating}`,
      );
    });

    // Get all categories for dropdown
    const categories = await Product.distinct("category");
    console.log("\n📁 Categories for filter:", categories.sort());

    // Count by category
    console.log("\n📈 Products by category:");
    const categoryCount = await Product.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);
    categoryCount.forEach((c) =>
      console.log(`   ${c._id}: ${c.count} products`),
    );

    // Get all brands
    const brands = await Product.distinct("brand");
    console.log("\n🏷️ Brands:", brands.sort());

    // Price range stats
    const priceStats = await Product.aggregate([
      {
        $group: {
          _id: null,
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
          avgPrice: { $avg: "$price" },
        },
      },
    ]);

    if (priceStats.length > 0) {
      console.log("\n💰 Price range:");
      console.log(`   Min: $${priceStats[0].minPrice}`);
      console.log(`   Max: $${priceStats[0].maxPrice}`);
      console.log(`   Avg: $${priceStats[0].avgPrice.toFixed(2)}`);
    }
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("\n👋 Disconnected from MongoDB");
    process.exit(0);
  }
}

seedMongoDB();
