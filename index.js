import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

// Load environment variables from a .env file
dotenv.config();

// Import your route files
import loanRoutes from "./routes/loanRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import authRoutes from "./routes/authRoutes.js";


const app = express();

// 1. Essential Middlewares
app.use(express.json());
app.use(cookieParser()); // Crucial for reading auth cookies in verifyToken!

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"], // Add your React frontend origins
    credentials: true, // Required to allow cookies across origins
  })
);

// 2. Connect to MongoDB using environment variables or a direct fallback string
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/sherise";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB successfully");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

// 3. Mount API Routes
app.use("/api/loans", loanRoutes);
app.use("/api/jobs", jobRoutes);
 app.use("/api/auth", authRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("SheRise Backend server is up and running!");
});

// 4. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});