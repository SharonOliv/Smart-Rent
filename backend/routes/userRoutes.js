import express from "express";
import { requireAuth } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

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

// Indian mobile numbers: accepts "9876543210", "+91 98765 43210", "098765 43210"; stores the bare 10 digits
const normalizePhone = (raw = "") =>
  String(raw).replace(/[\s-]/g, "").replace(/^(\+91|91|0)(?=\d{10}$)/, "");
const INDIAN_MOBILE = /^[6-9]\d{9}$/;

// GET /api/users/me
router.get("/me", requireAuth, async (req, res) => {
  res.json({ user: publicUser(req.user) });
});

// PUT /api/users/me  (multipart: text fields + optional "profilePicture" file)
router.put("/me", requireAuth, upload.single("profilePicture"), async (req, res) => {
  try {
    const { name, email, phone, petCertified } = req.body;
    const user = req.user;

    // Validate before touching the user document
    let cleanPhone;
    if (phone !== undefined) {
      cleanPhone = phone === "" ? "" : normalizePhone(phone); // "" lets the user clear their number
      if (cleanPhone !== "" && !INDIAN_MOBILE.test(cleanPhone)) {
        return res.status(400).json({ message: "Enter a valid 10-digit Indian mobile number." });
      }
    }

    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (phone !== undefined) user.phone = cleanPhone;
    // if (role !== undefined && ["Owner", "Tenant"].includes(role)) user.role = role;
    if (petCertified !== undefined) user.petCertified = petCertified === "true" || petCertified === true;
    if (req.file) user.profilePicture = `/uploads/${req.file.filename}`;

    await user.save();
    res.json({ user: publicUser(user) });
  } catch (err) {
    res.status(500).json({ message: "Could not update profile.", error: err.message });
  }
});

// PUT /api/users/me/personality  { personality: "ISTJ" }
router.put("/me/personality", requireAuth, async (req, res) => {
  try {
    const { personality } = req.body;
    if (!personality || !/^[A-Z]{4}$/i.test(personality)) {
      return res.status(400).json({ message: "personality must be a 4-letter MBTI-style code." });
    }
    req.user.personality = personality.toUpperCase();
    await req.user.save();
    res.json({ user: publicUser(req.user) });
  } catch (err) {
    res.status(500).json({ message: "Could not save personality.", error: err.message });
  }
});

export default router;
