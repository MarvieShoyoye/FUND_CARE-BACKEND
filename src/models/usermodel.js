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
    role: {
      type: String,
      enum: [
        "donor",
        "organization",
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
    // isVerified: {
    //   type: Boolean,
    //   default: false,
    // },
    // otp: {
    //   type: String,
    //   default: null,
    // },
    // otpExpiresAt: {
    //   type: Date,
    //   default: null,
    // },
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