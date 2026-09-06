import { Request, Response } from "express";
import {  getAdminDashboard, getAllUsers, getAllJobs, getAllApplications,deleteUser,
  updateUserRole,} from "../services/admin.service";

type AuthenticatedUser = {
  _id?: string | { toString(): string };
};

type AuthenticatedRequest = Request & {
  user?: AuthenticatedUser;
};

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

// Delete user
export const removeUser = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const adminId = req.user?._id?.toString();

    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: "Admin authentication required.",
      });
    }

    const deletedUser = await deleteUser(
      userId,
      adminId
    );

    res.status(200).json({
      success: true,
      message: "User deleted successfully.",
      data: deletedUser,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Change user role
export const changeUserRole = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { role } = req.body;

    const adminId = req.user?._id?.toString();

    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: "Admin authentication required.",
      });
    }

    const updatedUser = await updateUserRole(
      userId,
      role,
      adminId
    );

    res.status(200).json({
      success: true,
      message: "User role updated successfully.",
      data: updatedUser,
    });
  } catch (error: any) {
    res.status(400).json({
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