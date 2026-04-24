import express from "express";
import passport from "passport";
import { getCurrentUser } from "../controllers/user.controller";

const router = express.Router();

// Google login
router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google callback
router.get(
    "/google/callback",
    passport.authenticate("google", {
        failureRedirect: `${process.env.FRONTEND_URL}/user-auth`,
    }),
    (req, res) => {
        res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
    }
);

// 👇 current user API
router.get("/me", getCurrentUser);

export default router;