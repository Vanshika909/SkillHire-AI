"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJobs = exports.getApplications = exports.changeUserRole = exports.removeUser = exports.getUsers = exports.getDashboard = void 0;
const admin_service_1 = require("../services/admin.service");
// Get admin dashboard statistics
const getDashboard = async (req, res) => {
    try {
        const dashboard = await (0, admin_service_1.getAdminDashboard)();
        res.status(200).json({
            success: true,
            data: dashboard,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.getDashboard = getDashboard;
// Get all users
const getUsers = async (req, res) => {
    try {
        const users = await (0, admin_service_1.getAllUsers)();
        res.status(200).json({
            success: true,
            count: users.length,
            data: users,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.getUsers = getUsers;
// Delete user
const removeUser = async (req, res) => {
    try {
        const userId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const adminId = req.user?._id?.toString();
        if (!adminId) {
            return res.status(401).json({
                success: false,
                message: "Admin authentication required.",
            });
        }
        const deletedUser = await (0, admin_service_1.deleteUser)(userId, adminId);
        res.status(200).json({
            success: true,
            message: "User deleted successfully.",
            data: deletedUser,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
exports.removeUser = removeUser;
// Change user role
const changeUserRole = async (req, res) => {
    try {
        const userId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const { role } = req.body;
        const adminId = req.user?._id?.toString();
        if (!adminId) {
            return res.status(401).json({
                success: false,
                message: "Admin authentication required.",
            });
        }
        const updatedUser = await (0, admin_service_1.updateUserRole)(userId, role, adminId);
        res.status(200).json({
            success: true,
            message: "User role updated successfully.",
            data: updatedUser,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
exports.changeUserRole = changeUserRole;
// Get all applications
const getApplications = async (req, res) => {
    try {
        const applications = await (0, admin_service_1.getAllApplications)();
        res.status(200).json({
            success: true,
            count: applications.length,
            data: applications,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.getApplications = getApplications;
// Get all jobs
const getJobs = async (req, res) => {
    try {
        const jobs = await (0, admin_service_1.getAllJobs)();
        res.status(200).json({
            success: true,
            count: jobs.length,
            data: jobs,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.getJobs = getJobs;
