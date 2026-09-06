"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const node_path_1 = __importDefault(require("node:path"));
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_1 = __importDefault(require("../models/user"));
dotenv_1.default.config({ path: node_path_1.default.resolve(__dirname, "../../.env") });
const createAdmin = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            throw new Error("MONGODB_URI is missing from server/.env");
        }
        await mongoose_1.default.connect(mongoUri);
        console.log("MongoDB connected");
        const email = "admin@skillhire.com";
        const password = "Admin@12345";
        const existingAdmin = await user_1.default.findOne({ email });
        if (existingAdmin) {
            console.log("User already exists.");
            if (existingAdmin.role !== "admin") {
                existingAdmin.role = "admin";
                await existingAdmin.save();
                console.log("Existing user promoted to admin.");
            }
            else {
                console.log("User is already an admin.");
            }
            process.exit(0);
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const admin = await user_1.default.create({
            name: "SkillHire Admin",
            email,
            password: hashedPassword,
            role: "admin",
        });
        console.log("Admin created successfully!");
        console.log("Email:", admin.email);
        console.log("Role:", admin.role);
        process.exit(0);
    }
    catch (error) {
        console.error("Failed to create admin:", error);
        process.exit(1);
    }
};
createAdmin();
