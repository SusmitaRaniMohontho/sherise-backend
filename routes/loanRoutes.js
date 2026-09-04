import express from "express";
import Loan from "../models/Loan.js";

const router = express.Router();

// POST /api/loans
router.post("/", async (req, res) => {
  try {
    console.log("📥 Incoming Loan Application Data:", req.body);

    const { name, address, contact, amount } = req.body;

    if (!name || !address || !contact || !amount) {
      console.log("⚠️ Validation Failed: Missing required fields.");
      return res.status(400).json({ message: "All fields are required" });
    }

    const newLoan = new Loan({ name, address, contact, amount });
    const savedLoan = await newLoan.save();

    console.log("✅ Successfully Saved to MongoDB:", savedLoan);

    res.status(201).json({ message: "Loan application submitted successfully!", data: savedLoan });
  } catch (error) {
    console.error("❌ Error Saving Loan Application:", error.message);
    res.status(500).json({ message: "Server error, please try again." });
  }
});

export default router;