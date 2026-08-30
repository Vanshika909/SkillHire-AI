import { Router } from "express";
import {
  create,
  getJobs,
  getJob,
  update,
  remove,
} from "../controllers/job.controller";

import { protect, authorize } from "../middleware/auth.middleware";

const router = Router();

// Public Routes
router.get("/", getJobs);
router.get("/:id", getJob);

// Recruiter Only
router.post("/", protect, authorize("recruiter"), create);
router.put("/:id", protect, authorize("recruiter"), update);

// Admin or Recruiter
router.delete(
  "/:id",
  protect,
  authorize("admin", "recruiter"),
  remove
);

export default router;