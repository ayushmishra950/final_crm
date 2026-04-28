import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

// Interface (Type Safety)
export interface IAdmin extends Document {
    name: string;
    email: string;
    password: string;
    phone: string;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

// Schema
const AdminSchema: Schema<IAdmin> = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
            minlength: 6,
        },

        phone: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);


// 🔐 Hash password before save
AdminSchema.pre<IAdmin>("save", async function () {
    if (!this.isModified("password")) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});


// 🔑 Compare password method
AdminSchema.methods.comparePassword = async function (
    candidatePassword: string
): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};


// Model
const Admin = mongoose.model<IAdmin>("Admin", AdminSchema);

export default Admin;