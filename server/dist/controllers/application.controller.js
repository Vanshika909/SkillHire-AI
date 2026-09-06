"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStatus = exports.getApplicants = exports.withdraw = exports.getMyApplications = exports.apply = void 0;
const application_service_1 = require("../services/application.service");
// Apply for a job
const apply = async (req, res) => {
    try {
        const application = await (0, application_service_1.applyForJob)(req.user._id, req.params.jobId, req.body.coverLetter);
        res.status(201).json({
            success: true,
            message: "Application submitted successfully",
            data: application,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
exports.apply = apply;
// Get logged-in student's applications
const getMyApplications = async (req, res) => {
    try {
        const applications = await (0, application_service_1.getStudentApplications)(req.user._id);
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
exports.getMyApplications = getMyApplications;
// Withdraw an application
const withdraw = async (req, res) => {
    try {
        const result = await (0, application_service_1.withdrawApplication)(req.user._id, req.params.id);
        res.status(200).json({
            success: true,
            ...result,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
exports.withdraw = withdraw;
// Get applicants for recruiter's job
const getApplicants = async (req, res) => {
    try {
        const applications = await (0, application_service_1.getJobApplicants)(req.user._id, req.params.jobId);
        res.status(200).json({
            success: true,
            count: applications.length,
            data: applications,
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};
exports.getApplicants = getApplicants;
// Update application status
const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const application = await (0, application_service_1.updateApplicationStatus)(req.user._id, req.params.id, status);
        res.status(200).json({
            success: true,
            message: "Application status updated successfully",
            data: application,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
exports.updateStatus = updateStatus;
