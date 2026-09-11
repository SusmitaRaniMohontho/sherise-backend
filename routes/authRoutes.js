import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const router = express.Router();

// সিক্রেট কি (এটি টোকেন এনক্রিপ্ট করতে লাগে, প্রোডাকশনে .env ফাইলে রাখতে হয়)
const JWT_SECRET = process.env.JWT_SECRET || "my_super_secret_jwt_key_12345";

// ==========================================
// ১. SIGNUP (রেজিস্ট্রেশন উইথ পাসওয়ার্ড হ্যাশিং)
// ==========================================
router.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // ইমেইল অলরেডি ডাটাবেজে আছে কি না চেক করা
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email is already in use" });
        }

        // পাসওয়ার্ড সিকিউর বা হ্যাশ করার জন্য Bcrypt ব্যবহার (স্যারের চাওয়া অনুযায়ী)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // নতুন ইউজার হ্যাশড পাসওয়ার্ডসহ সেভ করা
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

        // ডেটাবেজ থেকে ইউজার খোঁজা
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found!" });
        }

        // Bcrypt দিয়ে পাসওয়ার্ড ম্যাচ করে কি না চেক করা
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: "Invalid credentials!" });
        }

        // সবকিছু ঠিক থাকলে JWT টোকেন তৈরি করা (এক্সপায়ারি টাইম ১০ সেকেন্ড)
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: "10s" }
        );

        // 🔴 লোকাল স্টোরেজের পরিবর্তে এখন HttpOnly Cookie সেট করা হচ্ছে (স্যারের রিকোয়ারমেন্ট অনুযায়ী)
        res.cookie("token", token, {
            httpOnly: true, // জাভাস্ক্রিপ্ট দিয়ে এটা কেউ চুরি করতে পারবে না
            secure: false,  // লোকালহোস্টে false রাখতে হয় (প্রোডাকশনে true হবে)
            maxAge: 10 * 1000 // ১০ সেকেন্ড মিলিসেকেন্ডে (টোকেনের মেয়াদের সাথে সামঞ্জস্যপূর্ণ)
        });

        // কুকিজ সেট হয়ে যাওয়ার পর সাকসেস রেসপন্স পাঠানো (সাথে ইউজারের নাম ও ইমেইল)
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
// ৩. PROTECTED PROFILE ROUTE (কুকি থেকে টোকেন ভেরিফিকেশন)
// ==========================================
router.get("/profile", async (req, res) => {
    try {
        // 🔴 হেডার বাদ দিয়ে এখন কুকি থেকে টোকেন রিড করা হচ্ছে
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ error: "Access denied. No token provided in cookies." });
        }

        // টোকেন ভ্যালিড এবং এক্সপায়ার হয়ে গেছে কি না তা চেক করা (১০ সেকেন্ড পার হলে এখানে ধরা পড়বে)
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

export default router;