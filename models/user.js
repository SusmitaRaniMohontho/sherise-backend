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
  
  role: {
    type: String,
    default: "SheRise Community Member",
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