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
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  password: {
    type: String,
    required: true,
  },
  
  // This is your previous profile/designation field (Keep it as it is)
  role: {
    type: String,
    default: "SheRise Community Member",
  },
  
  // ==========================================
  // ADMIN & ACCESS CONTROL SECTION (FOR VIVA)
  // This field handles system-level roles (e.g., 'admin' or 'user').
  // By default, every new signup gets 'user' role for security.
  // To make someone an admin, change this manually in the database to 'admin'.
  // ==========================================
  systemRole: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },

  bio: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// safe model export
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;