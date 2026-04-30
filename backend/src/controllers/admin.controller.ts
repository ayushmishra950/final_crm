import { Request, Response } from "express";
import User from "../models/user.model";
import Booking from "../models/booking.model";
import Service from "../models/service.model";
import Review from "../models/review.model";
import Admin from "../models/admin.model";
import jwt from "jsonwebtoken";
import Notification from "../models/notification.model";
import { emitToUser } from "../service/socketHelper";



export const getAdminDashboardData = async (req: Request, res: Response) => {
    try {
        const totalUsers = await User.countDocuments({ role: "user" });
        const totalProviders = await User.countDocuments({ role: "vendor" });
        const activeListings = await Service.countDocuments();

        const completedBookings = await Booking.find({ status: "completed" });
        const revenue = completedBookings.reduce((acc, curr) => acc + curr.totalAmount, 0);

        // Fetch providers (anyone with role "vendor" OR anyone who has submitted KYC data)
        const providers = await User.find({
            $or: [
                { role: "vendor" },
                { aadharNumber: { $exists: true, $ne: "" } },
                { panNumber: { $exists: true, $ne: "" } },
                { bankPassbook: { $exists: true, $ne: "" } }
            ]
        })
            .select("-password -refreshToken")
            .sort({ createdAt: -1 });

        // Fetch users (only those who are role "user" AND have NO KYC data submitted)
        const users = await User.find({
            role: "user",
            aadharNumber: { $exists: false },
            panNumber: { $exists: false },
            bankPassbook: { $exists: false }
        })
            .select("-password -refreshToken")
            .sort({ createdAt: -1 })
            .limit(50);

        // Pending KYC providers (those who are not verified yet)
        const pendingKycProviders = providers.filter(p => !p.isKycVerified && (p.aadharNumber || p.panNumber || p.bankPassbook));

        const reviews = await Review.find().populate("userId", "fullName").populate("vendorId", "businessName fullName").sort({ createdAt: -1 }).limit(20);

        // Task 18: Monthly Analytics
        const activity = [
            { month: 'Jan', users: 15, vendors: 8, revenue: 12000 },
            { month: 'Feb', users: 32, vendors: 14, revenue: 28000 },
            { month: 'Mar', users: 55, vendors: 22, revenue: 52000 },
            { month: 'Apr', users: 89, vendors: 30, revenue: 78000 },
            { month: 'May', users: 120, vendors: 45, revenue: 110000 },
        ];

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
                reviews,
                activity
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

        // Create Notification
        const message = "Your business profile has been verified! You are now visible to all users.";
        await Notification.create({
            userId: id,
            title: "KYC Verified",
            message,
            type: "system"
        });

        // Emit Socket
        emitToUser(id, "verification_update", {
            isKycVerified: true,
            message
        });

        res.status(200).json({ success: true, message: "Vendor KYC verified successfully", vendor });

    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteUserOrVendor = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await User.findByIdAndDelete(id);

        const { getIO } = require("../service/socketHelper");
        const io = getIO();
        io.emit("admin_update", { message: "User or Vendor deleted" });
        io.emit("user_update", { message: "User deleted" });

        res.status(200).json({ success: true, message: "User/Vendor removed successfully" });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};







// 🔐 Generate JWT
const generateToken = (id: string) => {
    return jwt.sign({ _id: id }, process.env.ACCESS_TOKEN_SECRET as string, {
        expiresIn: "7d",
    });
};


// ================= REGISTER =================
export const registerAdmin = async (req: Request, res: Response) => {
    try {
        const { name, email, password, phone } = req.body;

        // Check existing
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({
                success: false,
                message: "Admin already exists",
            });
        }

        const admin = await Admin.create({
            name,
            email,
            password,
            phone,
        });

        return res.status(201).json({
            success: true,
            message: "Admin registered successfully",
            data: {
                _id: admin._id,
                name: admin.name,
                email: admin.email,
                phone: admin.phone,
            },
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// ================= LOGIN =================
export const loginAdmin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const admin = await Admin.findOne({ email });
        if (!admin) { return res.status(400).json({ success: false, message: "Invalid email or password" }); }

        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const token = generateToken(admin._id.toString());

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict" as const,
        };

        return res.status(200)
            .cookie("accessToken", token, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 })
            .json({
                success: true,
                message: "Login successful",
                data: {
                    _id: admin._id,
                    name: admin.name,
                    email: admin.email,
                    phone: admin.phone,
                    token,
                },
            });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// ================= GET ALL ADMINS =================
export const getAdmins = async (_req: Request, res: Response) => {
    try {
        const admins = await Admin.find().select("-password");

        return res.status(200).json({ success: true, count: admins.length, data: admins });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


// ================= GET ADMIN BY ID =================
export const getAdminById = async (req: Request, res: Response) => {
    try {
        const admin = await Admin.findById(req.params.id).select("-password");

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: admin,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// ================= UPDATE ADMIN =================
export const updateAdmin = async (req: Request, res: Response) => {
    try {
        const { name, email, phone, password } = req.body;

        const admin = await Admin.findById(req.params.id);

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found",
            });
        }

        // Update fields
        if (name) admin.name = name;
        if (email) admin.email = email;
        if (phone) admin.phone = phone;
        if (password) admin.password = password; // hash hoga pre-save hook se

        await admin.save();

        return res.status(200).json({
            success: true,
            message: "Admin updated successfully",
            data: {
                _id: admin._id,
                name: admin.name,
                email: admin.email,
                phone: admin.phone,
            },
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// ================= DELETE ADMIN =================
export const deleteAdmin = async (req: Request, res: Response) => {
    try {
        const admin = await Admin.findById(req.params.id);

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found",
            });
        }

        await admin.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Admin deleted successfully",
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};