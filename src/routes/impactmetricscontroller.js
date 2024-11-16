import express from "express";
import {
  getOverallImpactMetrics,
  getProjectMetrics,
  updateProjectMetrics,
} from "../controllers/impactmetricscontroller.js";
import { verifyToken } from "../auth/auth.js";

const router = express.Router();

// Route to get overall impact metrics
router.get("/overall", verifyToken, getOverallImpactMetrics);
router.get("/project/:projectId", verifyToken, getProjectMetrics);
router.put("/project/:projectId", verifyToken, updateProjectMetrics);

export default router;
