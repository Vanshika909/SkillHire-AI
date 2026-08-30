import mongoose, { Schema, Document } from "mongoose";

export interface ISavedJob extends Document {
  student: mongoose.Types.ObjectId;
  job: mongoose.Types.ObjectId;
}

const savedJobSchema = new Schema(
  {
    // Student who saved the job
    student: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Job that was saved
    job: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent the same student from saving the same job twice
savedJobSchema.index(
  { student: 1, job: 1 },
  { unique: true }
);

export default mongoose.model<ISavedJob>(
  "SavedJob",
  savedJobSchema
);