import User from "../models/user";
import bcrypt from "bcryptjs";
import jwt, { SignOptions, Secret } from "jsonwebtoken";


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
  //password hashing

  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user (password hashing will be added next)
 const user = await User.create({
  name,
  email,
  password: hashedPassword,
  role,
});

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });

  console.log("Email received:", email);
  console.log("User found:", user);

  if (!user) {
    throw new Error("Invalid email or password");
  }

  console.log("Stored Password:", user.password);
  console.log("Entered Password:", password);

  const isMatch = await bcrypt.compare(password, user.password);

  console.log("Password Match:", isMatch);

  if (!isMatch) {
    throw new Error("Invalid email or password");
  }


  
  const secret: Secret = process.env.JWT_SECRET! as Secret;

  const options: SignOptions = {
  expiresIn: "7d",
  };
  const token = jwt.sign(
    {
      userId: user._id,
      role: user.role,
    },
    secret,
    options
  );

console.log("Generated Token:", token);

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};