import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]); // ISP-er DNS blocking bypass korar jonno Google Public DNS force kora holo
dns.setDefaultResultOrder("ipv4first");

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser"; // for cookie handling
import { co2 } from "@tgwf/co2"; // CO2 emission tracker import

// ==========================================
// 1. ROUTE IMPORTS
// ==========================================
//Ankita< code (Authentication & Global Search)
import authRoutes from "./routes/authRoutes.js"; 
import searchRoutes from "./routes/searchRoutes.js"; // 

// Educational Content Routes (Articles & Books)
import educationalRoutes from "./routes/educationalRoutes.js"; // 👈 কন্টেন্ট পেজের রাউট যুক্ত করা হলো

// Susmita's Code (Help & Support)
import helpRoutes from "./routes/helpRoutes.js"; 

// Mahi's Code (Loan Feature)
import loanRoutes from "./routes/loanRoutes.js";

// Mahi's Code (Job Application Feature)
import jobRoutes from "./routes/jobRoutes.js"; 

// Appointment Booking Feature
import appointmentRoutes from "./routes/appointmentRoutes.js"; 

// Service Provider Fetching Feature
import providerRoutes from "./routes/providerRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize CO2 emission calculator (Sustainable Web Design model)
const co2Emission = new co2({ model: "swd" });

// ==========================================
// 2. MIDDLEWARES
// ==========================================
app.use(cors({
  origin: "http://localhost:5173", // Frontend default port
  credentials: true                // for cookie sent and rcv
}));

app.use(express.json());
app.use(cookieParser());

// Middleware to calculate network data transfer and CO2 emissions
app.use((req, res, next) => {
  let requestBytes = 0;
  let responseBytes = 0;

  if (req.body) requestBytes += Buffer.byteLength(JSON.stringify(req.body), "utf8");
  if (req.query) requestBytes += Buffer.byteLength(JSON.stringify(req.query), "utf8");
  if (req.headers) requestBytes += Buffer.byteLength(JSON.stringify(req.headers), "utf8");

  const originalWrite = res.write;
  const originalEnd = res.end;

  res.write = function (chunk) {
    if (chunk) responseBytes += Buffer.byteLength(chunk, "utf8");
    originalWrite.apply(res, arguments);
  };

  res.end = function (chunk) {
    if (chunk) responseBytes += Buffer.byteLength(chunk, "utf8");

    res.locals.totalBytes = requestBytes + responseBytes;
    const emissions = co2Emission.perByte(res.locals.totalBytes, false);

    console.log(`[Carbon Tracking] Data: ${res.locals.totalBytes} bytes | CO2: ${emissions.toFixed(5)} grams`);

    originalEnd.apply(res, arguments);
  };

  next();
});

// ==========================================
// 3. DATABASE CONNECTION
// ==========================================
mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000, 
    family: 4,                         
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

// Authentication Routes (Login / Register)
app.use("/api/auth", authRoutes);

// Global Search Routes (Articles, Books, Providers, FAQs)
app.use("/api/search", searchRoutes); 

// Educational Content Routes (Articles & Books - /api/articles, /api/books)
app.use("/api", educationalRoutes); // 👈 এখানে রেজিস্টার করা হলো যাতে /api/articles ও /api/books কাজ করে

// Help & Support Routes (Contact Messages / FAQs)
app.use("/api/help", helpRoutes);

// Loan Routes
app.use("/api/loans", loanRoutes);

// Job Application Routes
app.use("/api/jobs", jobRoutes);

// Appointment Booking Routes
app.use("/api/appointments", appointmentRoutes);

// Service Provider Routes
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