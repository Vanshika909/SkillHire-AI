import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
  user: mongoose.Types.ObjectId;
  message: string;
  type: "Application" | "Job" | "System";
  isRead: boolean;
}

const notificationSchema = new Schema(
  {
    // User receiving the notification
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Notification message
    message: {
      type: String,
      required: true,
    },

    // Notification category
    type: {
      type: String,
      enum: ["Application", "Job", "System"],
      default: "System",
    },

    // Whether the user has read it
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<INotification>(
  "Notification",
  notificationSchema
);