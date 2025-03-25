import { v4 as uuidv4 } from "uuid";
import { User } from "../types/user";
import bcrypt from "bcrypt";
import { Article } from "../types/article";
import fs from "fs";
import path from "path";

// Data storage file paths
const DATA_DIR = path.join(__dirname, "../../../data");
const ARTICLES_FILE = path.join(DATA_DIR, "articles.json");

// Create directory if it doesn't exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

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

  constructor() {
    this.loadArticles();
  }

  // Load article data from file
  private loadArticles(): void {
    try {
      if (fs.existsSync(ARTICLES_FILE)) {
        const data = fs.readFileSync(ARTICLES_FILE, "utf8");
        this.articles = JSON.parse(data);
        console.log("Articles loaded from storage");
      }
    } catch (error) {
      console.error("Error loading articles from file:", error);
      this.articles = {};
    }
  }

  // Save article data to file
  private saveArticles(): void {
    try {
      const data = JSON.stringify(this.articles, null, 2);
      fs.writeFileSync(ARTICLES_FILE, data);
      console.log("Articles saved to storage");
    } catch (error) {
      console.error("Error saving articles to file:", error);
    }
  }

  findAll(userId: string) {
    return this.articles[userId] || [];
  }

  createUserArticles(userId: string) {
    if (!this.articles[userId]) {
      this.articles[userId] = foodPosts;
      this.saveArticles();
    }
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

    // Save articles after adding
    this.saveArticles();

    return newArticle;
  }

  updateArticle(
    userId: string,
    articleId: number,
    articleData: Partial<Omit<Article, "id">>
  ): Article | null {
    // Check if user's article array exists
    if (!this.articles[userId]) {
      return null;
    }

    // Find the index of the article to update
    const index = this.articles[userId].findIndex((article) => article.id === articleId);

    // Return null if article not found
    if (index === -1) {
      return null;
    }

    // Get existing article data
    const existingArticle = this.articles[userId][index];

    // Update article data (keep ID the same)
    const updatedArticle: Article = {
      ...existingArticle,
      ...articleData,
      id: existingArticle.id, // Always maintain the ID
    };

    // Replace with updated article
    this.articles[userId][index] = updatedArticle;

    // Save articles after updating
    this.saveArticles();

    return updatedArticle;
  }

  deleteArticle(userId: string, articleId: number): boolean {
    // Check if user's article array exists
    if (!this.articles[userId]) {
      return false;
    }

    // Find the index of the article to delete
    const index = this.articles[userId].findIndex((article) => article.id === articleId);

    // Return false if article not found
    if (index === -1) {
      return false;
    }

    // Remove article from array
    this.articles[userId].splice(index, 1);

    // Save articles after deleting
    this.saveArticles();

    return true;
  }
}

export default new ArticleModel();
