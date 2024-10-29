import express from "express";
import verifyToken from "../auth/auth.js";
import { changeUserRole } from "../controllers/authcontroller.js";



const router = express.Router();

router.patch("/change-role/:id", verifyToken, changeUserRole);