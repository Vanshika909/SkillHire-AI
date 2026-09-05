import multer from "multer";
import path from "path";
import fs from "fs";

// ==========================================
// RESUME UPLOAD
// ==========================================

const resumeUploadDir = path.join(
  process.cwd(),
  "uploads",
  "resumes"
);

if (!fs.existsSync(resumeUploadDir)) {
  fs.mkdirSync(resumeUploadDir, {
    recursive: true,
  });
}

const resumeStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, resumeUploadDir);
  },

  filename: (_req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;

    cb(null, uniqueName);
  },
});

const resumeFileFilter = (
  _req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"));
  }
};

export const uploadResume = multer({
  storage: resumeStorage,
  fileFilter: resumeFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});


// ==========================================
// PROFILE PICTURE UPLOAD
// ==========================================

const avatarUploadDir = path.join(
  process.cwd(),
  "uploads",
  "avatars"
);

if (!fs.existsSync(avatarUploadDir)) {
  fs.mkdirSync(avatarUploadDir, {
    recursive: true,
  });
}

const avatarStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, avatarUploadDir);
  },

  filename: (_req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;

    cb(null, uniqueName);
  },
});

const avatarFileFilter = (
  _req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only JPG, JPEG, PNG and WEBP images are allowed"
      )
    );
  }
};

export const uploadAvatar = multer({
  storage: avatarStorage,
  fileFilter: avatarFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});