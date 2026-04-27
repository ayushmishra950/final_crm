import jwt from "jsonwebtoken";
import User, { IUser } from "../models/user.model";

export const generateAccessAndRefreshTokens = async (userId: string) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }

        const accessToken = jwt.sign(
            { _id: user._id, role: user.role },
            process.env.ACCESS_TOKEN_SECRET as string,
            { expiresIn: "10m" }
        );

        const refreshToken = jwt.sign(
            { _id: user._id },
            process.env.REFRESH_TOKEN_SECRET as string,
            { expiresIn: "7d" }
        );

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error: any) {
        console.error("Detailed token error:", error);
        throw new Error(`Something went wrong while generating tokens: ${error?.message || error}`);
    }
};
