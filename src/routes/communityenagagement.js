import express from "express";
import {
  createNewsArticle,
  getAllNewsArticles,
  getNewsArticleById,
  updateNewsArticle,
  deleteNewsArticle,
} from "../controllers/communityengagement.js";

const router = express.Router();

// Route to create a new health news article
router.post("/", createNewsArticle);

// Route to get all health news articles
router.get("/", getAllNewsArticles);

// Route to get a single news article by ID
router.get("/:id", getNewsArticleById);

// Route to update a health news article by ID
router.put("/:id", updateNewsArticle);

// Route to delete a health news article by ID
router.delete("/:id", deleteNewsArticle);

export default router;
