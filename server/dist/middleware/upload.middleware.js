"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadAvatar = exports.uploadResume = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// ==========================================
// RESUME UPLOAD
// ==========================================
const resumeUploadDir = path_1.default.join(process.cwd(), "uploads", "resumes");
if (!fs_1.default.existsSync(resumeUploadDir)) {
    fs_1.default.mkdirSync(resumeUploadDir, {
        recursive: true,
    });
}
const resumeStorage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, resumeUploadDir);
    },
    filename: (_req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path_1.default.extname(file.originalname)}`;
        cb(null, uniqueName);
    },
});
const resumeFileFilter = (_req, file, cb) => {
    if (file.mimetype === "application/pdf") {
        cb(null, true);
    }
    else {
        cb(new Error("Only PDF files are allowed"));
    }
};
exports.uploadResume = (0, multer_1.default)({
    storage: resumeStorage,
    fileFilter: resumeFileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});
// ==========================================
// PROFILE PICTURE UPLOAD
// ==========================================
const avatarUploadDir = path_1.default.join(process.cwd(), "uploads", "avatars");
if (!fs_1.default.existsSync(avatarUploadDir)) {
    fs_1.default.mkdirSync(avatarUploadDir, {
        recursive: true,
    });
}
const avatarStorage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, avatarUploadDir);
    },
    filename: (_req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path_1.default.extname(file.originalname)}`;
        cb(null, uniqueName);
    },
});
const avatarFileFilter = (_req, file, cb) => {
    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
    ];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error("Only JPG, JPEG, PNG and WEBP images are allowed"));
    }
};
exports.uploadAvatar = (0, multer_1.default)({
    storage: avatarStorage,
    fileFilter: avatarFileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});
