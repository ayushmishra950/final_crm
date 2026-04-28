import express from "express";
import { getAdminDashboardData, verifyVendorKyc, deleteUserOrVendor, registerAdmin, loginAdmin, getAdmins, getAdminById, updateAdmin, deleteAdmin } from "../controllers/admin.controller";
import { isAuthenticated, isAdmin } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);

// Protect all routes below this line
router.use(isAuthenticated, isAdmin);

router.get("/dashboard", getAdminDashboardData);
router.post("/verify-kyc/:id", verifyVendorKyc);
router.delete("/remove/:id", deleteUserOrVendor);

router.get("/", getAdmins);
router.get("/:id", getAdminById);

router.put("/:id", updateAdmin);
router.delete("/:id", deleteAdmin);

export default router;
