import express from "express";
import { processPayment } from "../controllers/paymentcontroller.js";
import verifyToken from "../auth/auth.js";

const router = express.Router();

// Route for payment processing
router.post("/payment/process", verifyToken, processPayment);

export default router;
