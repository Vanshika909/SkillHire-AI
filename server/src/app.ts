import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./routes";
import authRoutes from "./routes/auth.routes";
import jobRoutes from "./routes/job.routes";
import studentRoutes from "./routes/student.routes";
import applicationRoutes from "./routes/application.routes";
import savedJobRoutes from "./routes/savedJob.routes";
import recruiterDashboardRoutes from "./routes/recruiterDashboard.routes";
import adminRoutes from "./routes/admin.routes";
import notificationRoutes from "./routes/notification.routes";
import path from "path";
import recruiterProfileRoutes from "./routes/recruiterProfile.routes";

console.log("🔥 Notification routes imported");
const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api", routes);
app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/saved-jobs", savedJobRoutes);
app.use(
  "/api/recruiter/dashboard",
  recruiterDashboardRoutes
);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);
  app.use(
  "/api/recruiter/profile",
  recruiterProfileRoutes
);

// Health Check Route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "🚀 SkillHire AI API is running successfully!",
  });
});

export default app;