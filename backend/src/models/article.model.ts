import { v4 as uuidv4 } from "uuid";
import { User } from "../types/user";
import bcrypt from "bcrypt";
import { Article } from "../types/article";

const foodPosts = [
  {
    id: 1,
    title: "spring pancake",
    date: "2025-03-12",
    description: "It was delicious and cute pancakes.",
    imageUrl:
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
];

class ArticleModel {
  private articles: {
    [userId: string]: Article[];
  } = {};

  findAll(userId: string) {
    return this.articles[userId] || [];
  }

  createUserArticles(userId: string) {
    // this.articles[userId] = [];
    this.articles[userId] = foodPosts;
  }

  addArticle(userId: string, articleData: Omit<Article, "id">): Article {
    // Initialize the user's article array if it doesn't exist
    if (!this.articles[userId]) {
      this.articles[userId] = [];
    }

    // Generate a new ID for the article (using the highest existing ID + 1)
    const existingArticles = this.articles[userId];
    const newId =
      existingArticles.length > 0
        ? Math.max(...existingArticles.map((article) => article.id)) + 1
        : 1;

    // Create the new article with an ID
    const newArticle: Article = {
      id: newId,
      ...articleData,
    };

    // Add the article to the user's collection
    this.articles[userId].push(newArticle);

    return newArticle;
  }
}

export default new ArticleModel();
