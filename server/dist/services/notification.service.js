"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markAllAsRead = exports.markAsRead = exports.getNotifications = exports.createNotification = void 0;
const notification_model_1 = __importDefault(require("../models/notification.model"));
// Create a notification
const createNotification = async (userId, message, type = "System") => {
    return await notification_model_1.default.create({
        user: userId,
        message,
        type,
    });
};
exports.createNotification = createNotification;
// Get user's notifications
const getNotifications = async (userId) => {
    return await notification_model_1.default.find({
        user: userId,
    }).sort({ createdAt: -1 });
};
exports.getNotifications = getNotifications;
// Mark notification as read
const markAsRead = async (userId, notificationId) => {
    const notification = await notification_model_1.default.findOneAndUpdate({
        _id: notificationId,
        user: userId,
    }, {
        isRead: true,
    }, { new: true });
    if (!notification) {
        throw new Error("Notification not found");
    }
    return notification;
};
exports.markAsRead = markAsRead;
// Mark all notifications as read
const markAllAsRead = async (userId) => {
    await notification_model_1.default.updateMany({
        user: userId,
        isRead: false,
    }, {
        isRead: true,
    });
    return {
        message: "All notifications marked as read",
    };
};
exports.markAllAsRead = markAllAsRead;
