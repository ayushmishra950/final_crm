import User from "../models/user.model";
import type { Request, Response } from "express";
import { sendOtp } from "../service/twilio";

export const registerUser = async (req: Request, res: Response) => {
    try {
        const { fullName, email, password, mobile } = req.body;
        const user = await User.create({ fullName, email, password, mobile });
        res.status(201).json({message:"User registered successfully", success: true, data: user });
    } catch (error:any) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: error?.message || "Internal server error", success: false });
    }
}



export const getCurrentUser = (req: any, res: Response) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            user: null,
        });
    }

    return res.json({
        success: true,
        user: req.user,
    });
};