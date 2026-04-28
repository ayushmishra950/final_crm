import User from "../models/user.model";
import type { Request, Response } from "express";
import { generateAccessAndRefreshTokens } from "../utils/generateTokens";
import jwt from "jsonwebtoken";

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
};

export const registerUser = async (req: Request, res: Response) => {
    try {
        const { fullName, email, password, mobile } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "Email already registered", success: false });
        }

        const user = await User.create({ fullName, email, password, mobile, role: "user" });
        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id.toString());

        res.status(201)
            .cookie("accessToken", accessToken, { ...cookieOptions, maxAge: 10 * 60 * 1000 })
            .cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 })
            .json({ message: "User registered successfully", success: true, user });

    } catch (error: any) {
        res.status(500).json({ message: error?.message || "Internal server error", success: false });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        console.log(email, password);

        const user = await User.findOne({ email, role: "user" });
        console.log("user", user);
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials", success: false });
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id.toString());

        res.status(200)
            .cookie("accessToken", accessToken, { ...cookieOptions, maxAge: 10 * 60 * 1000 })
            .cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 })
            .json({ message: "User logged in successfully", success: true, user });

    } catch (error: any) {
        res.status(500).json({ message: error?.message || "Internal server error", success: false });
    }
};

export const registerVendor = async (req: Request, res: Response) => {
    try {
        const { fullName, email, password, mobile } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "Email already registered", success: false });
        }

        const user = await User.create({ fullName, email, password, mobile, role: "vendor" });
        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id.toString());

        res.status(201)
            .cookie("accessToken", accessToken, { ...cookieOptions, maxAge: 10 * 60 * 1000 })
            .cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 })
            .json({ message: "Vendor registered successfully", success: true, user });

    } catch (error: any) {
        res.status(500).json({ message: error?.message || "Internal server error", success: false });
    }
};

export const loginVendor = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email, role: "vendor" });

        if (!user) {
            return res.status(404).json({ message: "Vendor not found", success: false });
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials", success: false });
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id.toString());

        res.status(200)
            .cookie("accessToken", accessToken, { ...cookieOptions, maxAge: 10 * 60 * 1000 })
            .cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 })
            .json({ message: "Vendor logged in successfully", success: true, user });

    } catch (error: any) {
        res.status(500).json({ message: error?.message || "Internal server error", success: false });
    }
};

export const loginAdmin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email, role: "admin" });

        if (!user) {
            return res.status(404).json({ message: "Admin not found", success: false });
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials", success: false });
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id.toString());

        res.status(200)
            .cookie("accessToken", accessToken, { ...cookieOptions, maxAge: 10 * 60 * 1000 })
            .cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 })
            .json({ message: "Admin logged in successfully", success: true, user });

    } catch (error: any) {
        res.status(500).json({ message: error?.message || "Internal server error", success: false });
    }
};

export const logoutUser = async (req: Request, res: Response) => {
    try {
        // Need to identify user from cookies ideally, but if not we just clear the cookies
        const incomingRefreshToken = req.cookies.refreshToken;
        if (incomingRefreshToken) {
            const decodedToken: any = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET as string);
            await User.findByIdAndUpdate(decodedToken._id, {
                $unset: { refreshToken: 1 } // this removes the field from document
            });
        }

        res.status(200)
            .clearCookie("accessToken", cookieOptions)
            .clearCookie("refreshToken", cookieOptions)
            .json({ message: "Logged out successfully", success: true });
    } catch (error: any) {
        res.status(500).json({ message: "Something went wrong during logout", success: false });
    }
};

export const refreshAccessToken = async (req: Request, res: Response) => {
    try {
        const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

        if (!incomingRefreshToken) {
            return res.status(401).json({ message: "Unauthorized request", success: false });
        }

        const decodedToken: any = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET as string);
        const user = await User.findById(decodedToken?._id);

        if (!user) {
            return res.status(401).json({ message: "Invalid refresh token", success: false });
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            return res.status(401).json({ message: "Refresh token is expired or used", success: false });
        }

        const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshTokens(user._id.toString());

        res.status(200)
            .cookie("accessToken", accessToken, { ...cookieOptions, maxAge: 10 * 60 * 1000 })
            .cookie("refreshToken", newRefreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 })
            .json({ message: "Access token refreshed", success: true, accessToken: accessToken });
    } catch (error: any) {
        res.status(401).json({ message: "Invalid or expired refresh token", success: false });
    }
};

export const getCurrentUser = async (req: Request, res: Response) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const decodedToken: any = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string);
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid Access Token" });
        }

        return res.status(200).json({
            success: true,
            user,
        });
    } catch (error: any) {
        return res.status(401).json({ success: false, message: "Invalid Access Token" });
    }
};


export const updateProfile = async (req: Request, res: Response) => {
    try {
        const { fullName, email, password, mobile, profileImage, address } = req.body;
        const incomingRefreshToken = req.cookies.refreshToken;
        const decodedToken: any = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET as string);
        const user = await User.findById(decodedToken?._id);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (email && email !== user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ success: false, message: "Email already registered" });
            }
            user.email = email;
        }

        if (fullName) {
            user.fullName = fullName;
        }

        if (mobile) {
            user.mobile = mobile;
        }

        if (password) {
            user.password = password;
        }

        if (profileImage) {
            user.profileImage = profileImage;
        }

        if (address) {
            user.address = address;
        }

        await user.save();

        return res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Something went wrong during profile update" });
    }
}