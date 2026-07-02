import express from "express";
import mongoose from "mongoose";
import Booking from "../models/Booking.js";
import Property from "../models/Property.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// POST /api/bookings  { propertyId, startDate, endDate }
router.post("/", requireAuth, async (req, res) => {
  try {
    const { propertyId, startDate, endDate } = req.body;

    if (!propertyId || !startDate || !endDate) {
      return res.status(400).json({ message: "propertyId, startDate and endDate are required." });
    }
    if (!mongoose.isValidObjectId(propertyId)) {
      return res.status(400).json({ message: "Invalid propertyId." });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start >= end) {
      return res.status(400).json({ message: "endDate must be after startDate." });
    }

    const property = await Property.findById(propertyId);
    if (!property) return res.status(404).json({ message: "Property not found." });
    if (!property.available) {
      return res.status(400).json({ message: "This property is not available for booking." });
    }

    const overlap = await Booking.findOne({
      property: propertyId,
      status: "confirmed",
      startDate: { $lt: end },
      endDate: { $gt: start },
    });
    if (overlap) {
      return res.status(409).json({ message: "Property is already booked for part of those dates." });
    }

    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const months = Math.max(1, Math.ceil(days / 30));
    const totalPrice = months * property.price;

    const booking = await Booking.create({
      property: propertyId,
      tenant: req.user._id,
      startDate: start,
      endDate: end,
      totalPrice,
      status: "confirmed",
    });

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: "Could not create booking.", error: err.message });
  }
});

// GET /api/bookings/mine
router.get("/mine", requireAuth, async (req, res) => {
  try {
    const bookings = await Booking.find({ tenant: req.user._id })
      .populate("property")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Could not fetch bookings.", error: err.message });
  }
});

// GET /api/bookings/property/:propertyId  (owner only)
router.get("/property/:propertyId", requireAuth, async (req, res) => {
  try {
    const property = await Property.findById(req.params.propertyId);
    if (!property) return res.status(404).json({ message: "Property not found." });
    if (String(property.owner) !== String(req.user._id)) {
      return res.status(403).json({ message: "You can only view bookings for your own listings." });
    }
    const bookings = await Booking.find({ property: property._id })
      .populate("tenant", "username name email phone")
      .sort({ startDate: 1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Could not fetch bookings.", error: err.message });
  }
});

// PUT /api/bookings/:id/cancel
router.put("/:id/cancel", requireAuth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found." });
    if (String(booking.tenant) !== String(req.user._id)) {
      return res.status(403).json({ message: "You can only cancel your own bookings." });
    }
    booking.status = "cancelled";
    await booking.save();
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: "Could not cancel booking.", error: err.message });
  }
});

export default router;
