// server/routes/products.js
import express from "express";
import {
  getCategories,
  getProducts,
  getProductById,
} from "../controller/productsController.js";

export const productsRouter = express.Router();

productsRouter.get("/categories", getCategories);
productsRouter.get("/", getProducts);
productsRouter.get("/:id", getProductById);
