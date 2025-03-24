import { v4 as uuidv4 } from "uuid";
import { User } from "../types/user";
import bcrypt from "bcrypt";
import { Article } from "../types/article";
import fs from "fs";
import path from "path";

// データ保存用ファイルパスの設定
const DATA_DIR = path.join(__dirname, "../../../data");
const ARTICLES_FILE = path.join(DATA_DIR, "articles.json");

// ディレクトリが存在しない場合は作成
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

  // 記事データをファイルから読み込む
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

  // 記事データをファイルに保存
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

    // 記事追加後にデータを保存
    this.saveArticles();

    return newArticle;
  }

  updateArticle(
    userId: string,
    articleId: number,
    articleData: Partial<Omit<Article, "id">>
  ): Article | null {
    // ユーザーの記事配列が存在するか確認
    if (!this.articles[userId]) {
      return null;
    }

    // 更新対象の記事インデックスを検索
    const index = this.articles[userId].findIndex((article) => article.id === articleId);

    // 記事が見つからない場合はnullを返す
    if (index === -1) {
      return null;
    }

    // 既存の記事データを取得
    const existingArticle = this.articles[userId][index];

    // 記事データを更新（IDは維持）
    const updatedArticle: Article = {
      ...existingArticle,
      ...articleData,
      id: existingArticle.id, // IDは常に維持
    };

    // 更新された記事で置き換え
    this.articles[userId][index] = updatedArticle;

    // 記事更新後にデータを保存
    this.saveArticles();

    return updatedArticle;
  }

  deleteArticle(userId: string, articleId: number): boolean {
    // ユーザーの記事配列が存在するか確認
    if (!this.articles[userId]) {
      return false;
    }

    // 削除対象の記事インデックスを検索
    const index = this.articles[userId].findIndex((article) => article.id === articleId);

    // 記事が見つからない場合はfalseを返す
    if (index === -1) {
      return false;
    }

    // 記事を配列から削除
    this.articles[userId].splice(index, 1);

    // 記事削除後にデータを保存
    this.saveArticles();

    return true;
  }
}

export default new ArticleModel();
