"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const savedJob_controller_1 = require("../controllers/savedJob.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Save a job
router.post("/:jobId", auth_middleware_1.protect, (0, auth_middleware_1.authorize)("student"), savedJob_controller_1.save);
// Get saved jobs
router.get("/", auth_middleware_1.protect, (0, auth_middleware_1.authorize)("student"), savedJob_controller_1.getMySavedJobs);
// Remove a saved job
router.delete("/:jobId", auth_middleware_1.protect, (0, auth_middleware_1.authorize)("student"), savedJob_controller_1.removeSavedJob);
exports.default = router;
