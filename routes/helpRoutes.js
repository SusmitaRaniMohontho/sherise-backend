import express from "express";
// Help controller theke funtion gulo import kora holo
import { createHelpMessage, getHelpMessages } from "../controllers/helpController.js";

// Express router initialize kora holo
const router = express.Router();

// 1. New help message database e save korar jonno POST route
router.post("/", createHelpMessage);

// 2. Database theke sob help messages niye asar jonno GET route
router.get("/", getHelpMessages);

// Router ti onno file e use korar jonno export kora holo
export default router;