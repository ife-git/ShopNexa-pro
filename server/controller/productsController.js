// server/controllers/productsController.js

// @desc    Get all categories from DummyJSON
// @route   GET /api/products/categories
export async function getCategories(req, res) {
  try {
    const response = await fetch("https://dummyjson.com/products/categories");
    const data = await response.json();

    // DummyJSON returns an array of category objects with slug and name
    // [{"slug":"beauty","name":"Beauty","url":"..."}, ...]
    res.json(data);
  } catch (err) {
    console.error("Get categories error:", err.message);
    res.status(500).json({
      error: "Failed to fetch categories",
      details: err.message,
    });
  }
}

// @desc    Get products with optional filtering from DummyJSON
// @route   GET /api/products
export async function getProducts(req, res) {
  try {
    const { category, search } = req.query;
    let url = "https://dummyjson.com/products";

    // Apply filters based on query params
    if (category) {
      url = `https://dummyjson.com/products/category/${category}`;
    } else if (search) {
      url = `https://dummyjson.com/products/search?q=${search}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    // DummyJSON returns { products: [...], total, skip, limit }
    res.json(data.products || data); // Handle both cases
  } catch (err) {
    console.error("Get products error:", err.message);
    res.status(500).json({
      error: "Failed to fetch products",
      details: err.message,
    });
  }
}

// @desc    Get single product by ID from DummyJSON
// @route   GET /api/products/:id
export async function getProductById(req, res) {
  try {
    const { id } = req.params;
    const response = await fetch(`https://dummyjson.com/products/${id}`);

    if (!response.ok) {
      return res.status(404).json({ error: "Product not found" });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Get product error:", err.message);
    res.status(500).json({ error: "Failed to fetch product" });
  }
}
