import User from "../models/user";

interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
  role?: "student" | "recruiter" | "admin";
}

export const registerUser = async (data: RegisterUserInput) => {
  const { name, email, password, role } = data;

  // Check if email already exists
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("Email already registered");
  }

  // Create user (password hashing will be added next)
  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};