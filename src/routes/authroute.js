import express from "express";
import verifyToken from "../auth/auth.js";
import {
  UserSignUp,
  UserLogin,
  VerifyOtp,
  ResendOTP,
  requestPasswordReset,
  resetPassword,
  getUserProfile,
  updateUserProfile,
  userLogout,
} from "../controllers/authcontroller.js";
import passport from "../passport.js";

const router = express.Router();

// Route for initiating Google login
router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// Route for handling Google OAuth callback
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login", // Redirect here if login fails
    successRedirect: "/", // Redirect here if login succeeds
  })
);

router.post("/signup", UserSignUp);
router.post("/login", UserLogin);
router.post("/verify", VerifyOtp);
router.post("/resend-otp", ResendOTP);
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);
router.get("/me", verifyToken, getUserProfile);
router.patch("/update/:id", updateUserProfile);
router.delete("/logout/:id", userLogout);

export default router;
