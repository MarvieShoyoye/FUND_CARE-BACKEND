// routes/donationRoutes.js
import express from "express";
import {
  createDonation,
  getDonations,
  getAllDonations,
  getDonationById,
  updateDonationStatus,
  deleteDonation,
} from "../controllers/donationcontroller.js";
import verifyToken from "../auth/auth.js";
  
const router = express.Router();

router.post("/create-donation", verifyToken, createDonation);
router.post("/donation", verifyToken, getDonations);
router.get("/all-donations", verifyToken, getAllDonations);
router.get("/:id", verifyToken, getDonationById);
router.put("/:id", verifyToken, updateDonationStatus);
router.delete("/:id", verifyToken, deleteDonation);

export default router;
