import { Request, Response } from "express";
import { Article } from "../types/article";
import articleModel from "../models/article.model";

const getArticles = (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  const articles = articleModel.findAll(id);
  res.status(200).json(articles);
};

const createArticle = (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  const articleData = req.body;

  try {
    const newArticle = articleModel.addArticle(id, articleData);
    res.status(201).json(newArticle);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

// 戻り値の型を void に修正し、return 文を削除
const updateArticle = (req: Request<{ id: string; articleId: string }>, res: Response): void => {
  const { id, articleId } = req.params;
  const articleData = req.body;

  try {
    // articleIdを数値に変換
    const articleIdNum = parseInt(articleId, 10);

    if (isNaN(articleIdNum)) {
      res.status(400).json({ error: "Invalid article ID format" });
      return; // 早期リターンで処理を終了
    }

    const updatedArticle = articleModel.updateArticle(id, articleIdNum, articleData);

    if (!updatedArticle) {
      res.status(404).json({ error: "Article not found" });
      return; // 早期リターンで処理を終了
    }

    res.status(200).json(updatedArticle);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

// 記事削除コントローラー
const deleteArticle = (req: Request<{ id: string; articleId: string }>, res: Response): void => {
  const { id, articleId } = req.params;

  try {
    // articleIdを数値に変換
    const articleIdNum = parseInt(articleId, 10);

    if (isNaN(articleIdNum)) {
      res.status(400).json({ error: "Invalid article ID format" });
      return;
    }

    const success = articleModel.deleteArticle(id, articleIdNum);

    if (!success) {
      res.status(404).json({ error: "Article not found" });
      return;
    }

    // 成功時は204 No Contentを返す
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export default { getArticles, createArticle, updateArticle, deleteArticle };
