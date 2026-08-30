import { Router } from "express";
import { protect, authorize } from "../middleware/auth.middleware";
import { register, login } from "../controllers/auth.controller";
const router = Router();

// Test Route
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Auth route is working!",
  });
});

router.get("/me", protect, (req: any, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

router.post("/register",register);
router.post("/login", login);

router.get(
  "/student-dashboard",
  protect,
  authorize("student"),
  (req: any, res) => {
    res.json({
      success: true,
      message: "Welcome Student!",
    });
  }
);

router.get(
  "/recruiter-dashboard",
  protect,
  authorize("recruiter"),
  (req: any, res) => {
    res.json({
      success: true,
      message: "Welcome Recruiter!",
    });
  }
);

router.get(
  "/admin-dashboard",
  protect,
  authorize("admin"),
  (req: any, res) => {
    res.json({
      success: true,
      message: "Welcome Admin!",
    });
  }
);

export default router;