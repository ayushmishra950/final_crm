import express from "express";
import passport from "passport";
import { getCurrentUser, registerUser } from "../controllers/user.controller";

const router = express.Router();


// 👇 current user API
router.post("/register", registerUser);
router.get("/me", getCurrentUser);

export default router;