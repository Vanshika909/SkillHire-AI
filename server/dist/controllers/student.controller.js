"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.update = exports.profile = exports.uploadProfilePicture = void 0;
const student_service_1 = require("../services/student.service");
const uploadProfilePicture = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload a profile picture",
            });
        }
        const avatarUrl = `/uploads/avatars/${req.file.filename}`;
        const user = await (0, student_service_1.updateProfile)(req.user._id, {
            avatar: avatarUrl,
        });
        res.status(200).json({
            success: true,
            message: "Profile picture uploaded successfully",
            data: user,
            avatarUrl,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message ||
                "Failed to upload profile picture",
        });
    }
};
exports.uploadProfilePicture = uploadProfilePicture;
// Get logged-in student's profile
const profile = async (req, res) => {
    try {
        const user = await (0, student_service_1.getProfile)(req.user._id);
        res.status(200).json({
            success: true,
            data: user,
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};
exports.profile = profile;
// Update student's profile
const update = async (req, res) => {
    try {
        const user = await (0, student_service_1.updateProfile)(req.user._id, req.body);
        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: user,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
exports.update = update;
