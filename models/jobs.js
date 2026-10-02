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
    
    // 👈 THIS FIELD IS REQUIRED FOR THE ADMIN DASHBOARD
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const JobApplication = mongoose.models.JobApplication || mongoose.model("JobApplication", jobApplicationSchema);
export default JobApplication;