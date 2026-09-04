import mongoose from "mongoose";

const loanSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    contact: { type: String, required: true },
    amount: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Loan", loanSchema);