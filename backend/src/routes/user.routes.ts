import express from "express";
import userController from "../controllers/user.controller";
import { checkAuth } from "../middlewares/auth";

const router = express.Router();

router.post("/", userController.addUser);
router.post("/login", userController.loginUser);
router.post("/logout", userController.logoutUser);

router.get("/", checkAuth, userController.getUsers);
router.get("/profile", checkAuth, userController.getUserProfile);
router.get("/:id", checkAuth, userController.getUserById);

export default router;
