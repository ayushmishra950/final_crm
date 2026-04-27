import express from "express";
import { 
    getVendorDashboardData, 
    updateVendorProfile, 
    updateAvailability, 
    submitKyc 
} from "../controllers/vendor.controller";
import { isAuthenticated } from "../middlewares/auth.middleware";

const router = express.Router();

router.use(isAuthenticated);

router.get("/dashboard", getVendorDashboardData);
router.post("/profile/update", updateVendorProfile);
router.post("/availability", updateAvailability);
router.post("/kyc/submit", submitKyc);

export default router;
