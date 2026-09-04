import mongoose from "mongoose";

const helpMessageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const HelpMessage = mongoose.model("HelpMessage", helpMessageSchema);
export default HelpMessage;