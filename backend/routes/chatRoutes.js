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
website called Smart Rent. You help users browse rentals, understand how booking works,
explain the roommate personality-matching feature, and answer general questions about
renting a home. Keep answers short and friendly. You do not have access to live listing
data beyond what the user tells you, so suggest they use the Rent page to browse actual
listings rather than inventing specific addresses or prices.`;

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
