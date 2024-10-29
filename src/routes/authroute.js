import express from "express";
import verifyToken from "../auth/auth.js";
import {
  UserSignup,
  UserLogin,
  // requestPasswordReset,
  // resetPassword,
  getUserProfile,
  changePassword,
  updateUserProfile,
  userLogout,
} from "../controllers/authcontroller.js";

const router = express.Router();

router.post("/signup", UserSignup);
router.post("/login", UserLogin);
// router.post("/request-password-reset", requestPasswordReset);
// router.post("/reset-password", resetPassword);
router.get("/me", verifyToken, getUserProfile);
router.post("/change-password", verifyToken, changePassword);
router.patch("/update/:id", updateUserProfile);
router.delete("/logout/:id", userLogout);
export default router;
