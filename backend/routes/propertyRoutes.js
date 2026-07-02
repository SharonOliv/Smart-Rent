import express from "express";
import mongoose from "mongoose";
import Property from "../models/Property.js";
import { requireAuth } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// GET /api/properties?location=&minPrice=&maxPrice=&available=&bedrooms=
router.get("/", async (req, res) => {
  try {
    const { location, minPrice, maxPrice, available, bedrooms } = req.query;
    const filter = {};

    if (location) filter.location = { $regex: location, $options: "i" };
    if (available !== undefined) filter.available = available === "true";
    if (bedrooms) filter.bedrooms = { $gte: Number(bedrooms) };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const properties = await Property.find(filter)
      .populate("owner", "username name")
      .sort({ createdAt: -1 });

    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: "Could not fetch properties.", error: err.message });
  }
});

// GET /api/properties/mine — listings owned by the current user
router.get("/mine", requireAuth, async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: "Could not fetch your listings.", error: err.message });
  }
});

// GET /api/properties/:id
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid property id." });
    }
    const property = await Property.findById(req.params.id).populate("owner", "username name");
    if (!property) return res.status(404).json({ message: "Property not found." });
    res.json(property);
  } catch (err) {
    res.status(500).json({ message: "Could not fetch property.", error: err.message });
  }
});

// POST /api/properties  (multipart: text fields + "images" files)
router.post("/", requireAuth, upload.array("images", 8), async (req, res) => {
  try {
    const { title, description, location, price, bedrooms, bathrooms } = req.body;

    if (!title || !location || !price) {
      return res.status(400).json({ message: "title, location and price are required." });
    }

    const imagePaths = (req.files || []).map((f) => `/uploads/${f.filename}`);

    const property = await Property.create({
      title,
      description: description || "",
      location,
      price: Number(price),
      bedrooms: bedrooms ? Number(bedrooms) : 1,
      bathrooms: bathrooms ? Number(bathrooms) : 1,
      images: imagePaths,
      owner: req.user._id,
    });

    res.status(201).json(property);
  } catch (err) {
    res.status(500).json({ message: "Could not create property.", error: err.message });
  }
});

// PUT /api/properties/:id  (owner only)
router.put("/:id", requireAuth, upload.array("images", 8), async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: "Property not found." });
    if (String(property.owner) !== String(req.user._id)) {
      return res.status(403).json({ message: "You can only edit your own listings." });
    }

    const { title, description, location, price, bedrooms, bathrooms, available } = req.body;
    if (title !== undefined) property.title = title;
    if (description !== undefined) property.description = description;
    if (location !== undefined) property.location = location;
    if (price !== undefined) property.price = Number(price);
    if (bedrooms !== undefined) property.bedrooms = Number(bedrooms);
    if (bathrooms !== undefined) property.bathrooms = Number(bathrooms);
    if (available !== undefined) property.available = available === "true" || available === true;

    if (req.files && req.files.length) {
      property.images.push(...req.files.map((f) => `/uploads/${f.filename}`));
    }

    await property.save();
    res.json(property);
  } catch (err) {
    res.status(500).json({ message: "Could not update property.", error: err.message });
  }
});

// DELETE /api/properties/:id  (owner only)
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: "Property not found." });
    if (String(property.owner) !== String(req.user._id)) {
      return res.status(403).json({ message: "You can only delete your own listings." });
    }
    await property.deleteOne();
    res.json({ message: "Property deleted." });
  } catch (err) {
    res.status(500).json({ message: "Could not delete property.", error: err.message });
  }
});

export default router;
