import express from "express";
import verifyToken from "../auth/auth.js";
import {
  UserSignUp,
  UserLogin,
  VerifyOtp,
  requestPasswordReset,
  resetPassword,
  getUserProfile,
  updateUserProfile,
  userLogout,
} from "../controllers/authcontroller.js";

const router = express.Router();

router.post("/signup", UserSignUp);
router.post("/login", UserLogin);
router.post("/verify", VerifyOtp);
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);
router.get("/me", verifyToken, getUserProfile);
router.patch("/update/:id", updateUserProfile);
router.delete("/logout/:id", userLogout);

export default router;
