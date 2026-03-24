import express from "express";
import { getCurrentUser } from "../controller/meController.js";

export const meRouter = express.Router();

meRouter.get("/", getCurrentUser);
