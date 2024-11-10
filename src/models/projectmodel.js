// models/Project.js
import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["Health Care", "Disaster Relief", "Poverty Alleviation",],
      required: true,
    },
    fundingGoal: {
      type: Number,
      required: true,
    },
    amountRaised: {
      type: Number,
      default: 0,
    },
    timeline: {
      startDate: { type: Date, required: true },
      endDate: { type: Date, required: true },
    },
    impactObjectives: {
      type: String,
      required: true,
    },
    images: [String], // Array of image URLs
    video: String, // Video URL
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model("Project", projectSchema);
export default Project;
