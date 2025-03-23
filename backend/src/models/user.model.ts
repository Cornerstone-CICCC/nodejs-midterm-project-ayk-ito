import { v4 as uuidv4 } from "uuid";
import { User } from "../types/user";
import bcrypt from "bcrypt";

class UserModel {
  private users: User[] = [];

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
    return user;
  }

  async login() {}

  async checkUserPass(username: string, password: string) {
    console.log(this.users);

    const user = this.users.find((u) => u.username === username);
    console.log(user);

    if (!user) return false;
    const isMatch: boolean = await bcrypt.compare(password, user.password);
    if (!isMatch) return false;
    return user;
  }
}

export default new UserModel();
