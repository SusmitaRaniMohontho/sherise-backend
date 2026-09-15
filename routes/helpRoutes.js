import express from "express";
import { createHelpMessage, getFaqs } from "../controllers/helpController.js";
import { verifyToken } from "../middleware/authMiddleware.js"; // Middleware-er sothik file path updated

const router = express.Router();

// 1. Database theke FAQs anar route
router.get("/faqs", getFaqs);

// 2. Token authenticate kore help message send korar route
router.post("/", verifyToken, createHelpMessage);

export default router;