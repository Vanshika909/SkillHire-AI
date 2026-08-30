import mongoose, { Schema, Document } from "mongoose";
export interface IJob extends Document {
  title: string;
  company: string;
  description: string;
  location: string;
  salary: number;
  employmentType: "Full-Time" | "Part-Time" | "Internship" | "Remote";
  experience: string;
  skills: string[];
  recruiter: mongoose.Types.ObjectId;
  createdAt: Date;
}
const jobSchema = new Schema<IJob>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    company: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    salary: {
      type: Number,
      required: true,
    },

    employmentType: {
      type: String,
      enum: ["Full-Time", "Part-Time", "Internship", "Remote"],
      required: true,
    },

    experience: {
      type: String,
      required: true,
    },

    skills: [
      {
        type: String,
      },
    ],

    recruiter: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IJob>("Job", jobSchema);