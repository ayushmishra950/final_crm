import mongoose, { Schema, Document } from "mongoose";

export interface IService extends Document {
    vendorId: mongoose.Types.ObjectId;
    name: string;
    description: string;
    price: number;
    category: string;
    images: string[];
    createdAt: Date;
    updatedAt: Date;
}

const ServiceSchema: Schema<IService> = new Schema(
    {
        vendorId: { 
            type: Schema.Types.ObjectId, 
            ref: "User", 
            required: true 
        },
        name: { 
            type: String, 
            required: true,
            trim: true
        },
        description: { 
            type: String, 
            required: true 
        },
        price: { 
            type: Number, 
            required: true 
        },
        category: { 
            type: String, 
            required: true 
        },
        images: [{ 
            type: String 
        }],
    },
    { 
        timestamps: true 
    }
);

export default mongoose.model<IService>("Service", ServiceSchema);
