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
import jobRoutes from "./routes/jobRoutes.js"; 

// Your Code (Appointment Booking Feature)
import appointmentRoutes from "./routes/appointmentRoutes.js"; 

// Your Code (Provider Fetching Feature - Dynamic Database Integration)
import providerRoutes from "./routes/providerRoutes.js";

// Your Code (Educational Content Feature - Articles & Digital Library)
import educationalRoutes from "./routes/educationalRoutes.js"; 

// ==========================================
// 2. CONFIGURATION & MIDDLEWARES
// ==========================================
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration (allow frontend port and credentials)
app.use(cors({
  origin: "http://localhost:5173", // Ankita's vite default port
  credentials: true                // for cookie sent and rcv
}));

app.use(express.json());
app.use(cookieParser()); // cookie parser middleware

// ==========================================
// 3. DATABASE CONNECTION
// ==========================================
// MongoDB Atlas Connection Configuration
mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000, // Slow network er jonno 10 second time-out
    family: 4,                       // IPv4 force korar jonno
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
app.use("/api/jobs", jobRoutes);

// Your Work: Appointment Booking Routes
app.use("/api/appointments", appointmentRoutes);

// Your Work: Service Provider Routes (Database integration)
app.use("/api/providers", providerRoutes);

// Your Work: Educational Content Routes (Articles & Digital Library)
app.use("/api", educationalRoutes); 

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