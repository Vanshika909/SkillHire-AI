"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.getProfile = void 0;
const user_1 = __importDefault(require("../models/user"));
// Get logged-in student's profile
const getProfile = async (userId) => {
    const user = await user_1.default.findById(userId).select("-password");
    if (!user) {
        throw new Error("User not found");
    }
    return user;
};
exports.getProfile = getProfile;
// Update student's profile
const updateProfile = async (userId, data) => {
    const user = await user_1.default.findByIdAndUpdate(userId, data, {
        new: true, // Return updated document
        runValidators: true // Validate updated fields
    }).select("-password");
    if (!user) {
        throw new Error("User not found");
    }
    return user;
};
exports.updateProfile = updateProfile;
