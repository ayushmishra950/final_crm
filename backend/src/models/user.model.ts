
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
    distance?: number;
    experience?: number;
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
    portfolio?: string[];
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
            default: "https://imgs.search.brave.com/-nmL2r-34z2gUm6XJlNfbOjPtyV5CoEaX0wj5HLDLU4/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTQ2/NTE3MzQ2NC9waG90/by9idXNpbmVzcy1u/ZXR3b3JrLWNvbmNl/cHQtdGVhbXdvcmst/cGFydG5lcnNoaXAt/aHVtYW4tcmVzb3Vy/Y2VzLmpwZz9zPTYx/Mng2MTImdz0wJms9/MjAmYz1wZjJPVE50/Um9FMzBaNnlrU2Rm/WE9PcmxxejZjTXdV/d0pSN2lWODg1azdJ/PQ",
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

        distance: {
            type: Number,
            default: 10,
            min: 0,
        },

        experience: {
            type: Number,
            default: 0,
            min: 0,
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
        portfolio: [
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