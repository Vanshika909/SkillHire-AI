"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteJob = exports.updateJob = exports.getJobById = exports.getAllJobs = exports.createJob = void 0;
const job_model_1 = __importDefault(require("../models/job.model"));
const createJob = async (data) => {
    const job = await job_model_1.default.create(data);
    return job;
};
exports.createJob = createJob;
// Get jobs with search, filters and pagination
const getAllJobs = async (query) => {
    const { keyword, location, employmentType, page = 1, limit = 10, } = query;
    const filter = {};
    // Search by title or company
    if (keyword) {
        filter.$or = [
            { title: { $regex: keyword, $options: "i" } },
            { company: { $regex: keyword, $options: "i" } },
        ];
    }
    // Filter by location
    if (location) {
        filter.location = location;
    }
    // Filter by employment type
    if (employmentType) {
        filter.employmentType = employmentType;
    }
    const jobs = await job_model_1.default.find(filter)
        .populate("recruiter", "name email")
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit));
    const total = await job_model_1.default.countDocuments(filter);
    return {
        jobs,
        total,
    };
};
exports.getAllJobs = getAllJobs;
const getJobById = async (id) => {
    const job = await job_model_1.default.findById(id).populate("recruiter", "name email");
    if (!job) {
        throw new Error("Job not found");
    }
    return job;
};
exports.getJobById = getJobById;
const updateJob = async (id, data) => {
    const job = await job_model_1.default.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    });
    if (!job) {
        throw new Error("Job not found");
    }
    return job;
};
exports.updateJob = updateJob;
const deleteJob = async (id) => {
    const job = await job_model_1.default.findByIdAndDelete(id);
    if (!job) {
        throw new Error("Job not found");
    }
    return {
        message: "Job deleted successfully",
    };
};
exports.deleteJob = deleteJob;
