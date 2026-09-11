import express from "express";
import { createAppointment } from "../controllers/appointmentController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// বুকিং করতে গেলে আগে verifyToken মিডলওয়্যার চেক করবে
router.post("/", verifyToken, createAppointment);

export default router;