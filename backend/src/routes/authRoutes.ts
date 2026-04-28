import express from "express";
import {
    registerUser,
    loginUser,
    registerVendor,
    loginVendor,
    loginAdmin,
    logoutUser,
    refreshAccessToken,
    getCurrentUser,
    updateProfile
} from "../controllers/user.controller";

const router = express.Router();

router.post("/register/user", registerUser);
router.post("/login/user", loginUser);

router.post("/register/vendor", registerVendor);
router.post("/login/vendor", loginVendor);
router.post("/login/admin", loginAdmin);

router.post("/logout", logoutUser);
router.post("/refresh-token", refreshAccessToken);
router.get("/me", getCurrentUser);
router.post("/update-profile", updateProfile);

export default router;