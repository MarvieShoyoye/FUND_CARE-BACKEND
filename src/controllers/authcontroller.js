import UserModel from "../models/usermodel.js";
import errorResponse from "../utility/error.js";
import UserWalletModel from "../models/userwalletmodel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateOTP, generateExpiryTime } from "../utility/otp.js";
import { signupEmail, resetPasswordOtpEmail } from "../utility/sender.js";
import { validateEmail,validatePassword } from "../utility/validator.js";

//USER SIGNUP
export const UserSignUp = async (req, res, next) => {
  const { fullName, email, password } = req.body;

  try {
    if (!fullName || !email || !password) {
      return next(errorResponse(400, "Please fill all fields"));
    }

    // Validate email and password
    if (!validateEmail(email)) {
      return res.status(400).json({
        error: "ENTER A VALID EMAIL",
      });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({
        error:
          "Password must be at least 8 characters long, including uppercase,lowercase, special character and number"
      });
    }

    // Check if the user already exists by email
    const userExist = await UserModel.findOne({ email });
    if (userExist) return next(errorResponse(409, "User already exists"));

    // Generate OTP and hash password
    const otp = generateOTP();
    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedOtp = await bcrypt.hash(otp, 10);
    const expiresAt = generateExpiryTime();

    // Create the user in the database first
    const newUser = await UserModel.create({
      fullName,
      email: email.toLowerCase(),
      password: hashedPassword,
      otp: hashedOtp,
      otpExpiresAt: expiresAt,
    });

    // Create a wallet linked to the user ID
    const wallet = await UserWalletModel.create({
      userID: newUser._id,
      walletBalance: 0,
    });

    // Update the user with the wallet ID
    newUser.wallet = wallet._id;
    await newUser.save();

    // Send OTP to user via email
    await signupEmail(email, otp);

    // Return success response
    return res.status(201).json({
      success: true,
      message: "OTP sent successfully",
      data: {
        fullName: newUser.fullName,
        email: newUser.email,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
      },
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};


//LOGIN
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

    const token = jwt.sign(payload, process.env.SECRET_KEY || "FUNDMYCARE123", {
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

//VERIFY EMAIL
export const VerifyOtp = async (req, res, next) => {
  const { email, otp } = req.body;

  try {
    const user = await UserModel.findOne({ email });

    if (!user) return next(errorResponse(404, "user not found"));

    if (user.isVerified) {
      return next(errorResponse(400, "This account is already verified"));
    }

    const isOtpValid = await bcrypt.compare(otp, user.otp);
    if (!isOtpValid) return next(errorResponse(400, "Invalid OTP"));

    if (user.otpExpiresAt < Date.now()) {
      return next(errorResponse(400, "Code has expired. Please request again"));
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiresAt = null;

    await user.save();

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      user: user._id,
    });
  } catch (error) {
    next(error);
  }
};

//RESET PASSWORD
export const requestPasswordReset = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return next(errorResponse(404, "User not found"));
    }

    // Generate an OTP and expiration time
    const otp = generateOTP();
    user.resetPasswordOtp = otp;
    user.resetPasswordOtpExpires = generateExpiryTime();

    await user.save();

    // Send the OTP via email
    await resetPasswordOtpEmail(user.email, otp);

    res.status(200).json({ message: "Password reset OTP sent to your email" });
  } catch (error) {
    console.log(error);
    
    next(error);
  }
};

// Step 2: Reset Password (using the reset token)
const validateOtp = async (providedOtp, storedOtp) => {
  if (!providedOtp || !storedOtp) return false;
  try {
    return await bcrypt.compare(providedOtp, storedOtp);
  } catch (error) {
    console.error("Error comparing OTP:", error);
    return false;
  }
};

export const resetPassword = async (req, res, next) => {
  const { email, otp, newPassword } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    if (!user.resetPasswordOtp || user.resetPasswordOtpExpires < Date.now()) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

  

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordOtp = undefined;
    user.resetPasswordOtpExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password has been reset successfully" });
  } catch (error) {
    console.error(error);
    next(error);
  }
};




//RESEND OTP
export const ResendOTP = async (req, res, next) => {
  const { email } = req.body;
  try {
    if (!email) {
      return next(errorResponse(400, "Please provide either email"));
    }

    const user = await UserModel.findOne({ email });

    if (!user) return next(errorResponse(404, "user not found"));

    const currentTime = new Date();
    if (user.otpExpiresAt && currentTime <= new Date(user.otpExpiresAt)) {
      return next(
        errorResponse(
          400,
          "You can only request a new OTP after the current one expires"
        )
      );
    }

    const otp = generateOTP();
    const hashedOtp = await bcrypt.hash(otp, 10);
    const expiresAt = generateExpiryTime(); // The OTP has an expiry time (3 minutes)

    // Send OTP to user via email
    await resetPasswordOtpEmail(email, otp);

    user.otp = hashedOtp;
    user.otpExpiresAt = expiresAt;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "OTP resent successfully",
    });
  } catch (error) {
    next(error);
  }
};

//GET USER PROFILE
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

//UPDATE USER PROFILE
export const updateUserProfile = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { email, fullName, bio, profilePicture, address, password } =
      req.body;

    const updateFields = {};

    // Update regular fields if they are present in the request
    if (email) updateFields.email = email;
    if (fullName) updateFields.fullName = fullName;
    if (bio) updateFields.bio = bio;
    if (profilePicture) updateFields.profilePicture = profilePicture;
    if (address) updateFields.address = address;

    // If a new password is provided, hash it and add to update fields
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.password = hashedPassword;
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return next(errorResponse(404, "User not found"));
    }

    // Exclude the password from the response
    const { password: _, ...userResponse } = updatedUser.toObject();

    return res.status(200).json({
      success: true,
      message: "User profile updated successfully.",
      data: userResponse,
    });
  } catch (error) {
    next(error);
  }
};


// USER LOGOUT
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
