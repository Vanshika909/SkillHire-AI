"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const admin_controller_1 = require("../controllers/admin.controller");
const router = (0, express_1.Router)();
// Get admin dashboard
router.get("/dashboard", auth_middleware_1.protect, (0, auth_middleware_1.authorize)("admin"), admin_controller_1.getDashboard);
// Get all users
router.get("/users", auth_middleware_1.protect, (0, auth_middleware_1.authorize)("admin"), admin_controller_1.getUsers);
// Get all jobs
router.get("/jobs", auth_middleware_1.protect, (0, auth_middleware_1.authorize)("admin"), admin_controller_1.getJobs);
router.get("/applications", auth_middleware_1.protect, (0, auth_middleware_1.authorize)("admin"), admin_controller_1.getApplications);
router.delete("/users/:id", auth_middleware_1.protect, (0, auth_middleware_1.authorize)("admin"), admin_controller_1.removeUser);
router.put("/users/:id/role", auth_middleware_1.protect, (0, auth_middleware_1.authorize)("admin"), admin_controller_1.changeUserRole);
exports.default = router;
