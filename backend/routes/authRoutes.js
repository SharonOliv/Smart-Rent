import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

const signToken = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

const publicUser = (user) => ({
  id: user._id,
  username: user.username,
  name: user.name,
  email: user.email,
  phone: user.phone,
  profilePicture: user.profilePicture,
  role: user.role,
  petCertified: user.petCertified,
  personality: user.personality,
});

// POST /api/auth/signup
router.post("/signup", async (req, res) => {
  try {
    const { username, password, name, email, phone, role } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    const existing = await User.findOne({ username: username.trim() });
    if (existing) {
      return res.status(409).json({ message: "Username already taken." });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      username: username.trim(),
      password: hashed,
      name: name || "",
      email: email || "",
      phone: phone || "",
      role: role === "Owner" ? "Owner" : "Tenant",
    });

    const token = signToken(user);
    res.status(201).json({ token, user: publicUser(user) });
  } catch (err) {
    res.status(500).json({ message: "Signup failed.", error: err.message });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
    }

    const user = await User.findOne({ username: username.trim() });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

    const token = signToken(user);
    res.json({ token, user: publicUser(user) });
  } catch (err) {
    res.status(500).json({ message: "Login failed.", error: err.message });
  }
});

// GET /api/auth/me
router.get("/me", requireAuth, async (req, res) => {
  res.json({ user: publicUser(req.user) });
});

// POST /api/auth/forgot-password
// No email service is configured, so for local/dev use we return the reset
// token directly in the response (and log it) instead of emailing it.
// In production, swap the response for an actual email send and stop
// returning the token to the client.
router.post("/forgot-password", async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ message: "Username is required." });
    }

    const user = await User.findOne({ username: username.trim() });
    const genericResponse = {
      message: "If that account exists, a reset token has been generated.",
    };

    if (!user) {
      return res.json(genericResponse);
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

    user.resetPasswordTokenHash = tokenHash;
    user.resetPasswordExpires = new Date(Date.now() + 30 * 60 * 1000); // 30 min
    await user.save();

    console.log(`[password reset] token for ${user.username}: ${rawToken}`);

    res.json({
      ...genericResponse,
      devResetToken: rawToken, // DEV ONLY: remove once a real email sender is wired up
    });
  } catch (err) {
    res.status(500).json({ message: "Could not process request.", error: err.message });
  }
});

// POST /api/auth/reset-password
router.post("/reset-password", async (req, res) => {
  try {
    const { username, token, newPassword } = req.body;
    if (!username || !token || !newPassword) {
      return res.status(400).json({ message: "Username, token and new password are required." });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      username: username.trim(),
      resetPasswordTokenHash: tokenHash,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ message: "Reset token is invalid or has expired." });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordTokenHash = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.json({ message: "Password has been reset. You can now log in." });
  } catch (err) {
    res.status(500).json({ message: "Could not reset password.", error: err.message });
  }
});

export default router;
