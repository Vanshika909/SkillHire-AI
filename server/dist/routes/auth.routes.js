"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const auth_controller_1 = require("../controllers/auth.controller");
const router = (0, express_1.Router)();
// Test Route
router.get("/test", (req, res) => {
    res.json({
        success: true,
        message: "Auth route is working!",
    });
});
router.get("/me", auth_middleware_1.protect, (req, res) => {
    res.json({
        success: true,
        user: req.user,
    });
});
router.post("/register", auth_controller_1.register);
router.post("/login", auth_controller_1.login);
router.get("/student-dashboard", auth_middleware_1.protect, (0, auth_middleware_1.authorize)("student"), (req, res) => {
    res.json({
        success: true,
        message: "Welcome Student!",
    });
});
router.get("/recruiter-dashboard", auth_middleware_1.protect, (0, auth_middleware_1.authorize)("recruiter"), (req, res) => {
    res.json({
        success: true,
        message: "Welcome Recruiter!",
    });
});
router.get("/admin-dashboard", auth_middleware_1.protect, (0, auth_middleware_1.authorize)("admin"), (req, res) => {
    res.json({
        success: true,
        message: "Welcome Admin!",
    });
});
exports.default = router;
