import Notification from "../models/notification.model";

// Create a notification
export const createNotification = async (
  userId: string,
  message: string,
  type: "Application" | "Job" | "System" = "System"
) => {
  return await Notification.create({
    user: userId,
    message,
    type,
  });
};

// Get user's notifications
export const getNotifications = async (userId: string) => {
  return await Notification.find({
    user: userId,
  }).sort({ createdAt: -1 });
};

// Mark notification as read
export const markAsRead = async (
  userId: string,
  notificationId: string
) => {
  const notification = await Notification.findOneAndUpdate(
    {
      _id: notificationId,
      user: userId,
    },
    {
      isRead: true,
    },
    { new: true }
  );

  if (!notification) {
    throw new Error("Notification not found");
  }

  return notification;
};

// Mark all notifications as read
export const markAllAsRead = async (userId: string) => {
  await Notification.updateMany(
    {
      user: userId,
      isRead: false,
    },
    {
      isRead: true,
    }
  );

  return {
    message: "All notifications marked as read",
  };
};