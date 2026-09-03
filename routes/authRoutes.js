import express from "express";

const router = express.Router();

// Temporary user array for testing before database connection
let users = [];

// Login API Route
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  console.log("Login Attempt Received - Email:", email);

  if (!email || !password) {
    return res.status(400).json({ 
      success: false, 
      message: "Email and password are required!" 
    });
  }

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

export default router;