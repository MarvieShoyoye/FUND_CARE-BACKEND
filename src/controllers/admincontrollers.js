import UserModel from "../models/usermodel.js";
import errorResponse from "../utility/error.js";



export const createAdmin = async (req, res, next) => {
  const { firstName, lastName, email, gender, phoneNumber, password } =
    req.body;
  try {
    if (
      !firstName &&
      !lastName &&
      !email &&
      !gender &&
      !phoneNumber &&
      !password
    ) {
      return next(errorResponse(400, "Please fill all fields"));
    }
    const AdminExist = await UserModel.findOne({
      $or: [{ email }, { phoneNumber }],
    });

    if (AdminExist) return next(errorResponse(409, "Admin already exists"));
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await UserModel.create({
      firstName,
      lastName,
      email: email,
      gender,
      phoneNumber: phoneNumber,
      password: hashedPassword,
      isVerified: true,
      role: "admin",
    });

    return res.status(201).json({
      success: true,
      message: "Admin created successfully",
      data: [
        admin.firstName,
        admin.lastName,
        admin.email,
        admin.gender,
        admin.phoneNumber,
        admin.createdAt,
        admin.updatedAt,
      ],
    });
  } catch (error) {
    next(error);
  }
};

export const adminLogin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const adminExist = await UserModel.findOne({ email });
    if (!adminExist) return next(errorResponse(404, "Admin not found"));

    const passwordValid = await bcrypt.compare(password, adminExist.password);
    if (!passwordValid) return next(errorResponse(400, "Invalid password"));

    const payload = {
      id: adminExist._id,
    };

    const token = jwt.sign(payload, process.env.SECRET_KEY || "Ecommerce247", {
      expiresIn: "24h",
    });

    const { password: hashedPassword, ...rest } = adminExist._doc;

    res.cookie("auth-cookie", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000, //24hours
    });

    res.status(202).json({
      success: true,
      message: "Admin logged in successfully",
      rest,
    });
  } catch (error) {
    next(error);
  }
};

export const adminLogout = async (req, res) => {
  try {
    const { email } = req.body;

    // Attempt to find the admin by email and clear their tokens
    const admin = await UserModel.findOneAndUpdate(
      { email },
      { $set: { tokens: [] } }, // Clear all tokens
      { new: true } // Return the updated admin document
    );

    if (!admin) {
      return res.status(404).json({ error: "admin not found" });
    }

    return res.status(200).json({ message: "admin logged out successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

//RESET PASSWORD

// Step 1: Request Password Reset
export const requestPasswordReset = async (req, res, next) => {
  const { email } = req.body;
  try {
    const admin = await AdminModel.findOne({ email });
    if (!admin) {
      return next(errorResponse(404, "Admin not found"));
    }

    // Generate a reset token
    const { resetToken, hashedToken } = generateResetToken();

    // Set token expiration time (5 minutes)
    admin.resetPasswordToken = hashedToken;
    admin.resetPasswordExpires = Date.now() + tokenExpirationTime;

    await admin.save();

    // Send the password reset email
    await sendPasswordResetEmail(admin, resetToken);

    res
      .status(200)
      .json({ message: "Password reset token generated successfully" });
  } catch (error) {
    next(error);
  }
};

// Step 2: Reset Password (using the reset token)
export const resetPassword = async (req, res, next) => {
  const { resetToken, newPassword } = req.body;

  try {
    // Hash the received token to match the stored token
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Find the admin by the reset token and check if the token is still valid
    const admin = await AdminModel.findOne({
      resetPasswordToken: hashedToken,
      //   resetPasswordExpires: { $gt: Date.now() }, // Check if the token is not expired
    });

    if (!admin) {
      return res
        .status(400)
        .json({ error: "Invalid or expired password reset token" });
    }

    // Hash the new password and save it
    admin.password = await bcrypt.hash(newPassword, 10);
    admin.resetPasswordToken = undefined; // Clear the reset token
    // admin.resetPasswordExpires = undefined; // Clear the expiration time
    await admin.save();

    res.status(200).json({ message: "Password has been reset successfully" });
  } catch (error) {
    console.error(error);
    next(errorResponse(500, "Internal server error"));
  }
};

export const getAdminProfile = async (req, res, next) => {
  try {
    const { email } = req.body;
    const admin = await UserModel.findOne({ email });

    if (!admin) {
      return next(errorResponse(404, "admin not found"));
    }
    // Exclude sensitive information like passwords or tokens
    const { password, tokens, ...Admin } = admin.toObject();
    return res.status(200).json(Admin);
  } catch (error) {
    next(error);
  }
};




// Assuming you have a middleware that checks if the user is an admin
export const updateLeaderboard = async (req, res, next) => {
  try {
    // Check if the user is an admin
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ message: 'You do not have permission to update the leaderboard' });
    }

    const { challengeId } = req.params;
    const { donorId, amount } = req.body;

    const challenge = await Challenge.findByIdAndUpdate(
      challengeId,
      { $push: { leaderboard: { donorId, amount } } },
      { new: true }
    ).populate('leaderboard.donorId', 'name');

    res.status(200).json({ message: 'Leaderboard updated successfully', challenge });
  } catch (error) {
    next(error);
  }
};


// Admin: Update User Status
export const updateUserStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // Expect 'active', 'disabled', or 'suspended'

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid user ID" });
  }

  try {
    const user = await User.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, message: `User status updated to ${status}`, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update user status" });
  }
};

// Admin: Fetch All Users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Exclude sensitive information
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
};

// Authentication: Login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || user.status !== 'active') {
      return res.status(401).json({ success: false, message: "Invalid credentials or account not active" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({ success: true, token, user: { id: user._id, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ success: false, message: "Login failed" });
  }
};

