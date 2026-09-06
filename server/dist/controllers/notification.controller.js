"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTestNotification = exports.readAllNotifications = exports.readNotification = exports.getMyNotifications = void 0;
const notification_service_1 = require("../services/notification.service");
// Get my notifications
const getMyNotifications = async (req, res) => {
    try {
        const notifications = await (0, notification_service_1.getNotifications)(req.user._id);
        res.status(200).json({
            success: true,
            count: notifications.length,
            data: notifications,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.getMyNotifications = getMyNotifications;
// Mark one notification as read
const readNotification = async (req, res) => {
    try {
        const notification = await (0, notification_service_1.markAsRead)(req.user._id, req.params.id);
        res.status(200).json({
            success: true,
            message: "Notification marked as read",
            data: notification,
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};
exports.readNotification = readNotification;
// Mark all notifications as read
const readAllNotifications = async (req, res) => {
    try {
        const result = await (0, notification_service_1.markAllAsRead)(req.user._id);
        res.status(200).json({
            success: true,
            ...result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.readAllNotifications = readAllNotifications;
// Create a test notification
const createTestNotification = async (req, res) => {
    try {
        const notification = await (0, notification_service_1.createNotification)(req.user._id, "Test notification from SkillHire AI", "System");
        res.status(201).json({
            success: true,
            message: "Notification created",
            data: notification,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.createTestNotification = createTestNotification;
