import express from "express";
import User from "../models/user.js";

const router = express.Router();
//request receive

router.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        //email e kono user ache kina check
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email is already in use" });
        }

        // new user save
        const newUser = new User({ name, email, password });
        await newUser.save();//data save database

        res.status(201).json({ message: "User registered successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // find user by database email
        const user = await User.findOne({ email });//user er vtr rslt store
        if (!user) {
            return res.status(404).json({ error: "User not found!" });
        }

        // password check
        if (user.password !== password) {
            return res.status(400).json({ error: "Invalid credentials!" });
        }

        res.status(200).json({ message: "Login successful!", name: user.name });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;