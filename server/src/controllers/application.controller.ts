import { Response } from "express";
import {
  applyForJob,
  getStudentApplications,
  withdrawApplication,
  getJobApplicants,
  updateApplicationStatus,
} from "../services/application.service";

// Apply for a job
export const apply = async (req: any, res: Response) => {
  try {
    const application = await applyForJob(
      req.user._id,
      req.params.jobId,
      req.body.coverLetter
    );

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      data: application,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get logged-in student's applications
export const getMyApplications = async (
  req: any,
  res: Response
) => {
  try {
    const applications = await getStudentApplications(
      req.user._id
    );

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

// Withdraw an application
export const withdraw = async (
  req: any,
  res: Response
) => {
  try {
    const result = await withdrawApplication(
      req.user._id,
      req.params.id
    );

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get applicants for recruiter's job
export const getApplicants = async (req: any, res: Response) => {
  try {
    const applications = await getJobApplicants(
      req.user._id,
      req.params.jobId
    );

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// Update application status
export const updateStatus = async (req: any, res: Response) => {
  try {
    const { status } = req.body;

    const application = await updateApplicationStatus(
      req.user._id,
      req.params.id,
      status
    );

    res.status(200).json({
      success: true,
      message: "Application status updated successfully",
      data: application,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};