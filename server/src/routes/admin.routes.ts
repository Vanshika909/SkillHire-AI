import { Router } from "express";
import { protect, authorize } from "../middleware/auth.middleware";
import { getDashboard, getUsers, } from "../controllers/admin.controller";

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

export default router;