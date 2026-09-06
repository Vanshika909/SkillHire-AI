"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.getJob = exports.getJobs = exports.create = void 0;
const job_service_1 = require("../services/job.service");
const create = async (req, res) => {
    try {
        const job = await (0, job_service_1.createJob)({
            ...req.body,
            recruiter: req.user._id,
        });
        res.status(201).json({
            success: true,
            message: "Job created successfully",
            data: job,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
exports.create = create;
const getJobs = async (req, res) => {
    try {
        const id = String(req.params.id);
        const { jobs, total } = await (0, job_service_1.getAllJobs)(req.query);
        res.status(200).json({
            success: true,
            count: jobs.length,
            total,
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
const getJob = async (req, res) => {
    try {
        const id = String(req.params.id);
        const job = await (0, job_service_1.getJobById)(id);
        res.status(200).json({
            success: true,
            data: job,
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};
exports.getJob = getJob;
const update = async (req, res) => {
    try {
        const id = String(req.params.id);
        const job = await (0, job_service_1.updateJob)(id, req.body);
        res.status(200).json({
            success: true,
            message: "Job updated successfully",
            data: job,
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};
exports.update = update;
const remove = async (req, res) => {
    try {
        const id = String(req.params.id);
        const result = await (0, job_service_1.deleteJob)(id);
        res.status(200).json({
            success: true,
            ...result,
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};
exports.remove = remove;
