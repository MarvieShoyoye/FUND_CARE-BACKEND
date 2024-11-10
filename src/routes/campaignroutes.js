import express from "express";
import {
  createCampaign,
  getCampaigns,
  getCampaignById,
  updateCampaign,
  deleteCampaign,
} from "../controllers/campaigncontroller.js";
import verifyToken from "../auth/auth.js";

const router = express.Router();


router.post("/campaigns", createCampaign);
router.get("/campaigns", getCampaigns);
router.get("/campaigns/:id", getCampaignById);
router.patch("/campaigns/:id", updateCampaign);
router.delete("/campaigns/:id", deleteCampaign);

export default router;
