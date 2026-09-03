const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-Memory Storage
let users = [];
let messages = [];

// Base Route Test
app.get("/", (req, res) => {
  res.send("SheRise Express Backend Server is running successfully!");
});

// Login - POST API
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  // এই লাইনটি এখানে বসিয়ে দেবে, তাহলে লগইন রিকোয়েস্ট আসলে টার্মিনালে দেখা যাবে
  console.log("Login Attempt Received - Email:", email);

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required!" });
  }

  if (email === "user@sherise.com" && password === "123456") {
    return res.status(200).json({
      success: true,
      message: "Login successful!",
      token: "dummy-jwt-token-12345",
    });
  } else {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password. Please try again.",
    });
  }
});

// Help Page - POST API
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

// Help Page - GET API
app.get("/api/help", (req, res) => {
  res.status(200).json({ success: true, data: messages });
});

// Server Start
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});