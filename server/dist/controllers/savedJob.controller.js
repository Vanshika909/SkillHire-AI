"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeSavedJob = exports.getMySavedJobs = exports.save = void 0;
const savedJob_service_1 = require("../services/savedJob.service");
// Save a job
const save = async (req, res) => {
    try {
        const savedJob = await (0, savedJob_service_1.saveJob)(req.user._id, req.params.jobId);
        res.status(201).json({
            success: true,
            message: "Job saved successfully",
            data: savedJob,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
exports.save = save;
// Get saved jobs
const getMySavedJobs = async (req, res) => {
    try {
        const jobs = await (0, savedJob_service_1.getSavedJobs)(req.user._id);
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
exports.getMySavedJobs = getMySavedJobs;
// Remove a saved job
const removeSavedJob = async (req, res) => {
    try {
        const result = await (0, savedJob_service_1.unsaveJob)(req.user._id, req.params.jobId);
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
exports.removeSavedJob = removeSavedJob;
