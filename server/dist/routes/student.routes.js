"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const student_controller_1 = require("../controllers/student.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const upload_middleware_1 = require("../middleware/upload.middleware");
const student_service_1 = require("../services/student.service");
const router = (0, express_1.Router)();
// ==========================================
// GET PROFILE
// ==========================================
router.get("/profile", auth_middleware_1.protect, (0, auth_middleware_1.authorize)("student"), student_controller_1.profile);
// ==========================================
// UPDATE PROFILE
// ==========================================
router.put("/profile", auth_middleware_1.protect, (0, auth_middleware_1.authorize)("student"), student_controller_1.update);
// ==========================================
// UPLOAD PROFILE PICTURE
// ==========================================
router.post("/profile/avatar", auth_middleware_1.protect, (0, auth_middleware_1.authorize)("student"), upload_middleware_1.uploadAvatar.single("avatar"), student_controller_1.uploadProfilePicture);
// ==========================================
// UPLOAD RESUME
// ==========================================
router.post("/profile/resume", auth_middleware_1.protect, (0, auth_middleware_1.authorize)("student"), upload_middleware_1.uploadResume.single("resume"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload a PDF resume",
            });
        }
        const resumeUrl = `/uploads/resumes/${req.file.filename}`;
        const user = await (0, student_service_1.updateProfile)(req.user._id, {
            resume: resumeUrl,
        });
        return res.status(200).json({
            success: true,
            message: "Resume uploaded successfully",
            data: user,
            resumeUrl,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});
exports.default = router;
