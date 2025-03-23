import { Request, Response } from "express";
import { Article } from "../types/article";
import articleModel from "../models/article.model";

const getArticles = (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  const articles = articleModel.findAll(id);
  res.status(200).json(articles);
};

export default { getArticles };
