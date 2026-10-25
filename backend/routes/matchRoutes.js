import express from "express";
import User from "../models/User.js";
import ConnectionRequest from "../models/ConnectionRequest.js";
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
      // role: "Tenant",
      personality: { $nin: [null, ""] },
    }).select("username name personality petCertified role");

    // How I'm connected to each person: none | sent | received | connected
    const requests = await ConnectionRequest.find({
      $or: [{ from: req.user._id }, { to: req.user._id }],
    });
    const byOther = new Map();
    for (const r of requests) {
      const iSent = String(r.from) === String(req.user._id);
      const other = String(iSent ? r.to : r.from);
      let status;
      if (r.status === "accepted") status = "connected";
      else if (r.status === "pending") status = iSent ? "sent" : "received";
      else status = iSent ? "sent" : "none"; // declined: the sender isn't told, the decliner can still connect
      byOther.set(other, { status, requestId: String(r._id) });
    }

    const matches = others
      .map((u) => ({
        id: u._id,
        username: u.username,
        name: u.name || u.username,
        personality: u.personality,
        petCertified: u.petCertified,
        role: u.role,
        score: compatibilityScore(req.user.personality, u.personality),
        connection: byOther.get(String(u._id)) || { status: "none" },
      }))
      .sort((a, b) => b.score - a.score);

    res.json({ yourPersonality: req.user.personality, matches });
  } catch (err) {
    res.status(500).json({ message: "Could not compute matches.", error: err.message });
  }
});

export default router;