import UserModel from "../models/usermodel.js";
import jwt from "jsonwebtoken";
import errorResponse from "../utility/error.js";

// controllers/userController.js


//CHANGE USER ROLE
export const changeUserRole = async (req, res, next) => {
  try {
    const { userId } = req.params; 
    const { newRole } = req.body;  

    // Check if new role is valid
    if (
      ![
        "donor",
        "Healthcare organization",
        "admin",
        "medical professional",
        "medical student",
      ].includes(newRole)
    ) {
      return res.status(400).json({ message: "Invalid role specified." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Update role
    user.role = newRole;
    await user.save();

    return res.status(200).json({ message: `Role updated to ${newRole}.`, user });
  } catch (error) {
    next(error);
  }
};
