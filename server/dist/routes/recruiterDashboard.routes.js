"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const recruiterDashboard_controller_1 = require("../controllers/recruiterDashboard.controller");
const router = (0, express_1.Router)();
// Get recruiter dashboard statistics
router.get("/", auth_middleware_1.protect, (0, auth_middleware_1.authorize)("recruiter"), recruiterDashboard_controller_1.getDashboard);
// Get recruiter's jobs
router.get("/jobs", auth_middleware_1.protect, (0, auth_middleware_1.authorize)("recruiter"), recruiterDashboard_controller_1.getMyJobs);
// Get application stats for each job
router.get("/application-stats", auth_middleware_1.protect, (0, auth_middleware_1.authorize)("recruiter"), recruiterDashboard_controller_1.getApplicationStats);
exports.default = router;
