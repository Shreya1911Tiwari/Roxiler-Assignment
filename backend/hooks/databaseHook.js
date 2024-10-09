import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Ensure dotenv loads environment variables

export const useDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Atlas connected successfully!");
  } catch (error) {
    console.error("Error connecting to MongoDB Atlas:", error.message);
    process.exit(1); // Exit if connection fails
  }
};