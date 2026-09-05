import { Router, Response } from "express";

import {
  profile,
  update,
  uploadProfilePicture,
} from "../controllers/student.controller";

import {
  protect,
  authorize,
} from "../middleware/auth.middleware";

import {
  uploadResume,
  uploadAvatar,
} from "../middleware/upload.middleware";

import {
  updateProfile,
} from "../services/student.service";

const router = Router();

// ==========================================
// GET PROFILE
// ==========================================

router.get(
  "/profile",
  protect,
  authorize("student"),
  profile
);

// ==========================================
// UPDATE PROFILE
// ==========================================

router.put(
  "/profile",
  protect,
  authorize("student"),
  update
);

// ==========================================
// UPLOAD PROFILE PICTURE
// ==========================================

router.post(
  "/profile/avatar",
  protect,
  authorize("student"),
  uploadAvatar.single("avatar"),
  uploadProfilePicture
);

// ==========================================
// UPLOAD RESUME
// ==========================================

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

      const resumeUrl =
        `/uploads/resumes/${req.file.filename}`;

      const user = await updateProfile(
        req.user._id,
        {
          resume: resumeUrl,
        }
      );

      return res.status(200).json({
        success: true,
        message: "Resume uploaded successfully",
        data: user,
        resumeUrl,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
);

export default router;