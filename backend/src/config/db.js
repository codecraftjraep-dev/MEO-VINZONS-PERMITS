
import mongoose from "mongoose";
import dns from "node:dns";
import env from "./env.js";

// Use Google's public DNS to resolve MongoDB Atlas SRV records
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(env.MONGO_URI);

    console.log("MongoDB connected successfully.");
    console.log(`Database: ${connection.connection.name}`);
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

export default connectDB;
