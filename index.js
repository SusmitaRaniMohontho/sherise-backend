import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]); // ISP-র DNS ব্লকিং বাইপাস করার জন্য Google Public DNS ফোরস করা হলো
dns.setDefaultResultOrder("ipv4first");

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

// ==========================================
// 1. ROUTE IMPORTS (রুট ইমপোর্ট)
// ==========================================
// Ankita's Code (অঙ্কিতার কোড - Authentication)
import authRoutes from "./routes/authRoutes.js"; 

// Susmita's Code (সুস্মিতার কোড - Help & Support)
import helpRoutes from "./routes/helpRoutes.js"; 

//mahi
import loanRoutes from "./routes/loanRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ==========================================
// 2. MIDDLEWARES (মিডলওয়্যার)
// ==========================================
app.use(cors());
app.use(express.json());

// ==========================================
// 3. DATABASE CONNECTION (ডাটাবেজ কানেকশন)
// ==========================================
// MongoDB Atlas Connection Configuration
mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000, // স্লো নেটওয়ার্কের জন্য ১০ সেকেন্ড টাইম-আউট
    family: 4,                       // IPv4 বাধ্যবাধকতা ফোরস করার জন্য
  })
  .then(() => {
    console.log("MongoDB Connected Successfully!");
  })
  .catch((err) => {
    console.error("MongoDB Connection Failed Error:", err.message);
  });

// ==========================================
// 4. API ROUTES (এপিআই রুটসমূহ)
// ==========================================

// Ankita's Work: User Authentication Routes (Login / Register)
app.use("/api/auth", authRoutes);

// Susmita's Work: Help & Support Routes (Contact Messages / FAQs)
app.use("/api/help", helpRoutes);

//mahi
app.use("/api/loans", loanRoutes);

// Base Route (Server Health Check)
app.get("/", (req, res) => {
  res.send("SheRise Express Backend Server is running successfully!");
});

// ==========================================
// 5. SERVER INITIALIZATION (সার্ভার স্টার্ট)
// ==========================================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});