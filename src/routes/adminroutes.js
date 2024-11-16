import express from "express";
import {
  createAdmin,
  adminLogin,
  adminLogout,
  requestPasswordReset,
  resetPassword,
  getAdminProfile,
  updateLeaderboard,
  loginUser,
  getAllUsers,
  updateUserStatus,
  flagContent,
} from "../controllers/admincontrollers.js";

import { verifyToken, isAdmin } from "../auth/auth.js";

const router = express.Router();

router.post("/login", adminLogin);
router.post(
  "/request-password-reset",
  verifyToken,
  isAdmin,
  requestPasswordReset
);
router.post("/reset-password", verifyToken, isAdmin, resetPassword);
router.post("/create-admin", createAdmin);
router.post("/logout", adminLogout);
router.get("/me", verifyToken, isAdmin, getAdminProfile);
router.put(
  "/challenges/:id/leaderboard",
  verifyToken,
  isAdmin,
  updateLeaderboard
);

// Authentication Routes
router.post("/login", verifyToken, isAdmin, loginUser);

// Admin User Management Routes
router.get("/users", verifyToken, isAdmin, getAllUsers);
router.patch("/users/:id/status", verifyToken, isAdmin, updateUserStatus);
router.patch("/flagContent/:id", verifyToken, isAdmin, flagContent);

export default router;
