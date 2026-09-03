import express from "express";
import User from "../models/user.js";

const router = express.Router();

// ১. সাইন-আপ রাউট (প্রথমে ডেটাবেজে অ্যাকাউন্ট তৈরি করার জন্য)
router.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // চেক করা এই ইমেইলে অলরেডি কোনো ইউজার আছে কি না
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email is already in use" });
        }

        // নতুন ইউজার সেভ করা
        const newUser = new User({ name, email, password });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ২. লগইন রাউট (পরবর্তীতে ভেরিফাই করার জন্য)
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // ডেটাবেজে ইমেইল দিয়ে ইউজার খোঁজা
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found!" });
        }

        // পাসওয়ার্ড মিলছে কি না চেক করা
        if (user.password !== password) {
            return res.status(400).json({ error: "Invalid credentials!" });
        }

        res.status(200).json({ message: "Login successful!", name: user.name });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;