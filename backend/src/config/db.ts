//this is our database
import mongoose from "mongoose";
const connectDB = async(): Promise<void> => {
    try {
        const mongoURI = process.env.MONGO_URI;
        if(!mongoURI){
            throw new Error("MONGO_URI is missing from the environment variables");
        }
        await mongoose.connect(mongoURI);
        console.log("Connection Successfull")

    }catch (error){
        console.error("MongoDB connection failed:", error);
        process.exit(1);
    }
};
export default connectDB;