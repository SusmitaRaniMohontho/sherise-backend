import express from "express";
import { getArticles, getBooks } from "../controllers/educationalController.js";
import { verifyToken } from "../middleware/authMiddleware.js"; // 👈 middlewares এর জায়গায় middleware দেওয়া হলো

const router = express.Router();

router.get("/articles", verifyToken, getArticles);
router.get("/books", verifyToken, getBooks);

export default router;