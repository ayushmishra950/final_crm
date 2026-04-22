import mongoose from "mongoose";

const connectDB = async () => {
    if (!process.env.MONGODB_URL) {
        throw new Error("MONGODB_URL is not defined");
    }
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("MongoDB connected");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}

export default connectDB;   