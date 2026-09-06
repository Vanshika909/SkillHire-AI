"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const upload_middleware_1 = require("../middleware/upload.middleware");
const router = (0, express_1.Router)();
// ==========================================
// GET RECRUITER PROFILE
// ==========================================
router.get("/", auth_middleware_1.protect, (0, auth_middleware_1.authorize)("recruiter"), async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            data: req.user,
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error.message,
        });
    }
});
// ==========================================
// UPDATE RECRUITER PROFILE
// ==========================================
router.put("/", auth_middleware_1.protect, (0, auth_middleware_1.authorize)("recruiter"), async (req, res) => {
    try {
        Object.assign(req.user, req.body);
        const user = await req.user.save();
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
});
// ==========================================
// UPLOAD RECRUITER PROFILE PICTURE
// ==========================================
router.post("/avatar", auth_middleware_1.protect, (0, auth_middleware_1.authorize)("recruiter"), upload_middleware_1.uploadAvatar.single("avatar"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload a profile picture",
            });
        }
        const avatarUrl = `/uploads/avatars/${req.file.filename}`;
        req.user.avatar = avatarUrl;
        const user = await req.user.save();
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
});
exports.default = router;
