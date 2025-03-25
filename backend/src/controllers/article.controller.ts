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

// Update return type to void and remove return statements
const updateArticle = (req: Request<{ id: string; articleId: string }>, res: Response): void => {
  const { id, articleId } = req.params;
  const articleData = req.body;

  try {
    // Convert articleId to number
    const articleIdNum = parseInt(articleId, 10);

    if (isNaN(articleIdNum)) {
      res.status(400).json({ error: "Invalid article ID format" });
      return; // Early return to end processing
    }

    const updatedArticle = articleModel.updateArticle(id, articleIdNum, articleData);

    if (!updatedArticle) {
      res.status(404).json({ error: "Article not found" });
      return; // Early return to end processing
    }

    res.status(200).json(updatedArticle);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

// Article deletion controller
const deleteArticle = (req: Request<{ id: string; articleId: string }>, res: Response): void => {
  const { id, articleId } = req.params;

  try {
    // Convert articleId to number
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

    // Return 204 No Content for successful deletion
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export default { getArticles, createArticle, updateArticle, deleteArticle };
