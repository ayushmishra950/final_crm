import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import User from "../models/user.model";
import Booking from "../models/booking.model";
import Service from "../models/service.model";
import Review from "../models/review.model";

export const getVendorDashboardData = async (req: AuthRequest, res: Response) => {
    try {
        const vendorId = req.user._id;

        // Stats
        const totalBookings = await Booking.countDocuments({ vendorId });
        const pendingBookings = await Booking.countDocuments({ vendorId, status: "pending" });
        const acceptedBookings = await Booking.countDocuments({ vendorId, status: "accepted" });
        const completedBookings = await Booking.find({ vendorId, status: "completed" });

        const totalEarnings = completedBookings.reduce((sum, booking) => sum + booking.totalAmount, 0);

        // Recent Bookings (Leads)
        const recentBookings = await Booking.find({ vendorId })
            .populate("userId", "fullName mobile email")
            .populate("serviceId", "name price")
            .sort({ createdAt: -1 })
            .limit(10);

        // Reviews
        const reviews = await Review.find({ vendorId })
            .populate("userId", "fullName profileImage")
            .sort({ createdAt: -1 })
            .limit(5);

        res.status(200).json({
            success: true,
            data: {
                stats: {
                    totalBookings,
                    pendingBookings,
                    acceptedBookings,
                    totalEarnings,
                },
                recentBookings,
                reviews,
                vendor: req.user
            }
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateVendorProfile = async (req: AuthRequest, res: Response) => {
    try {
        const vendorId = req.user._id;
        const { fullName, businessName, category, mobile, about, operatingRadius, address } = req.body;

        const updatedVendor = await User.findByIdAndUpdate(
            vendorId,
            {
                fullName,
                businessName,
                category,
                mobile,
                about,
                operatingRadius,
                address
            },
            { new: true, runValidators: true }
        ).select("-password -refreshToken");

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            vendor: updatedVendor
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateAvailability = async (req: AuthRequest, res: Response) => {
    try {
        const vendorId = req.user._id;
        const { isOnline } = req.body;

        await User.findByIdAndUpdate(vendorId, { isOnline });

        res.status(200).json({
            success: true,
            message: `You are now ${isOnline ? "online" : "offline"}`,
            isOnline
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const submitKyc = async (req: AuthRequest, res: Response) => {
    try {
        const vendorId = req.user._id;
        const { panNumber, aadharNumber, bankPassbook } = req.body;

        const updatedVendor = await User.findByIdAndUpdate(
            vendorId,
            {
                panNumber,
                aadharNumber,
                bankPassbook,
                isKycVerified: false // Set to false initially, admin should verify
            },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "KYC documents submitted for verification",
            vendor: updatedVendor
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
