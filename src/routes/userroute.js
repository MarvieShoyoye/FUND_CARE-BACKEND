import express from "express";
import verifyToken from "../auth/auth.js";
import { changeUserRole } from "../controllers/usercontroller.js";

const router = express.Router();



router.post("/change-user-role/:id", changeUserRole);




export default router;