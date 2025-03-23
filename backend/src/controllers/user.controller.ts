import { Request, Response } from "express";
import userModel from "../models/user.model";
import { User } from "../types/user";

/**
 * Get all users
 *
 * @param {Request} req
 * @param {Response} res
 * @returns {void} Returns list of users.
 */
const getUsers = (req: Request, res: Response) => {
  const users = userModel.findAll();
  res.status(200).json(users);
};

/**
 * Get user by ID
 *
 * @param {Request<{ id: string}>} req
 * @param {Response} res
 * @returns {void} Returns one user.
 */
const getUserById = (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  const user = userModel.findById(id);
  if (!user) {
    res.status(404).send("User not found!");
    return;
  }
  res.status(200).json(user);
};

/**
 * Add new user
 *
 * @param {Request<{ id: string}>} req
 * @param {Response} res
 * @returns {void} Returns newly created user.
 */
const addUser = async (req: Request<{}, {}, Omit<User, "id">>, res: Response) => {
  const { username, password, firstname, lastname } = req.body;
  if (!username || !password || !firstname || !lastname) {
    res.status(500).json({ error: "Username/password/firstname/lastname is empty!" });
    return;
  }
  const user = await userModel.createUser({ username, password, firstname, lastname });
  if (!user) {
    res.status(409).json({ error: "Username is taken!" });
    return;
  }
  res.status(201).json(user);
};

/**
 * Login user
 *
 * @param {Request<{}, {}, Omit<User, 'id'>>} req
 * @param {Response} res
 * @returns {void} Returns cookie and redirect.
 */
const loginUser = async (req: Request<{}, {}, Omit<User, "id">>, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(500).send("Username/password is missing!");
    return;
  }

  const user = await userModel.checkUserPass(username, password);
  if (!user) {
    res.status(500).send("Login details are incorrect!");
    return;
  }
  if (req.session) {
    req.session.isLoggedIn = true;
    req.session.username = user.username;
  }
  res.status(200).send("Successfully logged in!");
};

const getUserProfile = (req: Request, res: Response) => {
  const username = req.session?.username;
  const user = userModel.findByUsername(username);
  if (!user) {
    res.status(404).send("User not found");
    return;
  }
  const { password, ...userWithoutPassword } = user;
  res.status(200).json(userWithoutPassword);
};

const logoutUser = (req: Request, res: Response) => {
  if (req.session) {
    req.session = null;
  }
  res.status(200).send("Logged out successfully");
};

export default {
  getUsers,
  getUserById,
  addUser,
  loginUser,
  getUserProfile,
  logoutUser,
};
