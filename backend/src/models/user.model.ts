import { v4 as uuidv4 } from "uuid";
import { User } from "../types/user";
import bcrypt from "bcrypt";
import articleModel from "./article.model";
import fs from "fs";
import path from "path";

// データ保存用ファイルパスの設定
const DATA_DIR = path.join(__dirname, "../../../data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

// ディレクトリが存在しない場合は作成
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

class UserModel {
  private users: User[] = [];

  constructor() {
    this.loadUsers();
  }

  // ユーザーデータをファイルから読み込む
  private loadUsers(): void {
    try {
      if (fs.existsSync(USERS_FILE)) {
        const data = fs.readFileSync(USERS_FILE, "utf8");
        this.users = JSON.parse(data);
        console.log(`Loaded ${this.users.length} users from storage`);
      }
    } catch (error) {
      console.error("Error loading users from file:", error);
      this.users = [];
    }
  }

  // ユーザーデータをファイルに保存
  private saveUsers(): void {
    try {
      const data = JSON.stringify(this.users, null, 2);
      fs.writeFileSync(USERS_FILE, data);
    } catch (error) {
      console.error("Error saving users to file:", error);
    }
  }

  findAll() {
    return this.users;
  }

  findById(id: string) {
    const user = this.users.find((u) => u.id === id);
    if (!user) return null;
    return user;
  }

  findByUsername(username: string | undefined) {
    if (!username) return null;
    return this.users.find((u) => u.username === username) || null;
  }

  async createUser(newUser: Omit<User, "id">) {
    const { username, password, firstname, lastname } = newUser;
    const foundIndex = this.users.findIndex((u) => u.username === username);
    if (foundIndex !== -1) return false;
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = {
      id: uuidv4(),
      username,
      password: hashedPassword,
      firstname,
      lastname,
    };
    this.users.push(user);

    // ユーザーデータを保存
    this.saveUsers();

    return user;
  }

  async login() {}

  async checkUserPass(username: string, password: string) {
    const user = this.users.find((u) => u.username === username);

    if (!user) return false;
    const isMatch: boolean = await bcrypt.compare(password, user.password);
    if (!isMatch) return false;
    return user;
  }
}

export default new UserModel();
