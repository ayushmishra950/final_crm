import mongoose, { Schema, Document } from "mongoose";

export type UserRole = "user" | "vendor";

export interface IUser extends Document {
    fullName: string;
    email: string;
    password: string;
    mobile: string;
    role: UserRole;
    aadharNumber?: string;
    googleId?: string;
    panNumber?: string;
    bankPassbook?: string;
    profileImage?: string;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true,
        },
        googleId: {
            type: String,
            unique: true,
            sparse: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },

        password: {
            type: String,
        },

        mobile: {
            type: String,
        },

        role: {
            type: String,
            enum: ["user", "vendor"],
            default: "user",
        },

        aadharNumber: {
            type: String,
        },

        panNumber: {
            type: String,
        },

        bankPassbook: {
            type: String,
        },

        profileImage: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model<IUser>("User", UserSchema);

export default User;