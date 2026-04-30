import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import Booking from "../models/booking.model";
import Notification from "../models/notification.model";
import { emitToUser, getIO } from "../service/socketHelper";
import mongoose from "mongoose";



export const createBooking = async (req: AuthRequest, res: Response) => {
    try {
        const { vendorId, serviceId, date, totalAmount, location, note } = req.body;
        const userId = req.user._id;

        // Ensure serviceId is a valid ObjectId if provided
        let validServiceId = null;
        if (serviceId && mongoose.Types.ObjectId.isValid(serviceId)) {
            validServiceId = serviceId;
        }

        const newBooking = await Booking.create({
            userId,
            vendorId,
            serviceId: validServiceId,
            date: date || new Date(),
            totalAmount: totalAmount || 0,
            location: location || "User Location"
        });


        const vendorMessage = `New booking request from ${req.user.fullName}`;

        await Notification.create({
            userId: vendorId,
            title: "New Booking Request",
            message: vendorMessage,
            type: "booking"
        });

        emitToUser(vendorId.toString(), "new_booking", {
            booking: newBooking,
            message: vendorMessage
        });

        return res.status(201).json({
            success: true,
            message: "Booking requested successfully",
            booking: newBooking
        });

    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

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
            return res.status(404).json({
                success: false,
                message: "Booking not found or unauthorized"
            });
        }

        const userMessage = `Your booking status has been updated to ${status}`;

        await Notification.create({
            userId: booking.userId,
            title: "Booking Update",
            message: userMessage,
            type: "booking"
        });

        emitToUser(booking.userId.toString(), "booking_update", {
            bookingId: id,
            status,
            message: userMessage
        });

        return res.status(200).json({
            success: true,
            message: `Booking ${status} successfully`,
            booking
        });

    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
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
