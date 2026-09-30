import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

const JWT_SECRET =
  process.env.JWT_SECRET || "my_super_secret_jwt_key_12345";

// ==========================================
// 1. SIGN UP
// ==========================================
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        error: "Email is already in use",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();//database e save

    res.status(201).json({
      message: "User registered successfully!",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// ==========================================
// 2. LOGIN
// ==========================================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        error: "User not found!",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(400).json({
        error: "Invalid credentials!",
      });
    }

    // Create JWT
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    // Save JWT in HttpOnly Cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // localhost
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful!",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// ==========================================
// 3. GET LOGGED-IN USER PROFILE
// ==========================================
router.get("/profile", async (req, res) => {
  try {
    // Get JWT from cookie
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        error: "Not logged in",
      });
    }

    // Verify JWT
    const decoded = jwt.verify(token, JWT_SECRET);

    // Find user from database
    const user = await User.findById(decoded.userId).select("-password");//password field bad dewa hcche

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    // Do not cache authentication information
    res.set("Cache-Control", "no-store");

    // Send user information
    res.status(200).json({
      name: user.name,
      email: user.email,
      role: user.role,
      bio: user.bio,
    });
  } catch (err) {
    res.status(401).json({
      error: "Token is invalid or expired",
    });
  }
});

// ==========================================
// 4. UPDATE PROFILE
// ==========================================
router.put("/profile/update", async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        error: "Not logged in",
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    const { name, role, bio } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      decoded.userId,
      {
        name,
        role,
        bio,
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    res.set("Cache-Control", "no-store");

    res.status(200).json({
      message: "Profile updated successfully!",
      user: updatedUser,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// ==========================================
// 5. LOGOUT
// ==========================================
router.post("/logout", (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.status(200).json({
      message: "Logged out successfully!",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

export default router;