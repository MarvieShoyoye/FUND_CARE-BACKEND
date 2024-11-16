import express from "express";
import verifyToken from "../auth/auth.js";
import { changeUserRole } from "../controllers/usercontroller.js";

const router = express.Router();



router.post("/change-user-role/:id", verifyToken, changeUserRole);




export default router;