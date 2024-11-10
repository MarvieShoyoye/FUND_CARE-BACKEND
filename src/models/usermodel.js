import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "prefer not to say"],
    },
    address: {
      type: String,
      default: "Address",
    },
    location: {
      latitude: {
        type: Number,
        default: 0.0,
      },
      longitude: {
        type: Number,
        default: 0.0,
      },
    },
    role: {
      type: String,
      enum: [
        "donor",
        "Healthcare organization",
        "admin",
        "medical professional",
        "medical student",
      ],
      default: "donor",
    },
    bio: {
      type: String,
      maxlength: 500,
    },
    profilePicture: {
      type: String,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
      default: null,
    },
    otpExpiresAt: {
      type: Date,
      default: null,
    },
    wallet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User-Wallet",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);


const UserModel = mongoose.model("User", userSchema);

export default UserModel;