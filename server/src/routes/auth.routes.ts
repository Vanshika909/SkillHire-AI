import { Router } from "express";
import { register } from "../controllers/auth.controller";
const router = Router();

// Test Route
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Auth route is working!",
  });
});

router.post("/register",register)
export default router;