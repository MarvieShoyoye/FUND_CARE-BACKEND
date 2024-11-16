import express from "express";
import { processPayment } from "../controllers/paymentcontroller.js";

const router = express.Router();

// Route for payment processing
router.post("/payment/process", processPayment);

export default router;
