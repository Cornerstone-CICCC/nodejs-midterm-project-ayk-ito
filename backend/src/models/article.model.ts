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

    return true;
  }
}

export default new ArticleModel();
