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

// GET /api/users/me
router.get("/me", requireAuth, async (req, res) => {
  res.json({ user: publicUser(req.user) });
});

// PUT /api/users/me  (multipart: text fields + optional "profilePicture" file)
router.put("/me", requireAuth, upload.single("profilePicture"), async (req, res) => {
  try {
    const { name, email, phone, role, petCertified } = req.body;
    const user = req.user;

    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (phone !== undefined) user.phone = phone;
    if (role !== undefined && ["Owner", "Tenant"].includes(role)) user.role = role;
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
