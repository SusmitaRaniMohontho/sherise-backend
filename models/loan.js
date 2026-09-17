import mongoose from "mongoose";

const loanSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true // Ensures every loan application is tied to a verified user token
    },
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    amount: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Loan", loanSchema);