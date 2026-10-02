import express from "express";
import Loan from "../models/Loan.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Helper middleware for admin verification
const verifyAdmin = (req, res, next) => {
  if (req.user?.systemRole !== "admin") {
    return res.status(403).json({ message: "Access denied. Admin only." });
  }
  next();
};

// POST: Apply for a new loan
router.post("/apply", verifyToken, async (req, res) => {
  try {
    const userId = req.user?.id || req.user?.userId || req.user?._id || req.user?.sub;
    if (!userId) {
      return res.status(400).json({ message: "User ID not found in token session!" });
    }

    const loanData = req.body;

    const newLoan = new Loan({
      ...loanData,
      userId,
      status: "pending",
    });

    await newLoan.save();
    return res.status(201).json({ message: "Loan application submitted successfully!", loan: newLoan });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// GET: Fetch ONLY logged-in user's own loan applications
router.get("/my-loans", verifyToken, async (req, res) => {
  try {
    console.log("🔍 [LOAN ROUTES] Decoded Token User:", req.user);
    const userId = req.user?.id || req.user?.userId || req.user?._id || req.user?.sub;
    
    if (!userId) {
      return res.status(400).json({ message: "User ID not found in token session!" });
    }

    const myLoans = await Loan.find({ userId }).sort({ createdAt: -1 });
    return res.status(200).json(myLoans);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// GET: Fetch all loans (Admin Dashboard Only)
router.get("/", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const loans = await Loan.find().sort({ createdAt: -1 });
    return res.status(200).json(loans);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// PUT: Update loan application status (Admin Action)
router.put("/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { status } = req.body;
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

    return res.status(200).json({ message: `Loan application ${status} successfully!`, application: updatedLoan });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;