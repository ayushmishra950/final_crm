import { Request, Response } from "express";
import User from "../models/user.model";
import Booking from "../models/booking.model";
import Service from "../models/service.model";
import Review from "../models/review.model";

export const getAdminDashboardData = async (req: Request, res: Response) => {
    try {
        const totalUsers = await User.countDocuments({ role: "user" });
        const totalProviders = await User.countDocuments({ role: "vendor" });
        const activeListings = await Service.countDocuments();
        
        const completedBookings = await Booking.find({ status: "completed" });
        const revenue = completedBookings.reduce((acc, curr) => acc + curr.totalAmount, 0);

        // Fetch users
        const users = await User.find({ role: "user" })
            .select("-password -refreshToken")
            .sort({ createdAt: -1 })
            .limit(50);

        // Fetch providers
        const providers = await User.find({ role: "vendor" })
            .select("-password -refreshToken")
            .sort({ createdAt: -1 });

        // Pending KYC providers
        const pendingKycProviders = providers.filter(p => !p.isKycVerified && (p.aadharNumber || p.panNumber || p.bankPassbook));

        const reviews = await Review.find().populate("userId", "fullName").populate("vendorId", "businessName fullName").sort({ createdAt: -1 }).limit(20);

        res.status(200).json({
            success: true,
            data: {
                stats: {
                    totalUsers,
                    totalProviders,
                    activeListings,
                    revenue
                },
                users,
                providers,
                pendingKycProviders,
                reviews
            }
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const verifyVendorKyc = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const vendor = await User.findByIdAndUpdate(id, { isKycVerified: true }, { new: true });
        
        if (!vendor) {
            return res.status(404).json({ success: false, message: "Vendor not found" });
        }

        res.status(200).json({ success: true, message: "Vendor KYC verified successfully", vendor });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteUserOrVendor = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await User.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "User/Vendor removed successfully" });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
