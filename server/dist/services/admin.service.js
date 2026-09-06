"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserRole = exports.deleteUser = exports.getAllApplications = exports.getAllJobs = exports.getAllUsers = exports.getAdminDashboard = void 0;
const user_1 = __importDefault(require("../models/user"));
const job_model_1 = __importDefault(require("../models/job.model"));
const application_model_1 = __importDefault(require("../models/application.model"));
// Get admin dashboard statistics
const getAdminDashboard = async () => {
    // Count users by role
    const totalUsers = await user_1.default.countDocuments();
    const totalStudents = await user_1.default.countDocuments({
        role: "student",
    });
    const totalRecruiters = await user_1.default.countDocuments({
        role: "recruiter",
    });
    const totalAdmins = await user_1.default.countDocuments({
        role: "admin",
    });
    // Count jobs
    const totalJobs = await job_model_1.default.countDocuments();
    // Count applications
    const totalApplications = await application_model_1.default.countDocuments();
    const pendingApplications = await application_model_1.default.countDocuments({
        status: "Pending",
    });
    const hiredApplications = await application_model_1.default.countDocuments({
        status: "Hired",
    });
    return {
        totalUsers,
        totalStudents,
        totalRecruiters,
        totalAdmins,
        totalJobs,
        totalApplications,
        pendingApplications,
        hiredApplications,
    };
};
exports.getAdminDashboard = getAdminDashboard;
// Get all users
const getAllUsers = async () => {
    return await user_1.default.find()
        .select("-password")
        .sort({ createdAt: -1 });
};
exports.getAllUsers = getAllUsers;
// Get all jobs
const getAllJobs = async () => {
    return await job_model_1.default.find()
        .populate("recruiter", "name email")
        .sort({ createdAt: -1 });
};
exports.getAllJobs = getAllJobs;
// Get all applications
const getAllApplications = async () => {
    return await application_model_1.default.find()
        .populate("student", "name email")
        .populate("job", "title company")
        .sort({ createdAt: -1 });
};
exports.getAllApplications = getAllApplications;
// Delete a user
const deleteUser = async (userId, adminId) => {
    // Prevent admin from deleting their own account
    if (userId === adminId) {
        throw new Error("You cannot delete your own admin account.");
    }
    const user = await user_1.default.findById(userId);
    if (!user) {
        throw new Error("User not found.");
    }
    await user_1.default.findByIdAndDelete(userId);
    return user;
};
exports.deleteUser = deleteUser;
// Change user role
const updateUserRole = async (userId, newRole, adminId) => {
    // Prevent admin from changing their own role
    if (userId === adminId) {
        throw new Error("You cannot change your own admin role.");
    }
    const allowedRoles = ["student", "recruiter", "admin"];
    if (!allowedRoles.includes(newRole)) {
        throw new Error("Invalid role.");
    }
    const user = await user_1.default.findById(userId);
    if (!user) {
        throw new Error("User not found.");
    }
    user.role = newRole;
    await user.save();
    return user;
};
exports.updateUserRole = updateUserRole;
