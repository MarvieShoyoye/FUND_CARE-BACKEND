import express from "express";
import {
  getOverallImpactMetrics,
  getProjectMetrics,
  updateProjectMetrics,
} from "../controllers/impactmetricscontroller.js";

const router = express.Router();

// Route to get overall impact metrics
router.get("/overall", getOverallImpactMetrics);
router.get("/project/:projectId", getProjectMetrics);
router.put("/project/:projectId", updateProjectMetrics);

export default router;
