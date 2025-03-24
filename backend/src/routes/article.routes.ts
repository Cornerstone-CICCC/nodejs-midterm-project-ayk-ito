import express from "express";
import { checkAuth } from "../middlewares/auth";
import articleController from "../controllers/article.controller";

const router = express.Router();

// GET と POST のエンドポイントはユーザーIDを `id` という名前で取得
router.get("/:id", checkAuth, articleController.getArticles);
router.post("/:id", checkAuth, articleController.createArticle);

// PUT エンドポイントもパラメータ名を一致させる
router.put("/:id/:articleId", checkAuth, articleController.updateArticle);

// DELETE エンドポイントを追加
router.delete("/:id/:articleId", checkAuth, articleController.deleteArticle);

export default router;
