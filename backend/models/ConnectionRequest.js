import mongoose from "mongoose";

const connectionRequestSchema = new mongoose.Schema(
  {
    from: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    to: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["pending", "accepted", "declined"], default: "pending" },
  },
  { timestamps: true }
);

connectionRequestSchema.index({ from: 1, to: 1 }, { unique: true });

export default mongoose.model("ConnectionRequest", connectionRequestSchema);