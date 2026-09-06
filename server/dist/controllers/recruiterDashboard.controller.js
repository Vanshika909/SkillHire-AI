"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getApplicationStats = exports.getMyJobs = exports.getDashboard = void 0;
const recruiterDashboard_service_1 = require("../services/recruiterDashboard.service");
const recruiterDashboard_service_2 = require("../services/recruiterDashboard.service");
// Get recruiter dashboard
const getDashboard = async (req, res) => {
    try {
        const dashboard = await (0, recruiterDashboard_service_1.getRecruiterDashboard)(req.user._id);
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
// Get recruiter's jobs
const getMyJobs = async (req, res) => {
    try {
        const jobs = await (0, recruiterDashboard_service_2.getRecruiterJobs)(req.user._id);
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
exports.getMyJobs = getMyJobs;
// Get application stats for each job
const getApplicationStats = async (req, res) => {
    try {
        const stats = await (0, recruiterDashboard_service_2.getJobApplicationStats)(req.user._id);
        res.status(200).json({
            success: true,
            data: stats,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.getApplicationStats = getApplicationStats;
