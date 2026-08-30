import { Response } from "express";
import { getRecruiterDashboard } from "../services/recruiterDashboard.service";
import {getRecruiterJobs, getJobApplicationStats,} from "../services/recruiterDashboard.service";
// Get recruiter dashboard
export const getDashboard = async (req: any, res: Response) => {
  try {
    const dashboard = await getRecruiterDashboard(req.user._id);

    res.status(200).json({
      success: true,
      data: dashboard,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Get recruiter's jobs
export const getMyJobs = async (req: any, res: Response) => {
  try {
    const jobs = await getRecruiterJobs(req.user._id);

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

// Get application stats for each job
export const getApplicationStats = async (
  req: any,
  res: Response
) => {
  try {
    const stats = await getJobApplicationStats(
      req.user._id
    );

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};