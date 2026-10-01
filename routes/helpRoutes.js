import express from "express";
import { getFaqs, createHelpMessage } from "../controllers/helpController.js";
import { verifyToken } from "../middleware/authMiddleware.js"; // 👈 middleware path

const router = express.Router();

// 🔒 Protected Routes
router.get("/faqs", verifyToken, getFaqs);
router.post("/", verifyToken, createHelpMessage);

export default router;