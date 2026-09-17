import express from "express";
import Loan from "../models/Loan.js";
import { verifyToken } from "../middleware/authMiddleware.js";; // 👈 Required to verify token and get userId

const router = express.Router();

// POST: Submit a new loan application (Protected with verifyToken)
router.post("/", verifyToken, async (req, res) => {
  try {
    const { name, address, phone, email, amount } = req.body;
    
    // 🛡️ Extract userId from the verified token middleware
    const userId = req.user?.id || req.user?.userId;

    // 🔴 TERMINAL LOGGING: Displays incoming loan details in backend console
    console.log("\n===========================================");
    console.log("📥 NEW LOAN APPLICATION RECEIVED:");
    console.log("User ID from Token:", userId);
    console.log("Full Name         :", name);
    console.log("Address           :", address);
    console.log("Phone Number      :", phone);
    console.log("Email             :", email);
    console.log("Loan Amount       :", amount);
    console.log("===========================================\n");

    // Validate that required fields are non-empty
    if (
      !name?.trim() ||
      !address?.trim() ||
      !phone?.trim() ||
      !email?.trim() ||
      !amount?.trim()
    ) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    // 👈 userId is now included here to satisfy your Loan.js schema requirement
    const newLoan = new Loan({
      userId, 
      name,
      address,
      phone,
      email,
      amount,
    });

    await newLoan.save();

    console.log("✅ LOAN APPLICATION SAVED TO DATABASE SUCCESSFULLY!\n");

    return res.status(201).json({
      message: "Loan application submitted successfully!",
      loan: newLoan,
    });
  } catch (error) {
    console.error("❌ ERROR SAVING LOAN:", error.message);
    return res.status(500).json({ message: error.message });
  }
});

// GET: Fetch all submitted loan applications (Protected with verifyToken)
router.get("/", verifyToken, async (req, res) => {
  try {
    const loans = await Loan.find().sort({ createdAt: -1 });
    return res.status(200).json(loans);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;