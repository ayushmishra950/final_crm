import mongoose, { Schema, Document } from "mongoose";

export interface IBooking extends Document {
    userId: mongoose.Types.ObjectId;
    vendorId: mongoose.Types.ObjectId;
    serviceId: mongoose.Types.ObjectId;
    date: Date;
    status: "pending" | "accepted" | "declined" | "completed";
    totalAmount: number;
    location: string;
    createdAt: Date;
    updatedAt: Date;
}

const BookingSchema: Schema<IBooking> = new Schema(
    {
        userId: { 
            type: Schema.Types.ObjectId, 
            ref: "User", 
            required: true 
        },
        vendorId: { 
            type: Schema.Types.ObjectId, 
            ref: "User", 
            required: true 
        },
        serviceId: { 
            type: Schema.Types.ObjectId, 
            ref: "Service", 
            required: false 
        },
        date: { 
            type: Date, 
            required: true 
        },
        status: { 
            type: String, 
            enum: ["pending", "accepted", "declined", "completed"], 
            default: "pending" 
        },
        totalAmount: { 
            type: Number, 
            required: true 
        },
        location: { 
            type: String, 
            required: true 
        },
    },
    { 
        timestamps: true 
    }
);

export default mongoose.model<IBooking>("Booking", BookingSchema);
