import express from "express";
import { globalSearch } from "../controllers/searchController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔒 Protected Global Search Route: /api/search?q=keyword
router.get("/", verifyToken, globalSearch);

export default router;