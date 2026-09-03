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

  console.log("Login Attempt Received - Email:", email);

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required!" });
  }

  // Check against static test user or registered users array
  const foundUser = users.find((u) => u.email === email && u.password === password);

  if ((email === "user@sherise.com" && password === "123456") || foundUser) {
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

// Register / Sign-up - POST API
app.post("/api/auth/register", (req, res) => {
  const { name, email, password } = req.body;

  console.log("Register Attempt Received - Email:", email);

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: "All fields are required!" });
  }

  // Check if user already exists
  const existingUser = users.find((u) => u.email === email);
  if (existingUser) {
    return res.status(400).json({ success: false, message: "User already exists with this email!" });
  }

  // Save user to the in-memory array
  const newUser = { id: Date.now(), name, email, password };
  users.push(newUser);

  return res.status(201).json({
    success: true,
    message: "Registration successful!",
    token: "dummy-jwt-token-" + Date.now(),
  });
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