import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PawPrint, Home } from "lucide-react";
import { fetchMatches, sendConnectionRequest, respondToRequest } from "../utils/api";
import { Alert, Badge } from "../components/ui/Feedback";
import Button from "../components/ui/Button";

const MatchesPage = () => {
  const [matches, setMatches] = useState([]);
  const [yourPersonality, setYourPersonality] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null); // { kind, text }
  const [busyId, setBusyId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMatches()
      .then((data) => {
        setMatches(data.matches || []);
        setYourPersonality(data.yourPersonality || "");
      })
      .catch((err) => setError(err.response?.data?.message || "Could not load matches."))
      .finally(() => setLoading(false));
  }, []);

  const setConnection = (id, connection) =>
    setMatches((prev) => prev.map((m) => (m.id === id ? { ...m, connection } : m)));

  const handleConnect = async (m) => {
    setBusyId(m.id);
    setToast(null);
    try {
      const data = await sendConnectionRequest(m.id);
      setConnection(m.id, { status: data.status, requestId: data.requestId });
      setToast({
        kind: "success",
        text: data.status === "connected" ? `You're now connected with ${m.name}.` : `Request sent to ${m.name}.`,
      });
    } catch (err) {
      setToast({ kind: "error", text: err.response?.data?.message || "Could not send request." });
    } finally {
      setBusyId(null);
    }
  };

  const handleRespond = async (m, action) => {
    setBusyId(m.id);
    setToast(null);
    try {
      await respondToRequest(m.connection.requestId, action);
      setConnection(m.id, {
        status: action === "accept" ? "connected" : "none",
        requestId: m.connection.requestId,
      });
      if (action === "accept") setToast({ kind: "success", text: `You're now connected with ${m.name}.` });
    } catch (err) {
      setToast({ kind: "error", text: err.response?.data?.message || "Could not update the request." });
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Home size={40} className="animate-pulse text-blueprint" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-md px-5 py-20 text-center">
        <Alert kind="warning">{error}</Alert>
        <Button variant="primary" className="mt-5" onClick={() => navigate("/personality-form")}>
          Take the personality quiz
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8">
      <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-soft">Roommate matching</span>
      <h1 className="mt-1 font-display text-4xl font-semibold text-ink">Your matches</h1>
      {yourPersonality && (
        <p className="mt-2 text-ink-soft">
          Matching against your type: <Badge tone="brass">{yourPersonality}</Badge>
        </p>
      )}

      {toast && <div className="mt-6"><Alert kind={toast.kind}>{toast.text}</Alert></div>}

      {matches.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-dashed border-ink/20 p-10 text-center text-ink-soft">
          <Home size={36} className="mx-auto text-ink/20" />
          <p className="mt-3">No other users have taken the personality quiz yet &mdash; check back soon.</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {matches.map((m) => {
            const busy = busyId === m.id;
            const status = m.connection?.status || "none";
            return (
              <div key={m.id} className="rounded-2xl border border-ink/10 bg-paper p-5">
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-ink font-display text-lg text-paper">
                    {m.name.charAt(0).toUpperCase()}
                  </div>
                  <Badge tone={m.score >= 75 ? "moss" : m.score >= 50 ? "brass" : "neutral"}>
                    {m.score}% match
                  </Badge>
                </div>
                <h3 className="mt-3 font-display text-lg font-semibold text-ink">{m.name}</h3>
                <p className="text-sm text-ink-soft">{m.personality}</p>
                {m.petCertified && (
                  <p className="mt-1 flex items-center gap-1 text-xs text-moss">
                    <PawPrint size={13} /> Pet certified
                  </p>
                )}

                {status === "connected" ? (
                  <p className="mt-4 text-center text-sm font-medium text-moss">
                    ✓ Connected &mdash; contact details are on your profile
                  </p>
                ) : status === "sent" ? (
                  <Button variant="outline" size="sm" className="mt-4 w-full" disabled>
                    Request sent
                  </Button>
                ) : status === "received" ? (
                  <div className="mt-4 flex gap-2">
                    <Button variant="primary" size="sm" className="flex-1" disabled={busy} onClick={() => handleRespond(m, "accept")}>
                      Accept
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1" disabled={busy} onClick={() => handleRespond(m, "decline")}>
                      Decline
                    </Button>
                  </div>
                ) : (
                  <Button variant="outline" size="sm" className="mt-4 w-full" disabled={busy} onClick={() => handleConnect(m)}>
                    {busy ? "Sending..." : "Connect"}
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MatchesPage;