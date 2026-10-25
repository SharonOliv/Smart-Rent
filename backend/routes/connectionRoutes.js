import express from "express";
import mongoose from "mongoose";
import ConnectionRequest from "../models/ConnectionRequest.js";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();
const BRIEF = "name username personality role petCertified";

// POST /api/connections  { toUserId }
router.post("/", requireAuth, async (req, res) => {
  try {
    const { toUserId } = req.body;
    const me = req.user._id;

    if (!mongoose.isValidObjectId(toUserId)) {
      return res.status(400).json({ message: "Invalid user." });
    }
    if (String(toUserId) === String(me)) {
      return res.status(400).json({ message: "You can't connect with yourself." });
    }
    const target = await User.findById(toUserId).select("name username");
    if (!target) return res.status(404).json({ message: "User not found." });

    const existing = await ConnectionRequest.findOne({
      $or: [{ from: me, to: toUserId }, { from: toUserId, to: me }],
    });

    if (existing) {
      const iSent = String(existing.from) === String(me);
      if (existing.status === "accepted") {
        return res.status(409).json({ message: "You're already connected." });
      }
      if (existing.status === "pending") {
        if (iSent) return res.status(409).json({ message: "Request already sent." });
        // They already asked me, so connecting back simply accepts it
        existing.status = "accepted";
        await existing.save();
        return res.json({ status: "connected", requestId: existing._id });
      }
      // declined
      if (iSent) return res.status(409).json({ message: "Request already sent." }); // sender isn't told
      existing.from = me; // I declined them earlier but now want to connect
      existing.to = toUserId;
      existing.status = "pending";
      await existing.save();
      return res.status(201).json({ status: "sent", requestId: existing._id });
    }

    const created = await ConnectionRequest.create({ from: me, to: toUserId });
    res.status(201).json({ status: "sent", requestId: created._id });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: "Request already sent." });
    res.status(500).json({ message: "Could not send request.", error: err.message });
  }
});

// GET /api/connections/incoming  - pending requests sent to me
router.get("/incoming", requireAuth, async (req, res) => {
  try {
    const items = await ConnectionRequest.find({ to: req.user._id, status: "pending" })
      .sort({ createdAt: -1 })
      .populate("from", BRIEF);
    res.json({
      requests: items
        .filter((r) => r.from)
        .map((r) => ({
          id: r._id,
          createdAt: r.createdAt,
          from: {
            id: r.from._id,
            name: r.from.name || r.from.username,
            personality: r.from.personality,
            role: r.from.role,
          },
        })),
    });
  } catch (err) {
    res.status(500).json({ message: "Could not load requests.", error: err.message });
  }
});

// GET /api/connections/accepted  - my connections, with contact details (only revealed after accepting)
router.get("/accepted", requireAuth, async (req, res) => {
  try {
    const me = String(req.user._id);
    const items = await ConnectionRequest.find({
      status: "accepted",
      $or: [{ from: req.user._id }, { to: req.user._id }],
    })
      .sort({ updatedAt: -1 })
      .populate("from", `${BRIEF} phone email`)
      .populate("to", `${BRIEF} phone email`);

    const connections = items
      .map((r) => {
        const other = String(r.from?._id) === me ? r.to : r.from;
        if (!other) return null;
        return {
          id: r._id,
          user: {
            id: other._id,
            name: other.name || other.username,
            personality: other.personality,
            role: other.role,
            phone: other.phone,
            email: other.email,
          },
        };
      })
      .filter(Boolean);

    res.json({ connections });
  } catch (err) {
    res.status(500).json({ message: "Could not load connections.", error: err.message });
  }
});

// PUT /api/connections/:id  { action: "accept" | "decline" }  - only the receiver can respond
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const { action } = req.body;
    if (!["accept", "decline"].includes(action)) {
      return res.status(400).json({ message: "action must be 'accept' or 'decline'." });
    }
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid request id." });
    }

    const request = await ConnectionRequest.findById(req.params.id);
    if (!request || String(request.to) !== String(req.user._id)) {
      return res.status(404).json({ message: "Request not found." });
    }
    if (request.status !== "pending") {
      return res.status(409).json({ message: "This request was already handled." });
    }

    request.status = action === "accept" ? "accepted" : "declined";
    await request.save();
    res.json({ id: request._id, status: request.status });
  } catch (err) {
    res.status(500).json({ message: "Could not update request.", error: err.message });
  }
});

export default router;