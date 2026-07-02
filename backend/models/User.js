import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true }, // hashed
    name: { type: String, default: "" },
    email: { type: String, default: "", lowercase: true, trim: true },
    phone: { type: String, default: "" },
    profilePicture: { type: String, default: "" },
    role: { type: String, enum: ["Owner", "Tenant"], default: "Tenant" },
    petCertified: { type: Boolean, default: false },
    personality: { type: String, default: "" }, // e.g. "ISTJ"
    resetPasswordTokenHash: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
