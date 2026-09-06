"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unsaveJob = exports.getSavedJobs = exports.saveJob = void 0;
const savedJob_model_1 = __importDefault(require("../models/savedJob.model"));
const job_model_1 = __importDefault(require("../models/job.model"));
// Save a job
const saveJob = async (studentId, jobId) => {
    // Check if job exists
    const job = await job_model_1.default.findById(jobId);
    if (!job) {
        throw new Error("Job not found");
    }
    // Check if already saved
    const existingSavedJob = await savedJob_model_1.default.findOne({
        student: studentId,
        job: jobId,
    });
    if (existingSavedJob) {
        throw new Error("Job already saved");
    }
    return await savedJob_model_1.default.create({
        student: studentId,
        job: jobId,
    });
};
exports.saveJob = saveJob;
// Get student's saved jobs
const getSavedJobs = async (studentId) => {
    return await savedJob_model_1.default.find({
        student: studentId,
    })
        .populate("job")
        .sort({ createdAt: -1 });
};
exports.getSavedJobs = getSavedJobs;
// Remove saved job
const unsaveJob = async (studentId, jobId) => {
    const savedJob = await savedJob_model_1.default.findOneAndDelete({
        student: studentId,
        job: jobId,
    });
    if (!savedJob) {
        throw new Error("Saved job not found");
    }
    return {
        message: "Job removed from saved jobs",
    };
};
exports.unsaveJob = unsaveJob;
