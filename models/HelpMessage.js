import mongoose from "mongoose";

// 1. Help message er data structure ba Schema define kora holo
const helpMessageSchema = new mongoose.Schema({
  name: { type: String, required: true },      // User er name (Required)
  email: { type: String, required: true },     // User er email (Required)
  message: { type: String, required: true },   // User er message (Required)
  createdAt: { type: Date, default: Date.now } // Message pathanor auto timestamp
});

// 2. Schema theke Mongoose Model create kora holo (Database collection er jonno)
const HelpMessage = mongoose.model("HelpMessage", helpMessageSchema);

// Model ti controllers e use korar jonno export kora holo
export default HelpMessage;