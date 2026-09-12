import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const router = express.Router();

// সিক্রেট কি
const JWT_SECRET = process.env.JWT_SECRET || "my_super_secret_jwt_key_12345";

// ==========================================
// ১. SIGNUP (রেজিস্ট্রেশন উইথ পাসওয়ার্ড হ্যাশিং)
// ==========================================
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already in use" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ 
      name, 
      email, 
      password: hashedPassword 
    });
    
    await newUser.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// ২. LOGIN (লগইন উইথ কুকিজ টোকেন জেনারেশন)
// ==========================================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid credentials!" });
    }

    // JWT টোকেন তৈরি করা (মেয়াদ ১ দিন)
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    // কুকি সেট করা (১ দিন মেয়াদ)
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,  // Localhost এ false
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000 // ২৪ ঘণ্টা
    });

    res.status(200).json({ 
      message: "Login successful!", 
      name: user.name,
      email: user.email
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// ৩. PROTECTED PROFILE ROUTE
// ==========================================
router.get("/profile", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: "Access denied. No token provided in cookies." });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(401).json({ error: "Token is invalid or expired. Please login again." });
  }
});

// ==========================================
// ৪. LOGOUT ROUTE (কুকি ক্লিয়ার বা ডিলিট করার জন্য)
// ==========================================
router.post("/logout", (req, res) => {
  try {
    // ব্রাউজার থেকে 'token' নামের কুকিটি ক্লিয়ার বা মুছে ফেলা
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "lax",
      secure: false, // লকালহোস্টে false থাকবে
    });

    res.status(200).json({ message: "Logged out successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;