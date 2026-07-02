import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    location: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    bedrooms: { type: Number, default: 1 },
    bathrooms: { type: Number, default: 1 },
    images: [{ type: String }], // file paths under /uploads, served statically
    available: { type: Boolean, default: true },
    crimeRate: { type: String, default: "N/A" },
    accessibilityScore: { type: String, default: "N/A" },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Property", propertySchema);
