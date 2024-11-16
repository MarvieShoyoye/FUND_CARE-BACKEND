import express from "express";
import {
  createHealthNews,
  getAllNewsArticles,
  getNewsArticleById,
  updateNewsArticle,
  deleteNewsArticle,
} from "../controllers/communityengagement.js";

const router = express.Router();


router.post("/", createHealthNews);
router.get("/", getAllNewsArticles);
router.get("/:id", getNewsArticleById);
router.put("/:id", updateNewsArticle);
router.delete("/:id", deleteNewsArticle);

export default router;
