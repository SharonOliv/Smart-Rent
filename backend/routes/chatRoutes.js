import express from "express";
import OpenAI from "openai";
import { optionalAuth } from "../middleware/auth.js";

const router = express.Router();

let client = null;
const getClient = () => {
  if (!process.env.OPENAI_API_KEY) return null;
  if (!client) client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return client;
};

const SYSTEM_PROMPT = `You are the Smart Rent assistant, a helpful chatbot embedded on a house-rental
website called Smart Rent.

Smart Rent currently supports:
- Renting properties: browsing listings and booking stays (via the Browse/Rent page)
- Roommate matching: a personality-based compatibility feature for finding compatible roommates
- User accounts for both Tenants (renters) and Owners (people listing properties)

Smart Rent does NOT currently support:
- Buying or purchasing property outright — this is a planned feature, not yet available

If a user asks about something Smart Rent doesn't support yet (like buying a house), politely
say that feature is still being developed, and redirect them to what IS available right now —
e.g. signing up and visiting the Browse page to look at rentals instead.

Keep answers short and friendly. You do not have access to live listing data beyond what the
user tells you, so suggest they use the Rent page to browse actual listings rather than
inventing specific addresses or prices.`;

// POST /api/chat  { message, history? }
router.post("/", optionalAuth, async (req, res) => {
  try {
    const openai = getClient();
    if (!openai) {
      return res.status(503).json({
        message: "Chatbot is not configured yet. Set OPENAI_API_KEY in backend/.env.",
      });
    }

    const { message, history } = req.body;
    if (!message || typeof message !== "string") {
      return res.status(400).json({ message: "message is required." });
    }

    const safeHistory = Array.isArray(history)
      ? history
          .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
          .slice(-10)
      : [];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...safeHistory,
        { role: "user", content: message },
      ],
      max_tokens: 400,
    });

    const reply = completion.choices[0]?.message?.content?.trim() || "Sorry, I didn't catch that.";
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ message: "Chat request failed.", error: err.message });
  }
});

export default router;
