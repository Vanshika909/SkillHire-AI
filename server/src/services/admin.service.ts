import User from "../models/user";
import Job from "../models/job.model";
import Application from "../models/application.model";

// Get admin dashboard statistics
export const getAdminDashboard = async () => {
  // Count users by role
  const totalUsers = await User.countDocuments();

  const totalStudents = await User.countDocuments({
    role: "student",
  });

  const totalRecruiters = await User.countDocuments({
    role: "recruiter",
  });

  const totalAdmins = await User.countDocuments({
    role: "admin",
  });

  // Count jobs
  const totalJobs = await Job.countDocuments();

  // Count applications
  const totalApplications = await Application.countDocuments();

  const pendingApplications = await Application.countDocuments({
    status: "Pending",
  });

  const hiredApplications = await Application.countDocuments({
    status: "Hired",
  });

  return {
    totalUsers,
    totalStudents,
    totalRecruiters,
    totalAdmins,
    totalJobs,
    totalApplications,
    pendingApplications,
    hiredApplications,
  };
};

// Get all users
export const getAllUsers = async () => {
  return await User.find()
    .select("-password")
    .sort({ createdAt: -1 });
};

// Get all jobs
export const getAllJobs = async () => {
  return await Job.find()
    .populate("recruiter", "name email")
    .sort({ createdAt: -1 });
};

// Get all applications
export const getAllApplications = async () => {
  return await Application.find()
    .populate("student", "name email")
    .populate("job", "title company")
    .sort({ createdAt: -1 });
};

// Delete a user
export const deleteUser = async (
  userId: string,
  adminId: string
) => {
  // Prevent admin from deleting their own account
  if (userId === adminId) {
    throw new Error("You cannot delete your own admin account.");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found.");
  }

  await User.findByIdAndDelete(userId);

  return user;
};

// Change user role
export const updateUserRole = async (
  userId: string,
  newRole: string,
  adminId: string
) => {
  // Prevent admin from changing their own role
  if (userId === adminId) {
    throw new Error("You cannot change your own admin role.");
  }

  const allowedRoles = ["student", "recruiter", "admin"];

  if (!allowedRoles.includes(newRole)) {
    throw new Error("Invalid role.");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found.");
  }

  user.role = newRole as "student" | "recruiter" | "admin";

  await user.save();

  return user;
};