import express from "express";
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  createChallenge,
  getChallenges,
  getChallengeById,
  deleteChallenge,
} from "../controllers/projectcontroller.js";
import { verifyToken } from "../auth/auth.js";

const router = express.Router();

router.post("/create-project", verifyToken, createProject);
router.get("/", getProjects);
router.get("/:id", getProjectById);
router.put("/:id", verifyToken, updateProject);
router.delete("/:id", verifyToken, deleteProject);
router.post("/challenges", verifyToken, createChallenge);
router.get("/challenges", verifyToken, getChallenges);
router.get("/challenges/:id", verifyToken, getChallengeById);
router.delete("/challenges/:id", verifyToken, deleteChallenge);

export default router;
