import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./routes";
import authRoutes from "./routes/auth.routes";
import jobRoutes from "./routes/job.routes";

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api", routes);
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
// Health Check Route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "🚀 SkillHire AI API is running successfully!",
  });
});

export default app;