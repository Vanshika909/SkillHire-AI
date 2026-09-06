import dotenv from "dotenv";
import path from "node:path";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/user";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const createAdmin = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error("MONGODB_URI is missing from server/.env");
    }

    await mongoose.connect(mongoUri);

    console.log("MongoDB connected");

    const email = "admin@skillhire.com";
    const password = "Admin@12345";

    const existingAdmin = await User.findOne({ email });

    if (existingAdmin) {
      console.log("User already exists.");

      if (existingAdmin.role !== "admin") {
        existingAdmin.role = "admin";
        await existingAdmin.save();
        console.log("Existing user promoted to admin.");
      } else {
        console.log("User is already an admin.");
      }

      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await User.create({
      name: "SkillHire Admin",
      email,
      password: hashedPassword,
      role: "admin",
    });

    console.log("Admin created successfully!");
    console.log("Email:", admin.email);
    console.log("Role:", admin.role);

    process.exit(0);
  } catch (error) {
    console.error("Failed to create admin:", error);
    process.exit(1);
  }
};

createAdmin();