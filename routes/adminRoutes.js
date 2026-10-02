import express from "express";
import Loan from "../models/Loan.js";
import JobApplication from "../models/jobs.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Helper middleware to check if user is an admin
const verifyAdmin = (req, res, next) => {
  if (req.user?.systemRole !== "admin") {
    return res.status(403).json({ message: "Access denied. Admin privileges required." });
  }
  next();
};

// ==========================================
// 1. GET ALL JOB APPLICATIONS (Admin Only)
// Matches endpoint: GET /api/admin/jobs
// ==========================================
router.get("/jobs", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const jobs = await JobApplication.find().sort({ createdAt: -1 });
    return res.status(200).json(jobs);
  } catch (error) {
    console.error("❌ Error fetching jobs for admin:", error.message);
    return res.status(500).json({ message: error.message });
  }
});

// ==========================================
// 2. UPDATE JOB APPLICATION STATUS (Admin Only)
// Matches endpoint: PUT /api/admin/jobs/:id
// ==========================================
router.put("/jobs/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { status } = req.body; // "accepted" or "rejected"

    if (!["accepted", "rejected", "pending"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value!" });
    }

    const updatedJob = await JobApplication.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedJob) {
      return res.status(404).json({ message: "Job application not found!" });
    }

    console.log(`🔄 Job Application ${req.params.id} updated to: ${status.toUpperCase()}`);
    return res.status(200).json({ message: `Job application ${status} successfully!`, updatedJob });
  } catch (error) {
    console.error("❌ Error updating job status:", error.message);
    return res.status(500).json({ message: error.message });
  }
});

// ==========================================
// 3. GET ALL LOAN APPLICATIONS (Admin Only)
// Matches endpoint: GET /api/admin/loans
// ==========================================
router.get("/loans", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const loans = await Loan.find().sort({ createdAt: -1 });
    return res.status(200).json(loans);
  } catch (error) {
    console.error("❌ Error fetching loans for admin:", error.message);
    return res.status(500).json({ message: error.message });
  }
});

// ==========================================
// 4. UPDATE LOAN APPLICATION STATUS (Admin Only)
// Matches endpoint: PUT /api/admin/loans/:id
// ==========================================
router.put("/loans/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { status } = req.body; // "accepted" or "rejected"

    if (!["accepted", "rejected", "pending"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value!" });
    }

    const updatedLoan = await Loan.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedLoan) {
      return res.status(404).json({ message: "Loan application not found!" });
    }

    console.log(`🔄 Loan Application ${req.params.id} updated to: ${status.toUpperCase()}`);
    return res.status(200).json({ message: `Loan application ${status} successfully!`, updatedLoan });
  } catch (error) {
    console.error("❌ Error updating loan status:", error.message);
    return res.status(500).json({ message: error.message });
  }
});

export default router;