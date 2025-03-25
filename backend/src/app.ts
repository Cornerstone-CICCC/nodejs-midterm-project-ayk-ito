import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import cookieSession from "cookie-session";
import userRoutes from "./routes/user.routes";
import articleRoutes from "./routes/article.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(
  cookieSession({
    name: "session",
    keys: [process.env.SESSION_SECRET || "default_secret"],
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
);

// Routes
app.use("/users", userRoutes);
app.use("/articles", articleRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
