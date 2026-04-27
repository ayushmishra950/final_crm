import express from "express";
import { 
    getVendorBookings, 
    updateBookingStatus, 
    createBooking 
} from "../controllers/booking.controller";
import { isAuthenticated } from "../middlewares/auth.middleware";
const router = express.Router();

router.use(isAuthenticated);

// User can create a booking
router.post("/create", createBooking);

// Vendor can manage bookings
router.get("/vendor", getVendorBookings);
router.patch("/status/:id", updateBookingStatus);

export default router;
