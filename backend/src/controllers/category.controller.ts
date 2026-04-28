import { Request, Response } from "express";
import Category from "../models/category.model";

export const createCategory = async (req: Request, res: Response) => {
    try {
        const { name, image, description } = req.body;
        console.log("Creating category:", { name, image, description });
        
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            console.log("Category already exists:", name);
            return res.status(400).json({ success: false, message: "Category already exists" });
        }

        const category = await Category.create({ name, image, description });
        console.log("Category created successfully:", category);

        const { getIO } = require("../service/socketHelper");
        getIO().emit("admin_update", { message: "Category created" });

        res.status(201).json({ success: true, data: category });
    } catch (error: any) {
        console.error("Error in createCategory:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getCategories = async (req: Request, res: Response) => {
    try {
        const categories = await Category.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: categories });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, image, description } = req.body;

        const category = await Category.findByIdAndUpdate(
            id,
            { name, image, description },
            { new: true, runValidators: true }
        );

        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }

        const { getIO } = require("../service/socketHelper");
        getIO().emit("admin_update", { message: "Category updated" });

        res.status(200).json({ success: true, data: category });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const category = await Category.findByIdAndDelete(id);

        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }

        const { getIO } = require("../service/socketHelper");
        getIO().emit("admin_update", { message: "Category deleted" });

        res.status(200).json({ success: true, message: "Category deleted successfully" });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
