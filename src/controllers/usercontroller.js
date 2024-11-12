import UserModel from "../models/usermodel.js";
import jwt from "jsonwebtoken";
import errorResponse from "../utility/error.js";

// controllers/userController.js

//CHANGE USER ROLE
export const changeUserRole = async (req, res, next) => {
  try {
    const { email, newRole } = req.body;

    // Validate the new role
    if (
      ![
        "donor",
        "Healthcare organization",
        "admin",
        "medical professional",
      ].includes(newRole)
    ) {
      return res.status(400).json({ message: "Invalid role specified." });
    }

    // Find user by email, excluding the password field
    const user = await UserModel.findOne({ email }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Update role
    user.role = newRole;
    await user.save();

    // Return the updated user profile without sensitive fields
    return res.status(200).json({
      message: `Role updated to ${newRole}.`,
    });
  } catch (error) {
    next(error);
  }
};

