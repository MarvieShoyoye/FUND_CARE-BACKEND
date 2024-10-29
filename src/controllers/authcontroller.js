import UserModel from "../models/usermodel.js";
import errorResponse from "../utility/error.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const UserSignup = async (req, res, next) => {
  const { fullName, email, password } = req.body;

  try {
    if (!fullName || !email || !password) {
      return errorResponse(400, "Please fill all fields");
    }

    const userExist = await UserModel.findOne({ email });
    if (userExist) return next(errorResponse(409, "User already exists"));

    const hashedPassword = await bcrypt.hash(password, 10);

    let user = await UserModel.create({
      fullName,
      email,
      password: hashedPassword,
    });

    user = user.toObject();
    delete user.password;

    return res.status(201).json({
      success: true,
      message: "User created succesfully",
      data: user,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const UserLogin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const userExist = await UserModel.findOne({ email });
    if (!userExist) return next(errorResponse(404, "user not found"));

    const passwordValid = await bcrypt.compare(password, userExist.password);
    if (!passwordValid) return next(errorResponse(400, "Invalid password"));

    const payload = {
      id: userExist._id,
    };

    const token = jwt.sign(payload, process.env.SECRET_KEY || "Ecommerce247", {
      expiresIn: "24h",
    });
    const { password: hashedPassword, ...rest } = userExist._doc;

    res.status(202).json({
      success: true,
      message: "user logged in successfully",
      data: rest,
      token,
    });
  } catch (error) {
    next(error);
  }
};

// export const requestPasswordReset = async (req, res, next) => {
//   const { email } = req.body;
//   try {
//     const user = await UserModel.findOne({ email });
//     if (!user) {
//       return next(errorResponse(404, "user not found"));
//     }

//     // Generate a reset token
//     const { resetToken, hashedToken } = generateResetToken();

//     // Set token expiration time (5 minutes)
//     user.resetPasswordToken = hashedToken;
//     user.resetPasswordExpires = Date.now() + tokenExpirationTime;

//     await user.save();

//     // Send the password reset email
//     await sendPasswordResetEmail(user, resetToken);

//     res
//       .status(200)
//       .json({ message: "Password reset token generated successfully" });
//   } catch (error) {
//     next(error);
//   }
// };

// // Step 2: Reset Password (using the reset token)
// export const resetPassword = async (req, res, next) => {
//   const { resetToken, newPassword } = req.body;

//   try {
//     // Hash the received token to match the stored token
//     const hashedToken = crypto
//       .createHash("sha256")
//       .update(resetToken)
//       .digest("hex");

//     // Find the user by the reset token and check if the token is still valid
//     const user = await UserModel.findOne({
//       resetPasswordToken: hashedToken,
//       //   resetPasswordExpires: { $gt: Date.now() }, // Check if the token is not expired
//     });

//     if (!user) {
//       return res
//         .status(400)
//         .json({ error: "Invalid or expired password reset token" });
//     }

//     // Hash the new password and save it
//     user.password = await bcrypt.hash(newPassword, 10);
//     user.resetPasswordToken = undefined; // Clear the reset token
//     // user.resetPasswordExpires = undefined; // Clear the expiration time
//     await user.save();

//     res.status(200).json({ message: "Password has been reset successfully" });
//   } catch (error) {
//     console.error(error);
//     next(error);
//   }
// };

export const getUserProfile = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user.id).select("-password");

    if (!user) {
      return next(errorResponse(404, "User not found"));
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  try {
    if (!currentPassword || !newPassword) {
      return next(
        errorResponse(400, "Please provide both current and new passwords.")
      );
    }

    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return next(errorResponse(404, "User not found."));
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordValid) {
      return next(errorResponse(401, "Incorrect current password."));
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully.",
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const updateUserProfile = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { email, fullName, bio, profilePicture, address } = req.body;

    const updateFields = {};
    if (email) updateFields.email = email;
    if (fullName) updateFields.fullName = fullName;
    if (bio) updateFields.bio = bio;
    if (profilePicture) updateFields.profilePicture = profilePicture;
    if (address) updateFields.address = address;

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return next(errorResponse(404, "User not found"));
    }

    const { password, ...userResponse } = updatedUser.toObject();

    return res.status(200).json({
      success: true,
      message: "User profile updated successfully.",
      data: userResponse,
    });
  } catch (error) {
    next(error);
  }
};

export const userLogout = async (req, res, next) => {
  const userId = req.params.id;
  try {
    const user = await UserModel.findById(userId);

    if (!user) {
      return next(errorResponse(404, "User not found"));
    }

    return res
      .status(200)
      .json({ success: true, message: "User logged out successfully" });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
