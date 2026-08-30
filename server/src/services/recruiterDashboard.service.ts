import Job from "../models/job.model";
import Application from "../models/application.model";

// Get recruiter dashboard statistics
export const getRecruiterDashboard = async (
  recruiterId: string
) => {
  // Find jobs created by this recruiter
  const jobs = await Job.find({
    recruiter: recruiterId,
  }).select("_id");

  const jobIds = jobs.map((job) => job._id);

  // Count applications for these jobs
  const totalApplications = await Application.countDocuments({
    job: { $in: jobIds },
  });

  const pendingApplications = await Application.countDocuments({
    job: { $in: jobIds },
    status: "Pending",
  });

  const shortlistedApplications = await Application.countDocuments({
    job: { $in: jobIds },
    status: "Shortlisted",
  });

  const rejectedApplications = await Application.countDocuments({
    job: { $in: jobIds },
    status: "Rejected",
  });

  const hiredApplications = await Application.countDocuments({
    job: { $in: jobIds },
    status: "Hired",
  });

  return {
    totalJobs: jobs.length,
    totalApplications,
    pendingApplications,
    shortlistedApplications,
    rejectedApplications,
    hiredApplications,
  };
};

export const getRecruiterJobs = async (recruiterId: string) => {
  // Get jobs created by this recruiter
  return await Job.find({
    recruiter: recruiterId,
  }).sort({ createdAt: -1 });
};

// Get application statistics for each recruiter job
export const getJobApplicationStats = async (
  recruiterId: string
) => {
  const jobs = await Job.find({
    recruiter: recruiterId,
  }).select("_id title company");

  const stats = await Promise.all(
    jobs.map(async (job) => {
      // Find applications for this job
      const applications = await Application.find({
        job: job._id,
      }).select("status");

      return {
        jobId: job._id,
        title: job.title,
        company: job.company,
        totalApplications: applications.length,
        pending: applications.filter(
          (app) => app.status === "Pending"
        ).length,
        shortlisted: applications.filter(
          (app) => app.status === "Shortlisted"
        ).length,
        rejected: applications.filter(
          (app) => app.status === "Rejected"
        ).length,
        hired: applications.filter(
          (app) => app.status === "Hired"
        ).length,
      };
    })
  );

  return stats;
};