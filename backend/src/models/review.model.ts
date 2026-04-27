import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
    bookingId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    vendorId: mongoose.Types.ObjectId;
    rating: number;
    comment: string;
    createdAt: Date;
    updatedAt: Date;
}

const ReviewSchema: Schema<IReview> = new Schema(
    {
        bookingId: { 
            type: Schema.Types.ObjectId, 
            ref: "Booking", 
            required: true 
        },
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
        rating: { 
            type: Number, 
            required: true, 
            min: 1, 
            max: 5 
        },
        comment: { 
            type: String 
        },
    },
    { 
        timestamps: true 
    }
);

export default mongoose.model<IReview>("Review", ReviewSchema);
