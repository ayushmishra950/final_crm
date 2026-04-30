import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware";
import * as userDashboardController from "../controllers/userDashboard.controller";
import * as bookingController from "../controllers/booking.controller";

const router = Router();

// Dashboard Data
router.get("/dashboard", isAuthenticated, userDashboardController.getUserDashboardData);

// Bookings
router.get("/bookings", isAuthenticated, bookingController.getUserBookings);

// Favorites
router.get("/favorites", isAuthenticated, userDashboardController.getFavorites);
router.post("/favorites/toggle", isAuthenticated, userDashboardController.toggleFavorite);

// Notifications
router.get("/notifications", isAuthenticated, userDashboardController.getNotifications);
router.patch("/notifications/:id/read", isAuthenticated, userDashboardController.markNotificationRead);
router.patch("/notifications/preferences", isAuthenticated, userDashboardController.updateNotificationPreferences);

// Payments
router.get("/payments", isAuthenticated, userDashboardController.getPaymentHistory);

// Security
router.post("/change-password", isAuthenticated, userDashboardController.changePassword);

// Review
router.post("/review", isAuthenticated, userDashboardController.addReview);

// Public/Explore
router.get("/home", isAuthenticated, userDashboardController.getHomeData);
router.get("/explore", isAuthenticated, userDashboardController.getExploreProviders);
router.get("/vendor/:id", isAuthenticated, userDashboardController.getVendorProfile);

export default router;
