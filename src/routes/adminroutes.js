import express from "express";
import {
  createAdmin,
  adminLogin,
  adminLogout,
  requestPasswordReset,
  resetPassword,
  getAdminProfile,
  updateLeaderboard,
} from "../controllers/admincontrollers.js";


import { verifyToken } from "../auth/auth.js";

const router = express.Router();


router.post("/login", adminLogin);
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);
router.post("/create-admin", createAdmin);
router.post("/logout", adminLogout);
router.get("/me", getAdminProfile);
router.put("/challenges/:id/leaderboard", verifyToken, updateLeaderboard);


export default router;