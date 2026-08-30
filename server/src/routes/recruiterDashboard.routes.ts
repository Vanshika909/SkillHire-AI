import { Router } from "express";
import { protect, authorize } from "../middleware/auth.middleware";
import { getDashboard, getMyJobs, getApplicationStats, } from "../controllers/recruiterDashboard.controller";

const router = Router();

// Get recruiter dashboard statistics
router.get(
  "/",
  protect,
  authorize("recruiter"),
  getDashboard
);

// Get recruiter's jobs
router.get(
  "/jobs",
  protect,
  authorize("recruiter"),
  getMyJobs
);

// Get application stats for each job
router.get(
  "/application-stats",
  protect,
  authorize("recruiter"),
  getApplicationStats
);

export default router;