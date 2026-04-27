import express from "express";
import { getAdminDashboardData, verifyVendorKyc, deleteUserOrVendor } from "../controllers/admin.controller";
// Assuming you have a basic auth middleware, maybe you want to protect this with an isAdmin check later.
// For now we will just use isAuthenticated if available, or keep it open if admin login is not fully implemented yet.
import { isAuthenticated } from "../middlewares/auth.middleware";

const router = express.Router();

router.use(isAuthenticated); // Protect routes

router.get("/dashboard", getAdminDashboardData);
router.post("/verify-kyc/:id", verifyVendorKyc);
router.delete("/remove/:id", deleteUserOrVendor);

export default router;
