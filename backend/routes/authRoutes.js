import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";
import { sendVerificationEmail } from "../utils/mailer.js";

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
  isVerified: user.isVerified,
});

const makeToken = () => {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
  return { rawToken, tokenHash };
};

// POST /api/auth/signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ message: "An account with that email already exists." });
    }

    const hashed = await bcrypt.hash(password, 10);
    const { rawToken, tokenHash } = makeToken();

    const user = await User.create({
      username: normalizedEmail, // email doubles as the login identifier
      password: hashed,
      name: name || "",
      email: normalizedEmail,
      isVerified: false,
      verificationTokenHash: tokenHash,
      verificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h
    });

    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email/${rawToken}`;

    try {
      await sendVerificationEmail(normalizedEmail, verifyUrl);
    } catch (mailErr) {
      // Don't leave an unverifiable account behind if the email never sent
      await User.deleteOne({ _id: user._id });
      console.error("Failed to send verification email:", mailErr.message);
      return res.status(502).json({ message: "Could not send confirmation email. Please try again." });
    }

    res.status(201).json({
      message: "Account created. Check your email to confirm your address before logging in.",
    });
  } catch (err) {
    res.status(500).json({ message: "Signup failed.", error: err.message });
  }
});

// GET /api/auth/verify-email/:token
router.get("/verify-email/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({ verificationTokenHash: tokenHash });

    if (!user) {
      return res.status(400).json({ message: "Verification link is invalid or has expired." });
    }

    if (!user.isVerified) {
      if (user.verificationExpires < new Date()) {
        return res.status(400).json({ message: "Verification link is invalid or has expired." });
      }
      user.isVerified = true;
      await user.save();
    }
    // If already verified (e.g. an email scanner or a duplicate click consumed
    // it first), fall through and log them in anyway instead of erroring.

    const jwtToken = signToken(user);
    res.json({ token: jwtToken, user: publicUser(user) });
  } catch (err) {
    res.status(500).json({ message: "Could not verify email.", error: err.message });
  }
});

// POST /api/auth/resend-verification
router.post("/resend-verification", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    const genericResponse = {
      message: "If that account exists and isn't verified yet, a new confirmation email has been sent.",
    };

    if (!user || user.isVerified) {
      return res.json(genericResponse);
    }

    const { rawToken, tokenHash } = makeToken();
    user.verificationTokenHash = tokenHash;
    user.verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save();

    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email/${rawToken}`;
    await sendVerificationEmail(normalizedEmail, verifyUrl);

    res.json(genericResponse);
  } catch (err) {
    res.status(500).json({ message: "Could not resend verification email.", error: err.message });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
    }

    const user = await User.findOne({ username: username.trim().toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message: "Please verify your email before logging in.",
        unverified: true,
      });
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

    const { rawToken, tokenHash } = makeToken();
    user.resetPasswordTokenHash = tokenHash;
    user.resetPasswordExpires = new Date(Date.now() + 30 * 60 * 1000); // 30 min
    await user.save();

    console.log(`[password reset] token for ${user.username}: ${rawToken}`);

    res.json({
      ...genericResponse,
      devResetToken: rawToken, // DEV ONLY: remove once wired to sendVerificationEmail-style delivery
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