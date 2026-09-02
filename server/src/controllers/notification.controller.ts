import { Response } from "express";
import {
  createNotification,
  getNotifications,
  markAsRead,
  markAllAsRead,
} from "../services/notification.service";

// Get my notifications
export const getMyNotifications = async (
  req: any,
  res: Response
) => {
  try {
    const notifications = await getNotifications(
      req.user._id
    );

    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Mark one notification as read
export const readNotification = async (
  req: any,
  res: Response
) => {
  try {
    const notification = await markAsRead(
      req.user._id,
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
      data: notification,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// Mark all notifications as read
export const readAllNotifications = async (
  req: any,
  res: Response
) => {
  try {
    const result = await markAllAsRead(req.user._id);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create a test notification
export const createTestNotification = async (
  req: any,
  res: Response
) => {
  try {
    const notification = await createNotification(
      req.user._id,
      "Test notification from SkillHire AI",
      "System"
    );

    res.status(201).json({
      success: true,
      message: "Notification created",
      data: notification,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};