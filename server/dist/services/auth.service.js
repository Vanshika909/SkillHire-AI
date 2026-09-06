"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const user_1 = __importDefault(require("../models/user"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const registerUser = async (data) => {
    const { name, email, password, role } = data;
    // Check if email already exists
    const existingUser = await user_1.default.findOne({ email });
    if (existingUser) {
        throw new Error("Email already registered");
    }
    //password hashing
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    // Create user (password hashing will be added next)
    const user = await user_1.default.create({
        name,
        email,
        password: hashedPassword,
        role,
    });
    return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
    };
};
exports.registerUser = registerUser;
const loginUser = async (email, password) => {
    const user = await user_1.default.findOne({ email });
    console.log("Email received:", email);
    console.log("User found:", user);
    if (!user) {
        throw new Error("Invalid email or password");
    }
    console.log("Stored Password:", user.password);
    console.log("Entered Password:", password);
    const isMatch = await bcryptjs_1.default.compare(password, user.password);
    console.log("Password Match:", isMatch);
    if (!isMatch) {
        throw new Error("Invalid email or password");
    }
    const secret = process.env.JWT_SECRET;
    const options = {
        expiresIn: "7d",
    };
    const token = jsonwebtoken_1.default.sign({
        userId: user._id,
        role: user.role,
    }, secret, options);
    console.log("Generated Token:", token);
    return {
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    };
};
exports.loginUser = loginUser;
