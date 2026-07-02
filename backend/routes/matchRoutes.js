import express from "express";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";
import { compatibilityScore } from "../utils/personalityMatch.js";

const router = express.Router();

// GET /api/matches - roommate matches sorted by personality compatibility
router.get("/", requireAuth, async (req, res) => {
  try {
    if (!req.user.personality) {
      return res.status(400).json({
        message: "Take the personality quiz first so we can find your matches.",
      });
    }

    const others = await User.find({
      _id: { $ne: req.user._id },
      personality: { $nin: [null, ""] },
    }).select("username name personality petCertified role");

    const matches = others
      .map((u) => ({
        id: u._id,
        username: u.username,
        name: u.name || u.username,
        personality: u.personality,
        petCertified: u.petCertified,
        role: u.role,
        score: compatibilityScore(req.user.personality, u.personality),
      }))
      .sort((a, b) => b.score - a.score);

    res.json({ yourPersonality: req.user.personality, matches });
  } catch (err) {
    res.status(500).json({ message: "Could not compute matches.", error: err.message });
  }
});

export default router;
