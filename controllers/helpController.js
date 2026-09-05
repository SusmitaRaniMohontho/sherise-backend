import HelpMessage from "../models/HelpMessage.js";

// 1. Notun message database e save korar function (POST request)
export const createHelpMessage = async (req, res) => {
  const { name, email, message } = req.body;

  // Shob gulo field puron kora hoese kina ta check kora
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: "All fields are required!" });
  }

  try {
    // Notun message Object create ebong Database e save kora
    const newMessage = new HelpMessage({ name, email, message });
    await newMessage.save();

    // VS Code terminal e instant data dekhar jonno console log
    console.log("Saved to Database:", newMessage);

    // Success response pathano (Status 201 Created)
    res.status(201).json({
      success: true,
      message: "Message sent successfully!",
      data: newMessage,
    });
  } catch (error) {
    // Kono server error hole 500 status code pathano
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Sob message database theke niye asar function (GET request)
export const getHelpMessages = async (req, res) => {
  try {
    // Database theke sob message latest to oldest vabe sort kore niye asa
    const messages = await HelpMessage.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};