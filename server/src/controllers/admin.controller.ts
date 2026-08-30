import { Request, Response } from "express";
import {  getAdminDashboard, getAllUsers, } from "../services/admin.service";

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