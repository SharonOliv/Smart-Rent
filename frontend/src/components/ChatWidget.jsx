import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { MessageCircle, X, Send } from "lucide-react";
import { sendChatMessage, sendChatOption } from "../utils/api";
import PinMark from "./ui/PinMark";

// ids must match the keys in backend/routes/chatRoutes.js (OPTIONS)
const MENU_OPTIONS = [
  { id: "search_rentals", label: "Search rentals" },
  { id: "personality", label: "What is my personality?" },
  { id: "how_to_rent", label: "How do I rent?" },
  { id: "find_roommates", label: "Find roommates" },
  { id: "complaint", label: "Raise a complaint" },
  { id: "technical_issue", label: "Technical issue" },
];

const MAX_INPUT_LENGTH = 500; // keep in sync with backend

const ListingCard = ({ listing }) => (
  <div className="rounded-xl border border-ink/10 bg-paper px-3 py-2 text-xs text-ink">
    <div className="text-sm font-semibold leading-snug">{listing.title}</div>
    <div className="text-ink-soft">{listing.location}</div>
    <div className="mt-1 flex flex-wrap gap-x-3">
      <span className="font-semibold text-brass">₹{Number(listing.price).toLocaleString("en-IN")}/month</span>
      <span>{listing.bedrooms} bed</span>
      <span>{listing.bathrooms} bath</span>
    </div>
  </div>
);

ListingCard.propTypes = {
  listing: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    location: PropTypes.string,
    price: PropTypes.number,
    bedrooms: PropTypes.number,
    bathrooms: PropTypes.number,
  }).isRequired,
};

// In-app navigation button (uses react-router, so no full page reload)
const ActionLink = ({ to, children }) => (
  <Link
    to={to}
    className="rounded-full bg-brass px-3 py-1.5 text-xs font-medium text-ink transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink"
  >
    {children}
  </Link>
);

ActionLink.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node,
};

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm the Smart Rent assistant. Pick a topic below, or ask me something like \"2 bedroom under ₹15,000 in Vijayawada\".",
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open, sending]);

  const getErrorText = (err) => err.response?.data?.message || "Chat is unavailable right now.";

  // Tapping a menu option -> fixed answer from the backend
  const handleOption = async (option) => {
    if (sending) return;
    setMessages((prev) => [...prev, { role: "user", content: option.label }]);
    setError("");
    setSending(true);

    try {
      const { reply, links } = await sendChatOption(option.id);
      setMessages((prev) => [...prev, { role: "assistant", content: reply, links: links || [] }]);
    } catch (err) {
      setError(getErrorText(err));
    } finally {
      setSending(false);
    }
  };

  // Typing a free-text question -> AI answer (+ listing cards) from the backend
  const handleSend = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;

    const nextMessages = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setError("");
    setSending(true);

    try {
      // only role + content go to the server (listing cards are not sent back)
      const history = nextMessages.slice(-10).map((m) => ({ role: m.role, content: m.content }));
      const { reply, listings } = await sendChatMessage(text, history);
      const found = listings || [];
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: reply,
          listings: found,
          // cards show a summary; the Rent page is where users view and book
          links: found.length ? [{ label: "Open Rent page", to: "/rent" }] : [],
        },
      ]);
    } catch (err) {
      setError(getErrorText(err));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-[90] flex flex-col items-end">
      {open && (
        <div className="mb-3 flex h-[30rem] w-80 max-w-[85vw] flex-col overflow-hidden rounded-2xl border border-ink/10 bg-paper shadow-2xl shadow-ink/20">
          <div className="flex items-center justify-between bg-ink px-4 py-3 text-paper">
            <div className="flex items-center gap-2">
              <PinMark className="h-5 w-5" strokeColor="#F2F0E6" fillColor="#C2873E" />
              <span className="font-display text-sm font-semibold">Smart Rent Assistant</span>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close chat" className="text-paper/70 hover:text-paper">
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 space-y-2.5 overflow-y-auto p-3">
            {messages.map((m, i) => (
              <div key={i} className="space-y-1.5">
                <div
                  className={`max-w-[85%] whitespace-pre-line rounded-xl px-3 py-2 text-sm leading-snug ${
                    m.role === "user" ? "ml-auto bg-ink text-paper" : "bg-ink/6 text-ink"
                  }`}
                >
                  {m.content}
                </div>
                {m.listings?.length > 0 && (
                  <div className="space-y-1.5">
                    {m.listings.map((l) => (
                      <ListingCard key={l.id} listing={l} />
                    ))}
                  </div>
                )}
                {m.links?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {m.links.map((l) => (
                      <ActionLink key={l.to} to={l.to}>
                        {l.label}
                      </ActionLink>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {sending && (
              <div className="max-w-[85%] rounded-xl bg-ink/6 px-3 py-2 text-sm text-ink-soft" aria-live="polite">
                Typing...
              </div>
            )}

            {error && (
              <div className="mx-auto max-w-[90%] rounded-lg bg-clay/10 px-3 py-2 text-center text-xs text-clay">
                {error}
              </div>
            )}

            {/* Menu options stay available after every reply */}
            {!sending && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {MENU_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleOption(option)}
                    className="rounded-full border border-brass/60 px-3 py-1.5 text-xs text-ink transition-colors hover:bg-brass/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brass"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <form onSubmit={handleSend} className="flex border-t border-ink/10">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              maxLength={MAX_INPUT_LENGTH}
              disabled={sending}
              className="flex-1 bg-transparent px-3 py-3 text-sm text-ink outline-none placeholder:text-ink-soft/60"
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              className="flex items-center px-3 text-brass disabled:text-ink-soft/40"
              aria-label="Send"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Toggle chat"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-brass text-ink shadow-lg shadow-ink/20 transition-transform hover:scale-105"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </div>
  );
};

export default ChatWidget;