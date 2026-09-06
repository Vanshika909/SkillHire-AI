"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateApplicationStatus = exports.getJobApplicants = exports.withdrawApplication = exports.getStudentApplications = exports.applyForJob = void 0;
const application_model_1 = __importDefault(require("../models/application.model"));
const job_model_1 = __importDefault(require("../models/job.model"));
const notification_service_1 = require("./notification.service");
// Student applies for a job
const applyForJob = async (studentId, jobId, coverLetter = "") => {
    // Check if job exists
    const job = await job_model_1.default.findById(jobId);
    if (!job) {
        throw new Error("Job not found");
    }
    // Prevent duplicate applications
    const existingApplication = await application_model_1.default.findOne({
        student: studentId,
        job: jobId,
    });
    if (existingApplication) {
        throw new Error("You have already applied for this job");
    }
    const application = await application_model_1.default.create({
        student: studentId,
        job: jobId,
        coverLetter,
    });
    return application;
};
exports.applyForJob = applyForJob;
// Get all applications of a student
const getStudentApplications = async (studentId) => {
    return await application_model_1.default.find({
        student: studentId,
    })
        .populate("job")
        .sort({ createdAt: -1 });
};
exports.getStudentApplications = getStudentApplications;
// Withdraw application
const withdrawApplication = async (studentId, applicationId) => {
    const application = await application_model_1.default.findOne({
        _id: applicationId,
        student: studentId,
    });
    if (!application) {
        throw new Error("Application not found");
    }
    await application_model_1.default.findByIdAndDelete(applicationId);
    return {
        message: "Application withdrawn successfully",
    };
};
exports.withdrawApplication = withdrawApplication;
// Get applicants for a recruiter's job
const getJobApplicants = async (recruiterId, jobId) => {
    const job = await job_model_1.default.findOne({
        _id: jobId,
        recruiter: recruiterId,
    });
    if (!job) {
        throw new Error("Job not found or not owned by recruiter");
    }
    return await application_model_1.default.find({ job: jobId })
        .populate("student", "-password")
        .populate("job")
        .sort({ createdAt: -1 });
};
exports.getJobApplicants = getJobApplicants;
// Update application status
const updateApplicationStatus = async (recruiterId, applicationId, status) => {
    const application = await application_model_1.default.findById(applicationId);
    if (!application) {
        throw new Error("Application not found");
    }
    const job = await job_model_1.default.findOne({
        _id: application.job,
        recruiter: recruiterId,
    });
    if (!job) {
        throw new Error("You are not authorized to update this application");
    }
    application.status = status;
    await application.save();
    await (0, notification_service_1.createNotification)(application.student.toString(), `Your application status for "${job.title}" has been updated to ${status}.`, "Application");
    return application;
};
exports.updateApplicationStatus = updateApplicationStatus;
