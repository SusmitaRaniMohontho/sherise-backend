import mongoose from "mongoose";

const jobApplicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    jobTitle: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    email: { type: String, required: true },
    qualification: { type: String, required: true },
    skills: { type: String, required: true },
    amount: { type: String, required: true }, // Expected Salary
  },
  { timestamps: true }
);

export default mongoose.model("JobApplication", jobApplicationSchema);