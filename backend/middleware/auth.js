import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Verifies the JWT sent in the Authorization header and attaches req.user
export const requireAuth = async (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) {
      return res.status(401).json({ message: "Not authenticated. Please log in." });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User no longer exists." });
    }

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

// Like requireAuth, but doesn't fail the request if no/invalid token is present.
// Useful for endpoints (like chat) that work for guests but personalize for logged-in users.
export const optionalAuth = async (req, _res, next) => {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (token) {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(payload.id).select("-password");
      if (user) req.user = user;
    }
  } catch {
    // ignore invalid token for optional auth
  }
  next();
};
