import User from "../models/user";

// Get logged-in student's profile
export const getProfile = async (userId: string) => {
  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

// Update student's profile
export const updateProfile = async (
  userId: string,
  data: {
    name?: string;
    phone?: string;
    avatar?: string;
    bio?: string;
    college?: string;
    skills?: string[];
    resume?: string;
  }
) => {
  const user = await User.findByIdAndUpdate(
    userId,
    data,
    {
      new: true,          // Return updated document
      runValidators: true // Validate updated fields
    }
  ).select("-password");

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};