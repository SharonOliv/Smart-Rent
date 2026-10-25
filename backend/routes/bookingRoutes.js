import express from "express";
import mongoose from "mongoose";
import Booking from "../models/Booking.js";
import Property from "../models/Property.js";
import { requireAuth} from "../middleware/auth.js";

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
    if (String(property.owner) === String(req.user._id)) {
      return res.status(400).json({ message: "You can't book your own property." });
    }
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

// GET /api/bookings/mine  - bookings I made as a tenant (includes the owner's contact)
router.get("/mine", requireAuth, async (req, res) => {
  try {
    const bookings = await Booking.find({ tenant: req.user._id })
      .populate({ path: "property", populate: { path: "owner", select: "name username phone email" } })
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Could not fetch bookings.", error: err.message });
  }
});

// GET /api/bookings/received  - bookings on properties I own
router.get("/received", requireAuth, async (req, res) => {
  try {
    const mine = await Property.find({ owner: req.user._id }).select("_id");
    const bookings = await Booking.find({ property: { $in: mine.map((p) => p._id) } })
      .populate("property", "title location price images")
      .populate("tenant", "name username email phone")
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

// PUT /api/bookings/:id/cancel  - the tenant, or the owner of that property
router.put("/:id/cancel", requireAuth, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: "Booking not found." });
    }
    const booking = await Booking.findById(req.params.id).populate("property", "owner");
    if (!booking) return res.status(404).json({ message: "Booking not found." });

    const isTenant = String(booking.tenant) === String(req.user._id);
    const isOwner = booking.property && String(booking.property.owner) === String(req.user._id);
    if (!isTenant && !isOwner) {
      return res.status(403).json({ message: "You can only cancel your own bookings or bookings on your listings." });
    }
    if (booking.status === "cancelled") {
      return res.status(400).json({ message: "This booking is already cancelled." });
    }

    booking.status = "cancelled";
    await booking.save();
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: "Could not cancel booking.", error: err.message });
  }
});

export default router;