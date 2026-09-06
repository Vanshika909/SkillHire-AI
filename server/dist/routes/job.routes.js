"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const job_controller_1 = require("../controllers/job.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Public Routes
router.get("/", job_controller_1.getJobs);
router.get("/:id", job_controller_1.getJob);
// Recruiter Only
router.post("/", auth_middleware_1.protect, (0, auth_middleware_1.authorize)("recruiter"), job_controller_1.create);
router.put("/:id", auth_middleware_1.protect, (0, auth_middleware_1.authorize)("recruiter"), job_controller_1.update);
// Admin or Recruiter
router.delete("/:id", auth_middleware_1.protect, (0, auth_middleware_1.authorize)("admin", "recruiter"), job_controller_1.remove);
exports.default = router;
