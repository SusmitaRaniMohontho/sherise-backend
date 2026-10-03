import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "my_super_secret_jwt_key_12345";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      error:
        "Access denied. Please log in first to book an appointment.",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({
      error:
        "Session expired or invalid token. Please log in again.",
    });
  }
};