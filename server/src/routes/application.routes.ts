import { Router } from "express";
import {
  apply,
  getMyApplications,
  withdraw,
  getApplicants,
  updateStatus,
} from "../controllers/application.controller";


import { protect, authorize } from "../middleware/auth.middleware";

const router = Router();

// Apply for a job
router.post(
  "/:jobId",
  protect,
  authorize("student"),
  apply
);

// Get logged-in student's applications
router.get(
  "/",
  protect,
  authorize("student"),
  getMyApplications
);

// Withdraw an application
router.delete(
  "/:id",
  protect,
  authorize("student"),
  withdraw
);

export default router;

// Recruiter: view applicants for a job
router.get(
  "/job/:jobId",
  protect,
  authorize("recruiter"),
  getApplicants
);

// Recruiter: update application status
router.put(
  "/:id/status",
  protect,
  authorize("recruiter"),
  updateStatus
);