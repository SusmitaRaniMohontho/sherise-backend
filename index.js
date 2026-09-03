import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js"; // তোমার লগইন রাউট আলাদা ফাইলে থেকে এখানে কানেক্ট হলো

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully!");
  })
  .catch((err) => {
    console.error("MongoDB Connection Failed:", err);
  });

// In-Memory Storage
let messages = []; // তোমার ফ্রেন্ডের হেল্প পেজের মেসেজগুলো এখানে নিরাপদে আছে

// 1. Your Login Route (Connected from authRoutes.js)
app.use("/api/auth", authRoutes);

// 2. Friend's Help Page - POST API (তোমার ফ্রেন্ডের কোড হুবহু ঠিক রাখা হয়েছে)
app.post("/api/help", (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: "All fields are required!" });
  }

  const newMessage = { id: Date.now(), name, email, message };
  messages.push(newMessage);

  console.log("New Message Received:", newMessage);

  res.status(201).json({
    success: true,
    message: "Message sent to backend successfully!",
    data: newMessage,
  });
});

// 3. Friend's Help Page - GET API (তোমার ফ্রেন্ডের কোড হুবহু ঠিক রাখা হয়েছে)
app.get("/api/help", (req, res) => {
  res.status(200).json({ success: true, data: messages });
});

// Base Route Test
app.get("/", (req, res) => {
  res.send("SheRise Express Backend Server is running successfully!");
});

// Server Start
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});