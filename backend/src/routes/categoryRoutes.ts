import express from "express";
import { createCategory, getCategories, updateCategory, deleteCategory } from "../controllers/category.controller";
import { isAuthenticated, isAdmin } from "../middlewares/auth.middleware";

const router = express.Router();

// Public route to get categories
router.get("/", getCategories);

// Protected routes for Admin
router.post("/", isAuthenticated, isAdmin, createCategory);
router.put("/:id", isAuthenticated, isAdmin, updateCategory);
router.delete("/:id", isAuthenticated, isAdmin, deleteCategory);

export default router;
