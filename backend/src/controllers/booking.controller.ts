import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import Booking from "../models/booking.model";

export const getVendorBookings = async (req: AuthRequest, res: Response) => {
    try {
        const vendorId = req.user._id;
        const { status } = req.query;

        const filter: any = { vendorId };
        if (status) {
            filter.status = status;
        }

        const bookings = await Booking.find(filter)
            .populate("userId", "fullName mobile email")
            .populate("serviceId", "name price")
            .sort({ date: -1 });

        res.status(200).json({
            success: true,
            bookings
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateBookingStatus = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const vendorId = req.user._id;

        const booking = await Booking.findOneAndUpdate(
            { _id: id, vendorId },
            { status },
            { new: true }
        );

        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found or unauthorized" });
        }

        const { getIO } = require("../service/socketHelper");
        getIO().emit("user_update", { message: "Booking status updated" });
        getIO().emit("vendor_update", { message: "Booking status updated" });

        res.status(200).json({
            success: true,
            message: `Booking ${status} successfully`,
            booking
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

import { getIO } from "../service/socketHelper";

export const createBooking = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user._id;
        const { vendorId, serviceId, date, totalAmount, location } = req.body;

        const newBooking = await Booking.create({
            userId,
            vendorId,
            serviceId,
            date,
            totalAmount: totalAmount || 0,
            location: location || "TBD"
        });

        // Emit socket event to vendor
        try {
            const io = getIO();
            io.emit(`new_booking_${vendorId}`, newBooking);
            io.emit("vendor_update", { message: "New booking received" });
            io.emit("user_update", { message: "Booking created" });
        } catch (socketErr) {
            console.error("Socket emission failed:", socketErr);
        }

        res.status(201).json({
            success: true,
            message: "Booking requested successfully",
            booking: newBooking
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getUserBookings = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user._id;
        const { status } = req.query;

        const filter: any = { userId };
        if (status) {
            filter.status = status;
        }

        const bookings = await Booking.find(filter)
            .populate("vendorId", "fullName businessName mobile profileImage")
            .populate("serviceId", "name price")
            .sort({ date: -1 });

        res.status(200).json({
            success: true,
            bookings
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
