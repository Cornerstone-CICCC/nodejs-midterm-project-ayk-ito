import { v4 as uuidv4 } from "uuid";
import { User } from "../types/user";
import bcrypt from "bcrypt";
import { Article } from "../types/article";

const foodPosts = [
  {
    id: 1,
    title: "春の桜モチーフパンケーキ",
    date: "2023-04-12",
    description:
      "今日のカフェで見つけた桜モチーフのパンケーキ。ほんのり桜の香りがして春を感じました。",
    imageUrl:
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    title: "手作り春野菜パスタ",
    date: "2023-04-10",
    description:
      "春の新鮮な野菜を使って作ったパスタ。アスパラガスとグリーンピースの香りが最高でした。",
    imageUrl:
      "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    title: "いちごのデザート",
    date: "2023-04-08",
    description: "季節のいちごを使ったデザート。甘酸っぱくて爽やかな味わいが春にぴったりです。",
    imageUrl:
      "https://images.unsplash.com/photo-1501959915551-4e8d30928317?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
];

class ArticleModel {
  private articles: {
    [userId: string]: Article[];
  } = {};

  findAll(userId: string) {
    console.log(userId, this.articles[userId]);

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
