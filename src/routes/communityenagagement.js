import express from "express";
import {
  createHealthNews,
  getAllNewsArticles,
  getNewsArticleById,
  updateNewsArticle,
  deleteNewsArticle,
} from "../controllers/communityengagement.js";
import verifyToken from "../auth/auth.js";

const router = express.Router();


router.post("/create-news",verifyToken, createHealthNews);
router.get("/get-all-news", verifyToken, getAllNewsArticles);
router.get("/get-news/:id", verifyToken, getNewsArticleById);
router.put("/update-article/:id", verifyToken, updateNewsArticle);
router.delete("/delete-article/:id", verifyToken, deleteNewsArticle);

export default router;
