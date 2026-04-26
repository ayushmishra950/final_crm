
import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

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
    refreshToken?: string;
    address: string;
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
            default: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
        },

        address: {
            type: String
        },

        refreshToken: {
            type: String,
        },
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