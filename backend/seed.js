// Seeds the database with demo users and properties so the app has data to
// show right away. Safe to re-run: it clears existing demo records first.
//
// Usage: cd backend && npm run seed
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.js";
import Property from "./models/Property.js";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/smartrent";

const demoUsers = [
  { username: "sharon", password: "sharon123", name: "Sharon D'Souza", email: "sharon@example.com", phone: "9876543210", role: "Owner", petCertified: true, personality: "ISTJ" },
  { username: "kushala", password: "kushala123", name: "Kushala Reddy", email: "kushala@example.com", phone: "8765432109", role: "Tenant", petCertified: false, personality: "ENFJ" },
  { username: "yasaswini", password: "yasaswini123", name: "Yasaswini Rao", email: "yasaswini@example.com", phone: "7654321098", role: "Owner", petCertified: true, personality: "INFP" },
  { username: "soumika", password: "soumika123", name: "Soumika Ghosh", email: "soumika@example.com", phone: "6543210987", role: "Tenant", petCertified: false, personality: "ESTJ" },
];

const demoProperties = [
  { title: "Sunlit 2BHK near Downtown", location: "Downtown, Vijayawada", price: 1400, bedrooms: 2, bathrooms: 1, description: "A cozy 2-bedroom apartment close to all amenities, with a balcony that catches the morning sun.", crimeRate: "Low", accessibilityScore: "High" },
  { title: "Quiet Suburban Condo", location: "Suburbs, Vijayawada", price: 1100, bedrooms: 1, bathrooms: 1, description: "A modern 1-bedroom condo in a peaceful neighborhood, walking distance to a park.", crimeRate: "Low", accessibilityScore: "Medium" },
  { title: "Apsara Mansion", location: "Shivaji Nagar, Vijayawada", price: 800, bedrooms: 2, bathrooms: 1, description: "Spacious family home with a private garden and dedicated parking.", crimeRate: "Medium", accessibilityScore: "Medium" },
  { title: "Anupuruna Apartments", location: "Balaji Nagar, Hyderabad", price: 550, bedrooms: 1, bathrooms: 1, description: "Compact and affordable, great for a single tenant starting out.", crimeRate: "Low", accessibilityScore: "High" },
  { title: "Hilltop View Villa", location: "Banjara Hills, Hyderabad", price: 2400, bedrooms: 3, bathrooms: 2, description: "A roomy villa with a rooftop terrace and skyline views, perfect for sharing.", crimeRate: "Low", accessibilityScore: "Medium" },
  { title: "Riverside Studio", location: "Bhavani Island Rd, Vijayawada", price: 650, bedrooms: 1, bathrooms: 1, description: "A bright studio steps from the riverside walk, ideal for a single professional.", crimeRate: "Low", accessibilityScore: "High" },
];

const run = async () => {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB for seeding...");

  await User.deleteMany({ username: { $in: demoUsers.map((u) => u.username) } });
  const createdUsers = [];
  for (const u of demoUsers) {
    const hashed = await bcrypt.hash(u.password, 10);
    const user = await User.create({ ...u, password: hashed });
    createdUsers.push(user);
  }

  await Property.deleteMany({ title: { $in: demoProperties.map((p) => p.title) } });
  const owners = createdUsers.filter((u) => u.role === "Owner");
  for (let i = 0; i < demoProperties.length; i++) {
    const owner = owners[i % owners.length];
    await Property.create({ ...demoProperties[i], owner: owner._id, images: [] });
  }

  console.log(`Created ${createdUsers.length} demo users and ${demoProperties.length} demo properties.`);
  console.log("\nDemo login credentials:");
  demoUsers.forEach((u) => console.log(`  ${u.username} / ${u.password}`));

  await mongoose.disconnect();
  console.log("\nSeeding complete.");
};

run().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
