import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { sendChatMessage } from "../utils/api";
import PinMark from "./ui/PinMark";

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I'm the Smart Rent assistant. Ask me about renting, booking, or roommate matching.",
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

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
      const history = nextMessages.slice(-10).map((m) => ({ role: m.role, content: m.content }));
      const { reply } = await sendChatMessage(text, history);
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      setError(err.response?.data?.message || "Chat is unavailable right now.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-[90] flex flex-col items-end">
      {open && (
        <div className="mb-3 flex h-[26rem] w-80 max-w-[85vw] flex-col overflow-hidden rounded-2xl border border-ink/10 bg-paper shadow-2xl shadow-ink/20">
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
              <div
                key={i}
                className={`max-w-[85%] rounded-xl px-3 py-2 text-sm leading-snug ${
                  m.role === "user"
                    ? "ml-auto bg-ink text-paper"
                    : "bg-ink/6 text-ink"
                }`}
              >
                {m.content}
              </div>
            ))}
            {error && <div className="mx-auto max-w-[90%] rounded-lg bg-clay/10 px-3 py-2 text-center text-xs text-clay">{error}</div>}
            <div ref={bottomRef} />
          </div>

          <form onSubmit={handleSend} className="flex border-t border-ink/10">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
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
