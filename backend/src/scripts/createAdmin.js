
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import connectDB from "../config/db.js";

const createAdmin = async () => {
  try {
    await connectDB();

    const name = "Admin";
    const email = "admin@gmail.com";
    const password = "ChangeThisPassword123!";

    const existingAdmin = await User.findOne({ email });

    if (existingAdmin) {
      console.log("Admin account already exists.");
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await User.create({
      name,
      email,
      passwordHash,
      role: "admin",
      isActive: true,
    });

    console.log("Admin account created successfully.");
    console.log(`Email: ${email}`);
    console.log("Password: ChangeThisPassword123!");
    console.log("Please change this password after your first login.");
  } catch (error) {
    console.error("Admin creation failed:", error.message);
  } finally {
    await mongoose.disconnect();
  }
};

createAdmin();
