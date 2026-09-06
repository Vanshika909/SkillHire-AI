import { Router, Response } from "express";
import {
  protect,
  authorize,
} from "../middleware/auth.middleware";
import {
  uploadAvatar,
} from "../middleware/upload.middleware";
const router = Router();

// ==========================================
// GET RECRUITER PROFILE
// ==========================================

router.get(
  "/",
  protect,
  authorize("recruiter"),
  async (req: any, res: Response) => {
    try {
      res.status(200).json({
        success: true,
        data: req.user,
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }
);

// ==========================================
// UPDATE RECRUITER PROFILE
// ==========================================

router.put(
  "/",
  protect,
  authorize("recruiter"),
  async (req: any, res: Response) => {
    try {
      Object.assign(req.user, req.body);
      const user = await req.user.save();

      res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: user,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
);

// ==========================================
// UPLOAD RECRUITER PROFILE PICTURE
// ==========================================

router.post(
  "/avatar",
  protect,
  authorize("recruiter"),
  uploadAvatar.single("avatar"),
  async (req: any, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Please upload a profile picture",
        });
      }

      const avatarUrl =
        `/uploads/avatars/${req.file.filename}`;

      req.user.avatar = avatarUrl;
      const user = await req.user.save();

      res.status(200).json({
        success: true,
        message:
          "Profile picture uploaded successfully",
        data: user,
        avatarUrl,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message:
          error.message ||
          "Failed to upload profile picture",
      });
    }
  }
);

export default router;