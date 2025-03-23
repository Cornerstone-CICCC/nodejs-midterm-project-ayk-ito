import express from "express";
import { checkAuth } from "../middlewares/auth";
import articleController from "../controllers/article.controller";

const router = express.Router();

router.get("/:id", checkAuth, articleController.getArticles);
router.post("/:id", checkAuth, articleController.createArticle);

export default router;
