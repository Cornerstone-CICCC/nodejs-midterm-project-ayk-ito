// Create your server
import express, { Request, Response } from "express";
import path from "path";
import cookieSession from "cookie-session";
import userRouter from "./routes/user.routes";
import articleRouter from "./routes/article.routes";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

// Create server
const app = express();

// Middleware
const SIGN_KEY = process.env.COOKIE_SIGN_KEY;
const ENCRYPT_KEY = process.env.COOKIE_ENCRYPT_KEY;
if (!SIGN_KEY || !ENCRYPT_KEY) {
  throw new Error("Missing cookie keys!");
}
app.use(
  cookieSession({
    name: "session",
    keys: [SIGN_KEY, ENCRYPT_KEY],
    maxAge: 24 * 60 * 60 * 1000, // Changed from 3 minutes to 24 hours (1 day)
  })
);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../src/views"));

app.use(
  cors({
    origin: "http://localhost:4321", // Astro port
    credentials: true, // allow cookies
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Routes
app.use("/users", userRouter);
app.use("/articles", articleRouter);

// 404 Fallback
app.use((req: Request, res: Response) => {
  res.status(404).send("Page not found!");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/`);
});
