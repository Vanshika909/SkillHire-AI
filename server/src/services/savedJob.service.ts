import SavedJob from "../models/savedJob.model";
import Job from "../models/job.model";

// Save a job
export const saveJob = async (
  studentId: string,
  jobId: string
) => {
  // Check if job exists
  const job = await Job.findById(jobId);

  if (!job) {
    throw new Error("Job not found");
  }

  // Check if already saved
  const existingSavedJob = await SavedJob.findOne({
    student: studentId,
    job: jobId,
  });

  if (existingSavedJob) {
    throw new Error("Job already saved");
  }

  return await SavedJob.create({
    student: studentId,
    job: jobId,
  });
};

// Get student's saved jobs
export const getSavedJobs = async (studentId: string) => {
  return await SavedJob.find({
    student: studentId,
  })
    .populate("job")
    .sort({ createdAt: -1 });
};

// Remove saved job
export const unsaveJob = async (
  studentId: string,
  jobId: string
) => {
  const savedJob = await SavedJob.findOneAndDelete({
    student: studentId,
    job: jobId,
  });

  if (!savedJob) {
    throw new Error("Saved job not found");
  }

  return {
    message: "Job removed from saved jobs",
  };
};