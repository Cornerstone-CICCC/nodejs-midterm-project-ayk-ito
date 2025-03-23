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

export default { getArticles, createArticle };
