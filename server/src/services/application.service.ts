import Application from "../models/application.model";
import Job from "../models/job.model";
import { createNotification } from "./notification.service";
// Student applies for a job
export const applyForJob = async (
  studentId: string,
  jobId: string,
  coverLetter: string = ""
) => {
  // Check if job exists
  const job = await Job.findById(jobId);

  if (!job) {
    throw new Error("Job not found");
  }

  // Prevent duplicate applications
  const existingApplication = await Application.findOne({
    student: studentId,
    job: jobId,
  });

  if (existingApplication) {
    throw new Error("You have already applied for this job");
  }

  const application = await Application.create({
    student: studentId,
    job: jobId,
    coverLetter,
  });

  return application;
};

// Get all applications of a student
export const getStudentApplications = async (studentId: string) => {
  return await Application.find({
    student: studentId,
  })
    .populate("job")
    .sort({ createdAt: -1 });
};

// Withdraw application
export const withdrawApplication = async (
  studentId: string,
  applicationId: string
) => {
  const application = await Application.findOne({
    _id: applicationId,
    student: studentId,
  });

  if (!application) {
    throw new Error("Application not found");
  }

  await Application.findByIdAndDelete(applicationId);

  return {
    message: "Application withdrawn successfully",
  };
};

// Get applicants for a recruiter's job
export const getJobApplicants = async (
  recruiterId: string,
  jobId: string
) => {
  const job = await Job.findOne({
    _id: jobId,
    recruiter: recruiterId,
  });

  if (!job) {
    throw new Error("Job not found or not owned by recruiter");
  }

  return await Application.find({ job: jobId })
    .populate("student", "-password")
    .populate("job")
    .sort({ createdAt: -1 });
};

// Update application status
export const updateApplicationStatus = async (
  recruiterId: string,
  applicationId: string,
  status: "Pending" | "Shortlisted" | "Rejected" | "Hired"
) => {
  const application = await Application.findById(applicationId);

  if (!application) {
    throw new Error("Application not found");
  }

  const job = await Job.findOne({
    _id: application.job,
    recruiter: recruiterId,
  });

  if (!job) {
    throw new Error("You are not authorized to update this application");
  }

  application.status = status;

  await application.save();

  await createNotification(
    application.student.toString(),
    `Your application status for "${job.title}" has been updated to ${status}.`,
    "Application"
  );

  return application;
};

