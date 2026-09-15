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
  // 🔴 এই 'role' ফিল্ডটি এখানে মিসিং ছিল, তাই এটি নতুন করে যুক্ত করা হলো
  role: {
    type: String,
    default: "SheRise Community Member",
  },
  // প্রোফাইল পেজ সমৃদ্ধ করার জন্য বায়ো ফিল্ড
  bio: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// সেফ মডেল এক্সপোর্ট
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;