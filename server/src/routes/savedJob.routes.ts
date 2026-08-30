import { Router } from "express";
import {
  save,
  getMySavedJobs,
  removeSavedJob,
} from "../controllers/savedJob.controller";

import { protect, authorize } from "../middleware/auth.middleware";

const router = Router();

// Save a job
router.post(
  "/:jobId",
  protect,
  authorize("student"),
  save
);

// Get saved jobs
router.get(
  "/",
  protect,
  authorize("student"),
  getMySavedJobs
);

// Remove a saved job
router.delete(
  "/:jobId",
  protect,
  authorize("student"),
  removeSavedJob
);

export default router;