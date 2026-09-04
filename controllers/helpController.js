import HelpMessage from "../models/HelpMessage.js";

// ১. নতুন মেসেজ সেভ করা (POST)
export const createHelpMessage = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: "All fields are required!" });
  }

  try {
    const newMessage = new HelpMessage({ name, email, message });
    await newMessage.save();

    // 🚀 VS Code টার্মিনালে ইনস্ট্যান্ট ডাটা দেখার জন্য লগ যুক্ত করা হলো
    console.log("Saved to Database:", newMessage);

    res.status(201).json({
      success: true,
      message: "Message sent successfully!",
      data: newMessage,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ২. সব মেসেজ ডাটাবেজ থেকে নিয়ে আসা (GET)
export const getHelpMessages = async (req, res) => {
  try {
    const messages = await HelpMessage.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};