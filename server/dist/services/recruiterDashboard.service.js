"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJobApplicationStats = exports.getRecruiterJobs = exports.getRecruiterDashboard = void 0;
const job_model_1 = __importDefault(require("../models/job.model"));
const application_model_1 = __importDefault(require("../models/application.model"));
// Get recruiter dashboard statistics
const getRecruiterDashboard = async (recruiterId) => {
    // Find jobs created by this recruiter
    const jobs = await job_model_1.default.find({
        recruiter: recruiterId,
    }).select("_id");
    const jobIds = jobs.map((job) => job._id);
    // Count applications for these jobs
    const totalApplications = await application_model_1.default.countDocuments({
        job: { $in: jobIds },
    });
    const pendingApplications = await application_model_1.default.countDocuments({
        job: { $in: jobIds },
        status: "Pending",
    });
    const shortlistedApplications = await application_model_1.default.countDocuments({
        job: { $in: jobIds },
        status: "Shortlisted",
    });
    const rejectedApplications = await application_model_1.default.countDocuments({
        job: { $in: jobIds },
        status: "Rejected",
    });
    const hiredApplications = await application_model_1.default.countDocuments({
        job: { $in: jobIds },
        status: "Hired",
    });
    return {
        totalJobs: jobs.length,
        totalApplications,
        pendingApplications,
        shortlistedApplications,
        rejectedApplications,
        hiredApplications,
    };
};
exports.getRecruiterDashboard = getRecruiterDashboard;
const getRecruiterJobs = async (recruiterId) => {
    // Get jobs created by this recruiter
    return await job_model_1.default.find({
        recruiter: recruiterId,
    }).sort({ createdAt: -1 });
};
exports.getRecruiterJobs = getRecruiterJobs;
// Get application statistics for each recruiter job
const getJobApplicationStats = async (recruiterId) => {
    const jobs = await job_model_1.default.find({
        recruiter: recruiterId,
    }).select("_id title company");
    const stats = await Promise.all(jobs.map(async (job) => {
        // Find applications for this job
        const applications = await application_model_1.default.find({
            job: job._id,
        }).select("status");
        return {
            jobId: job._id,
            title: job.title,
            company: job.company,
            totalApplications: applications.length,
            pending: applications.filter((app) => app.status === "Pending").length,
            shortlisted: applications.filter((app) => app.status === "Shortlisted").length,
            rejected: applications.filter((app) => app.status === "Rejected").length,
            hired: applications.filter((app) => app.status === "Hired").length,
        };
    }));
    return stats;
};
exports.getJobApplicationStats = getJobApplicationStats;
