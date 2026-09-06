"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const routes_1 = __importDefault(require("./routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const job_routes_1 = __importDefault(require("./routes/job.routes"));
const student_routes_1 = __importDefault(require("./routes/student.routes"));
const application_routes_1 = __importDefault(require("./routes/application.routes"));
const savedJob_routes_1 = __importDefault(require("./routes/savedJob.routes"));
const recruiterDashboard_routes_1 = __importDefault(require("./routes/recruiterDashboard.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const notification_routes_1 = __importDefault(require("./routes/notification.routes"));
const path_1 = __importDefault(require("path"));
const recruiterProfile_routes_1 = __importDefault(require("./routes/recruiterProfile.routes"));
console.log("🔥 Notification routes imported");
const app = (0, express_1.default)();
// Middleware
const allowedOrigins = [
    "http://localhost:5173",
    process.env.CLIENT_URL,
];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Allow requests with no origin
        // such as Postman or server-to-server requests
        if (!origin) {
            return callback(null, true);
        }
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use("/api", routes_1.default);
app.use("/api/auth", auth_routes_1.default);
app.use("/api/student", student_routes_1.default);
app.use("/api/jobs", job_routes_1.default);
app.use("/api/applications", application_routes_1.default);
app.use("/api/saved-jobs", savedJob_routes_1.default);
app.use("/api/recruiter/dashboard", recruiterDashboard_routes_1.default);
app.use("/api/admin", admin_routes_1.default);
app.use("/api/notifications", notification_routes_1.default);
app.use("/uploads", express_1.default.static(path_1.default.join(process.cwd(), "uploads")));
app.use("/api/recruiter/profile", recruiterProfile_routes_1.default);
// Health Check Route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "🚀 SkillHire AI API is running successfully!",
    });
});
exports.default = app;
