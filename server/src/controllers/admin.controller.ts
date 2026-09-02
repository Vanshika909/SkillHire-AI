import { Request, Response } from "express";
import {  getAdminDashboard, getAllUsers, getAllJobs, getAllApplications,} from "../services/admin.service";

// Get admin dashboard statistics
export const getDashboard = async (
  req: Request,
  res: Response
) => {
  try {
    const dashboard = await getAdminDashboard();

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

// Get all users
export const getUsers = async (
  req: Request,
  res: Response
) => {
  try {
    const users = await getAllUsers();

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all applications
export const getApplications = async (
  req: Request,
  res: Response
) => {
  try {
    const applications = await getAllApplications();

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all jobs
export const getJobs = async (
  req: Request,
  res: Response
) => {
  try {
    const jobs = await getAllJobs();

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