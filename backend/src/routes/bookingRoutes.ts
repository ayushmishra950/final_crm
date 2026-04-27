import express from "express";
import { 
    getVendorBookings, 
    updateBookingStatus, 
    createBooking 
} from "../controllers/booking.controller";
import { isAuthenticated, isVendor } from "../middlewares/auth.middleware";

const router = express.Router();

router.use(isAuthenticated);

// User can create a booking
router.post("/create", createBooking);

// Vendor can manage bookings
router.get("/vendor", isVendor, getVendorBookings);
router.patch("/status/:id", isVendor, updateBookingStatus);

export default router;
