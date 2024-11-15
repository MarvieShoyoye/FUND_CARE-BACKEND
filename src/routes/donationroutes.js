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

router.post("/create-donation", createDonation);
router.post("/donation", getDonations);
router.get("/all-donations", getAllDonations);
router.get("/:id", getDonationById);
router.put("/:id", updateDonationStatus);
router.delete("/:id", deleteDonation);

export default router;
