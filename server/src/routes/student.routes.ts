import { Router } from "express";
import { profile, update } from "../controllers/student.controller";
import { protect, authorize } from "../middleware/auth.middleware";

const router = Router();

// Get logged-in student's profile
router.get(
  "/profile",
  protect,
  authorize("student"),
  profile
);

// Update logged-in student's profile
router.put(
  "/profile",
  protect,
  authorize("student"),
  update
);

export default router;