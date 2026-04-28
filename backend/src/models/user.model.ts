
import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export type UserRole = "user" | "vendor" | "admin";

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
    refreshToken?: string;
    address: string;
    businessName?: string;
    category?: string;
    operatingRadius?: number;
    about?: string;
    isOnline?: boolean;
    isKycVerified?: boolean;
    favorites?: mongoose.Types.ObjectId[];
    notificationPreferences?: {
        email: boolean;
        push: boolean;
        sms: boolean;
    };
    rating?: number;
    reviewsCount?: number;
    services?: string[];
    createdAt: Date;
    updatedAt: Date;
    comparePassword(password: string): Promise<boolean>;
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
            // optional field (no change in old logic)
        },

        mobile: {
            type: String,
        },

        role: {
            type: String,
            enum: ["user", "vendor", "admin"],
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
            default: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
        },

        address: {
            type: String
        },

        refreshToken: {
            type: String,
        },

        businessName: {
            type: String,
        },

        category: {
            type: String,
        },

        operatingRadius: {
            type: Number,
            default: 10,
        },

        about: {
            type: String,
        },

        isOnline: {
            type: Boolean,
            default: true,
        },

        isKycVerified: {
            type: Boolean,
            default: false,
        },
        favorites: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        notificationPreferences: {
            email: { type: Boolean, default: true },
            push: { type: Boolean, default: true },
            sms: { type: Boolean, default: false },
        },
        rating: {
            type: Number,
            default: 4.5,
        },
        reviewsCount: {
            type: Number,
            default: 0,
        },
        services: [
            {
                type: String,
            },
        ],
    },
    {
        timestamps: true,
    }
);

UserSchema.pre("save", async function (next) {
    const user = this as IUser;

    if (!user.password) return;

    if (user.isModified("password")) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
    }

});

UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
};

const User = mongoose.model<IUser>("User", UserSchema);

export default User;