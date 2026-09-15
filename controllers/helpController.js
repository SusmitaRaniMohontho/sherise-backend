import HelpMessage from "../models/HelpMessage.js";
import Faq from "../models/Faq.js";
import User from "../models/User.js"; // APNAR USER MODEL LOCATION ANUJAYI CHECK KORBEN

// 1. Send Help Message (Token Auth Protected)
export const createHelpMessage = async (req, res) => {
  const { message } = req.body;
  const userId = req.user.userId; // verifyToken middleware theke asbe

  if (!message) {
    return res.status(400).json({ success: false, message: "Message is required!" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found!" });
    }

    const newMessage = new HelpMessage({
      userId: user._id,
      name: user.name,
      email: user.email,
      message,
    });

    await newMessage.save();

    res.status(201).json({
      success: true,
      message: "Message sent successfully!",
      data: newMessage,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Fetch FAQs from Database
export const getFaqs = async (req, res) => {
  try {
    const faqs = await Faq.find();
    res.status(200).json({ success: true, data: faqs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};