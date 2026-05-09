import mongoose from "mongoose";
import dotenv from "dotenv";
import { DB_Name } from "../constants.js";
dotenv.config();

const connectDB = async () => {
    try {

        const connectionIInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_Name}`);  

        console.log(`MongoDB connected !!: ${connectionIInstance.connection.host}`);
    } catch (error) {
        console.error('Error connecting to MongoDB in the index.js file:', error);
        process.exit(1);
        throw error;
    }
}

export default connectDB;