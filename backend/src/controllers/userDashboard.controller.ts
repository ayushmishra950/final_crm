import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import User from "../models/user.model";
import Booking from "../models/booking.model";
import Notification from "../models/notification.model";
import Category from "../models/category.model";
import bcrypt from "bcryptjs";

export const getUserDashboardData = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user._id;

        // Booking Stats
        const totalBookings = await Booking.countDocuments({ userId });
        const pendingBookings = await Booking.countDocuments({ userId, status: "pending" });
        const completedBookings = await Booking.countDocuments({ userId, status: "completed" });

        // Recent Bookings
        const recentBookings = await Booking.find({ userId })
            .populate("vendorId", "fullName businessName mobile")
            .populate("serviceId", "name price")
            .sort({ date: -1 })
            .limit(5);

        // Notifications
        const notifications = await Notification.find({ userId })
            .sort({ createdAt: -1 })
            .limit(10);

        res.status(200).json({
            success: true,
            data: {
                stats: {
                    totalBookings,
                    pendingBookings,
                    completedBookings
                },
                recentBookings,
                notifications,
                user: req.user
            }
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getPaymentHistory = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user._id;
        // Payments are linked to completed bookings in this system
        const payments = await Booking.find({ userId, status: "completed" })
            .populate("vendorId", "fullName businessName")
            .populate("serviceId", "name")
            .sort({ updatedAt: -1 });

        res.status(200).json({
            success: true,
            payments
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const toggleFavorite = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user._id;
        const { vendorId } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const favorites = user.favorites || [];
        const index = favorites.indexOf(vendorId);

        if (index === -1) {
            favorites.push(vendorId);
        } else {
            favorites.splice(index, 1);
        }

        user.favorites = favorites;
        await user.save();

        res.status(200).json({
            success: true,
            message: index === -1 ? "Added to favorites" : "Removed from favorites",
            favorites: user.favorites
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getFavorites = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId).populate("favorites", "fullName businessName category profileImage mobile");
        
        res.status(200).json({
            success: true,
            favorites: user?.favorites || []
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateNotificationPreferences = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user._id;
        const { email, push, sms } = req.body;

        await User.findByIdAndUpdate(userId, {
            notificationPreferences: { email, push, sms }
        });

        res.status(200).json({
            success: true,
            message: "Notification preferences updated"
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const changePassword = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user._id;
        const { oldPassword, newPassword } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) return res.status(400).json({ success: false, message: "Incorrect old password" });

        user.password = newPassword; // Pre-save hook will hash it
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password changed successfully"
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getNotifications = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user._id;
        const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            notifications
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const markNotificationRead = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        await Notification.findByIdAndUpdate(id, { read: true });

        res.status(200).json({
            success: true,
            message: "Notification marked as read"
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getHomeData = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user._id;

        // Active/Ongoing Booking
        const ongoingBooking = await Booking.findOne({ userId, status: "pending" })
            .populate("vendorId", "fullName businessName mobile profileImage")
            .populate("serviceId", "name category")
            .sort({ date: -1 });

        // Categories (Get from Category model)
        const categories = await Category.find().sort({ name: 1 });

        // Top Rated Providers
        const topRatedProviders = await User.find({ role: "vendor", isKycVerified: true })
            .select("fullName businessName category rating profileImage about")
            .sort({ rating: -1 })
            .limit(6);

        res.status(200).json({
            success: true,
            data: {
                ongoingBooking,
                categories: categories.map(c => c.name),
                topRatedProviders
            }
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getExploreProviders = async (req: AuthRequest, res: Response) => {
    try {
        const { category, search, sortBy } = req.query;

        let query: any = { role: "vendor", isKycVerified: true };

        if (category && category !== "All") {
            query.category = category;
        }

        if (search) {
            query.$or = [
                { fullName: { $regex: search, $options: "i" } },
                { businessName: { $regex: search, $options: "i" } },
                { category: { $regex: search, $options: "i" } },
                { services: { $in: [new RegExp(search as string, "i")] } }
            ];
        }

        let sort: any = {};
        if (sortBy === "rating") {
            sort = { rating: -1 };
        } else {
            sort = { createdAt: -1 };
        }

        const providers = await User.find(query)
            .select("fullName businessName category rating profileImage about services reviewsCount")
            .sort(sort);

        res.status(200).json({
            success: true,
            providers
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getVendorProfile = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const vendor = await User.findById(id).select("-password -tokens -role");
        if (!vendor) {
            return res.status(404).json({ success: false, message: "Vendor not found" });
        }
        res.status(200).json({
            success: true,
            vendor
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
