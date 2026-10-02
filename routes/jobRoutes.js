import express from "express";
import JobApplication from "../models/jobs.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Helper middleware for admin verification
const verifyAdmin = (req, res, next) => {
  if (req.user?.systemRole !== "admin") {
    return res.status(403).json({ message: "Access denied. Admin only." });
  }
  next();
};

// POST: Submit a new job application
router.post("/apply", verifyToken, async (req, res) => {
  try {
    const userId = req.user?.id || req.user?.userId || req.user?._id || req.user?.sub;
    if (!userId) {
      return res.status(400).json({ message: "User ID not found in token session!" });
    }

    const { jobTitle, name, phone, address, email, qualification, skills, amount } = req.body;

    if (!jobTitle || !name || !phone || !address || !email) {
      return res.status(400).json({ message: "Required fields are missing!" });
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
      status: "pending",
    });

    await newApplication.save();
    return res.status(201).json({ message: "Application submitted successfully!", application: newApplication });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// GET: Fetch ONLY logged-in user's own job applications
router.get("/my-applications", verifyToken, async (req, res) => {
  try {
    console.log("🔍 [JOB ROUTES] Decoded Token User:", req.user);
    const userId = req.user?.id || req.user?.userId || req.user?._id || req.user?.sub;
    
    if (!userId) {
      return res.status(400).json({ message: "User ID not found in token session!" });
    }

    const myApps = await JobApplication.find({ userId }).sort({ createdAt: -1 });
    return res.status(200).json(myApps);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// GET: Fetch all job applications (Admin Dashboard Only)
router.get("/", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const apps = await JobApplication.find().sort({ createdAt: -1 });
    return res.status(200).json(apps);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// PUT: Update job application status (Admin Action)
router.put("/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    if (!["accepted", "rejected", "pending"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value!" });
    }

    const updatedApp = await JobApplication.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedApp) {
      return res.status(404).json({ message: "Job application not found!" });
    }

    return res.status(200).json({ message: `Job application ${status} successfully!`, application: updatedApp });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;