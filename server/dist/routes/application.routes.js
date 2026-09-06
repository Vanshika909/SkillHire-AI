"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const application_controller_1 = require("../controllers/application.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Apply for a job
router.post("/:jobId", auth_middleware_1.protect, (0, auth_middleware_1.authorize)("student"), application_controller_1.apply);
// Get logged-in student's applications
router.get("/", auth_middleware_1.protect, (0, auth_middleware_1.authorize)("student"), application_controller_1.getMyApplications);
// Withdraw an application
router.delete("/:id", auth_middleware_1.protect, (0, auth_middleware_1.authorize)("student"), application_controller_1.withdraw);
exports.default = router;
// Recruiter: view applicants for a job
router.get("/job/:jobId", auth_middleware_1.protect, (0, auth_middleware_1.authorize)("recruiter"), application_controller_1.getApplicants);
// Recruiter: update application status
router.put("/:id/status", auth_middleware_1.protect, (0, auth_middleware_1.authorize)("recruiter"), application_controller_1.updateStatus);
