import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  // প্রোফাইল পেজ সমৃদ্ধ করার জন্য নতুন বায়ো ফিল্ড যুক্ত করা হলো
  bio: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// 🔴 সেফ মডেল এক্সপোর্ট (যদি মডেল আগে তৈরি থাকে তবে সেটা নিবে, না থাকলে নতুন বানাবে)
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;