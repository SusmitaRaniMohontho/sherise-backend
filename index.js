import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]); // ISP-er DNS blocking bypass korar jonno Google Public DNS force kora holo
dns.setDefaultResultOrder("ipv4first");

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser"; // for cookie handling

// ==========================================
// 1. ROUTE IMPORTS
// ==========================================
// Ankita's Code (Authentication)
import authRoutes from "./routes/authRoutes.js"; 

// Susmita's Code (Help & Support)
import helpRoutes from "./routes/helpRoutes.js"; 

// Mahi's Code (Loan Feature)
import loanRoutes from "./routes/loanRoutes.js";

// Mahi's Code (Job Application Feature)
import jobRoutes from "./routes/jobRoutes.js"; // 👈 ADDED HERE

// 🔴 UPDATED BY YOU: Your Code (Appointment Booking Feature)
import appointmentRoutes from "./routes/appointmentRoutes.js"; 

// 🔴 UPDATED BY YOU: Your Code (Provider Fetching Feature - Dynamic Database Integration)
import providerRoutes from "./routes/providerRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ==========================================
// 2. MIDDLEWARES
// ==========================================
// 🔴 CORS configuration updated to allow frontend port and credentials (cookies)
app.use(cors({
  origin: "http://localhost:5173", // Ankita's viter default port
  credentials: true                //for cookie sent and rcv
}));

app.use(express.json());
app.use(cookieParser()); // ccokie parser middlewears hisebe add kora holo
// ==========================================
// 3. DATABASE CONNECTION
// ==========================================
// MongoDB Atlas Connection Configuration
mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000, // Slow network er jonno 10 second time-out
    family: 4,                         // IPv4 force korar jonno
  })
  .then(() => {
    console.log("MongoDB Connected Successfully!");
  })
  .catch((err) => {
    console.error("MongoDB Connection Failed Error:", err.message);
  });

// ==========================================
// 4. API ROUTES
// ==========================================

// Ankita's Work: User Authentication Routes (Login / Register)
app.use("/api/auth", authRoutes);

// Susmita's Work: Help & Support Routes (Contact Messages / FAQs)
app.use("/api/help", helpRoutes);

// Mahi's Work: Loan Routes
app.use("/api/loans", loanRoutes);

// Mahi's Work: Job Application Routes
app.use("/api/jobs", jobRoutes); // 👈 ADDED HERE

// 🔴 UPDATED BY YOU: Your Work - Appointment Booking Routes
app.use("/api/appointments", appointmentRoutes);

// 🔴 UPDATED BY YOU: Your Work - Service Provider Routes (ডাটাবেস থেকে প্রভাইডার ডাটা আনার জন্য)
app.use("/api/providers", providerRoutes);

// Base Route (Server Health Check)
app.get("/", (req, res) => {
  res.send("SheRise Express Backend Server is running successfully!");
});

// ==========================================
// 5. SERVER INITIALIZATION
// ==========================================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});