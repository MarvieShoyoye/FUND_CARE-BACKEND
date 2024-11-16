import express from "express";
import {
  createCampaign,
  getCampaigns,
  getCampaignById,
  updateCampaign,
  deleteCampaign,
} from "../controllers/campaigncontroller.js";
import { verifyToken } from "../auth/auth.js";

const router = express.Router();


router.post("/campaigns",verifyToken, createCampaign);
router.get("/campaigns",verifyToken, getCampaigns);
router.get("/campaigns/:id",verifyToken, getCampaignById);
router.patch("/campaigns/:id",verifyToken, updateCampaign);
router.delete("/campaigns/:id",verifyToken, deleteCampaign);

export default router;
