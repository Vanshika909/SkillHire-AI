import { Response } from "express";
import {
  saveJob,
  getSavedJobs,
  unsaveJob,
} from "../services/savedJob.service";

// Save a job
export const save = async (req: any, res: Response) => {
  try {
    const savedJob = await saveJob(
      req.user._id,
      req.params.jobId
    );

    res.status(201).json({
      success: true,
      message: "Job saved successfully",
      data: savedJob,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get saved jobs
export const getMySavedJobs = async (
  req: any,
  res: Response
) => {
  try {
    const jobs = await getSavedJobs(req.user._id);

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Remove a saved job
export const removeSavedJob = async (
  req: any,
  res: Response
) => {
  try {
    const result = await unsaveJob(
      req.user._id,
      req.params.jobId
    );

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};