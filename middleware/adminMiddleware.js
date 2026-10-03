import User from "../models/User.js";

export const verifyAdmin = async (req, res, next) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({
        error: "Unauthorized. Please log in.",
      });
    }

    const user = await User.findById(req.user.userId).select("systemRole");

    if (!user || user.systemRole !== "admin") {
      return res.status(403).json({
        error: "Access denied. Admin only.",
      });
    }

    next();
  } catch (err) {
    console.error("Admin verification error:", err);

    return res.status(500).json({
      error: "Server error while checking admin access.",
    });
  }
};