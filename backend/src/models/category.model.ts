import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
    name: string;
    image: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

const CategorySchema: Schema<ICategory> = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        image: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const Category = mongoose.model<ICategory>("Category", CategorySchema);

export default Category;
