import mongoose from "mongoose";

const providerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    tags: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Provider", providerSchema);