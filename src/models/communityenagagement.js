import mongoose from "mongoose";

const HealthNewsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      required: true,
    },
    publishedDate: {
      type: Date,
      default: Date.now,
    },
    tags: [String], // optional tags for categorizing news
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    comments: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
    flagged: {
      type: Boolean,
      default: false,
    },
    flagsCount: {
      type: Number,
      default: 0,
    }, // Track how many times the post has been flagged
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("HealthNews", HealthNewsSchema);
