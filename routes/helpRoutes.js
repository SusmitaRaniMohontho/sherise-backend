import express from "express";

import { getFaqs } from "../controllers/helpController.js";

import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();


// ==========================================
// FAQ Route
// Login kora user-ra FAQ access korte parbe
// ==========================================

router.get("/faqs", verifyToken, getFaqs);


export default router;