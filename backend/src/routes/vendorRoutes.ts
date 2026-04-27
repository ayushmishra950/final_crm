import express from "express";
import { 
    getVendorDashboardData, 
    updateVendorProfile, 
    updateAvailability, 
    submitKyc 
} from "../controllers/vendor.controller";
import { isAuthenticated, isVendor } from "../middlewares/auth.middleware";

const router = express.Router();

router.use(isAuthenticated);
router.use(isVendor);

router.get("/dashboard", getVendorDashboardData);
router.post("/profile/update", updateVendorProfile);
router.post("/availability", updateAvailability);
router.post("/kyc/submit", submitKyc);

export default router;
