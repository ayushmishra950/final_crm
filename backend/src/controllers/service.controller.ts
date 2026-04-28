import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import Service from "../models/service.model";

export const createService = async (req: AuthRequest, res: Response) => {
    try {
        const vendorId = req.user._id;
        const { name, description, price, category, images } = req.body;

        const newService = await Service.create({
            vendorId,
            name,
            description,
            price,
            category,
            images
        });

        const { getIO } = require("../service/socketHelper");
        getIO().emit("vendor_update", { message: "Service created" });
        getIO().emit("admin_update", { message: "Service created" });

        res.status(201).json({
            success: true,
            message: "Service created successfully",
            service: newService
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getVendorServices = async (req: AuthRequest, res: Response) => {
    try {
        const vendorId = req.user._id;
        const services = await Service.find({ vendorId }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            services
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateService = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const vendorId = req.user._id;
        const updateData = req.body;

        const service = await Service.findOneAndUpdate(
            { _id: id, vendorId },
            updateData,
            { new: true, runValidators: true }
        );

        if (!service) {
            return res.status(404).json({ success: false, message: "Service not found or unauthorized" });
        }

        const { getIO } = require("../service/socketHelper");
        getIO().emit("vendor_update", { message: "Service updated" });
        getIO().emit("admin_update", { message: "Service updated" });

        res.status(200).json({
            success: true,
            message: "Service updated successfully",
            service
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteService = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const vendorId = req.user._id;

        const service = await Service.findOneAndDelete({ _id: id, vendorId });

        if (!service) {
            return res.status(404).json({ success: false, message: "Service not found or unauthorized" });
        }

        const { getIO } = require("../service/socketHelper");
        getIO().emit("vendor_update", { message: "Service deleted" });
        getIO().emit("admin_update", { message: "Service deleted" });

        res.status(200).json({
            success: true,
            message: "Service deleted successfully"
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
