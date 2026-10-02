import mongoose from "mongoose";

const loanSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    amount: { type: String, required: true },
    
    // 👈 THIS FIELD IS REQUIRED FOR THE ADMIN DASHBOARD
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Loan = mongoose.models.Loan || mongoose.model("Loan", loanSchema);
export default Loan;