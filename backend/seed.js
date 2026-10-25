import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import Property from "./models/Property.js";
import Booking from "./models/Booking.js";
import ConnectionRequest from "./models/ConnectionRequest.js";

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB");

  const seedEmails = ["owner1@gmail.com", "owner2@gmail.com", "tenant1@gmail.com", "tenant2@gmail.com"];
  const existingUsers = await User.find({ email: { $in: seedEmails } });
  const existingIds = existingUsers.map((u) => u._id);

  await Booking.deleteMany({ tenant: { $in: existingIds } });
  await Property.deleteMany({ owner: { $in: existingIds } });
  await ConnectionRequest.deleteMany({
    $or: [{ from: { $in: existingIds } }, { to: { $in: existingIds } }],
  });
  await User.deleteMany({ email: { $in: seedEmails } });

  const hashedPassword = await bcrypt.hash("Password123", 10);

  const owner1 = await User.create({
    username: "owner1@gmail.com",
    email: "owner1@gmail.com",
    password: hashedPassword,
    name: "Ravi Kumar",
    phone: "9876543210",
    role: "Owner",
    isVerified: true,
  });

  const owner2 = await User.create({
    username: "owner2@gmail.com",
    email: "owner2@gmail.com",
    password: hashedPassword,
    name: "Meera Nair",
    phone: "9876500000",
    role: "Owner",
    isVerified: true,
  });

  const tenant1 = await User.create({
    username: "tenant1@gmail.com",
    email: "tenant1@gmail.com",
    password: hashedPassword,
    name: "Arjun Reddy",
    phone: "9123456789",
    role: "Tenant",
    isVerified: true,
    personality: "INFP",
    petCertified: true,
  });

  const tenant2 = await User.create({
    username: "tenant2@gmail.com",
    email: "tenant2@gmail.com",
    password: hashedPassword,
    name: "Priya Sharma",
    phone: "9123400000",
    role: "Tenant",
    isVerified: true,
    personality: "ESTJ",
    petCertified: false,
  });

  await ConnectionRequest.create({ from: tenant2._id, to: tenant1._id }); // Priya -> Arjun, pending

  const properties = await Property.insertMany([
    {
      title: "Cozy 2BHK near Benz Circle",
      description: "A well-lit 2-bedroom apartment close to shopping and transport, ideal for students or young professionals.",
      price: 15000,
      location: "Benz Circle, Vijayawada",
      bedrooms: 2,
      bathrooms: 2,
      crimeRate: "Low",
      accessibilityScore: "High",
      available: true,
      images: ["/uploads/sample-house-1.png", "/uploads/sample-house-2.png"],
      owner: owner1._id,
    },
    {
      title: "Spacious 3BHK Villa with Garden",
      description: "Independent villa with a private garden and covered parking, quiet residential neighborhood.",
      price: 28000,
      location: "Gollapudi, Vijayawada",
      bedrooms: 3,
      bathrooms: 3,
      crimeRate: "Low",
      accessibilityScore: "Medium",
      available: true,
      images: ["/uploads/sample-house-3.png"],
      owner: owner1._id,
    },
    {
      title: "Studio Apartment for Singles",
      description: "Compact studio, fully furnished, walking distance to SRM University AP.",
      price: 8000,
      location: "Neerukonda, Vijayawada",
      bedrooms: 1,
      bathrooms: 1,
      crimeRate: "Moderate",
      accessibilityScore: "High",
      available: true,
      images: ["/uploads/sample-house-4.png"],
      owner: owner2._id,
    },
    {
      title: "Modern 1BHK with Balcony",
      description: "Newly built apartment complex with gym and 24/7 security, great for working professionals.",
      price: 12000,
      location: "Governorpet, Vijayawada",
      bedrooms: 1,
      bathrooms: 1,
      crimeRate: "Low",
      accessibilityScore: "High",
      available: true,
      images: ["/uploads/sample-house-5.png"],
      owner: owner2._id,
    },
    {
      title: "Shared PG-style 2BHK",
      description: "Ideal for roommates, shared living space with common kitchen, close to bus stand.",
      price: 6000,
      location: "MG Road, Vijayawada",
      bedrooms: 2,
      bathrooms: 1,
      crimeRate: "Moderate",
      accessibilityScore: "Medium",
      available: false,
      images: ["/uploads/sample-house-6.png"],
      owner: owner1._id,
    },
  ]);

  await Booking.insertMany([
    {
      property: properties[4]._id,
      tenant: tenant1._id,
      startDate: new Date("2026-10-01"),
      endDate: new Date("2026-12-31"),
      totalPrice: 18000,
      status: "confirmed",
    },
    {
      property: properties[0]._id,
      tenant: tenant2._id,
      startDate: new Date("2026-11-01"),
      endDate: new Date("2026-11-10"),
      totalPrice: 5000,
      status: "pending",
    },
  ]);

  console.log("Seed complete:");
  console.log("- 4 users (2 owners, 2 tenants) — password for all: Password123");
  console.log(`- ${properties.length} properties (1 marked unavailable)`);
  console.log("- 2 bookings (1 confirmed, 1 pending)");

  await mongoose.disconnect();
};

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});