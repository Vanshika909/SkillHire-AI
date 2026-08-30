import mongoose, { Schema, Document } from "mongoose";

export interface IApplication extends Document {
  student: mongoose.Types.ObjectId;
  job: mongoose.Types.ObjectId;

  status: "Pending" | "Shortlisted" | "Rejected" | "Hired";

  coverLetter: string;
}

const applicationSchema = new Schema(
  {
    // Student who applied
    student: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Job being applied to
    job: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    // Recruiter can update this later
    status: {
      type: String,
      enum: ["Pending", "Shortlisted", "Rejected", "Hired"],
      default: "Pending",
    },

    // Optional cover letter
    coverLetter: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IApplication>(
  "Application",
  applicationSchema
);