import { Router } from "express";
import { protect, authorize } from "../middleware/auth.middleware";
import { getDashboard, getUsers, getJobs, getApplications, } from "../controllers/admin.controller";

const router = Router();

// Get admin dashboard
router.get(
  "/dashboard",
  protect,
  authorize("admin"),
  getDashboard
);

// Get all users
router.get(
  "/users",
  protect,
  authorize("admin"),
  getUsers
);

// Get all jobs
router.get(
  "/jobs",
  protect,
  authorize("admin"),
  getJobs
);

router.get(
  "/applications",
  protect,
  authorize("admin"),
  getApplications
);

export default router;