import express from "express";
import { getProviders } from "../controllers/providerController.js";
import { verifyToken } from "../middleware/authMiddleware.js"; // 👈 middleware import

const router = express.Router();

// 🔒 verifyToken যুক্ত করা হলো
router.get("/", verifyToken, getProviders); 

export default router;