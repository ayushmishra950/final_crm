import User from "../models/user.model";
import type { Request, Response } from "express";

export const registerUser = async (req: Request, res: Response) => {
    try {
        const { fullName, email, password, mobile } = req.body;
        const user = await User.create({ fullName, email, password, mobile });
        res.status(201).json({ success: true, data: user });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}