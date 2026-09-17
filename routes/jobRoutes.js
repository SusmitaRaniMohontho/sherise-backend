import express from "express";
import JobApplication from "../models/jobs.js";
import { verifyToken } from "../middleware/authMiddleware.js"; // Uses Ankita's token verification middleware

const router = express.Router();

// POST: Submit job application (Protected by Token Middleware)
router.post("/apply", verifyToken, async (req, res) => {
  try {
    const { jobTitle, name, phone, address, email, qualification, skills, amount } = req.body;
    
    // Extract userId safely from the decoded token payload
    const userId = req.user?.id || req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: No user ID found in token." });
    }

    if (!jobTitle || !name || !phone || !address || !email || !qualification || !skills || !amount) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const newApplication = new JobApplication({
      userId,
      jobTitle,
      name,
      phone,
      address,
      email,
      qualification,
      skills,
      amount,
    });

    await newApplication.save();

    console.log(`✅ Job application for '${jobTitle}' saved for user ID: ${userId}`);

    return res.status(201).json({
      message: "Application submitted successfully!",
      application: newApplication,
    });
  } catch (error) {
    console.error("❌ Error saving job application:", error.message);
    return res.status(500).json({ message: error.message });
  }
});

export default router;