import { Request, Response } from "express";
import {
  getProfile,
  updateProfile,
} from "../services/student.service";
import { uploadAvatar } from "../middleware/upload.middleware";




export const uploadProfilePicture = async (
  req: any,
  res: Response
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a profile picture",
      });
    }

    const avatarUrl = `/uploads/avatars/${req.file.filename}`;

    const user = await updateProfile(
      req.user._id,
      {
        avatar: avatarUrl,
      }
    );

    res.status(200).json({
      success: true,
      message: "Profile picture uploaded successfully",
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
};
// Get logged-in student's profile
export const profile = async (req: any, res: Response) => {
  try {
    const user = await getProfile(req.user._id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// Update student's profile
export const update = async (req: any, res: Response) => {
  try {
    const user = await updateProfile(req.user._id, req.body);

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
};