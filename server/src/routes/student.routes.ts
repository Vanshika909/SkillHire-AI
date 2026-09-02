import { Router } from "express";
import { profile, update } from "../controllers/student.controller";
import { protect, authorize } from "../middleware/auth.middleware";
import { uploadResume } from "../middleware/upload.middleware";
import { Response } from "express";
import {
  getProfile,
  updateProfile,
} from "../services/student.service";
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
router.post(
  "/profile/resume",
  protect,
  authorize("student"),
  uploadResume.single("resume"),
  async (req: any, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Please upload a PDF resume",
        });
      }

      const resumeUrl = `/uploads/resumes/${req.file.filename}`;

      const user = await updateProfile(req.user._id, {
        resume: resumeUrl,
      });

      res.status(200).json({
        success: true,
        message: "Resume uploaded successfully",
        data: user,
        resumeUrl,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
);

export default router;