import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Check, X, Phone, Mail } from "lucide-react";
import { fetchIncomingRequests, fetchConnections, respondToRequest } from "../utils/api";
import { Alert, Badge } from "./ui/Feedback";
import Button from "./ui/Button";

const ConnectionRequests = () => {
  const [requests, setRequests] = useState([]);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  const load = async () => {
    try {
      const [incoming, accepted] = await Promise.all([fetchIncomingRequests(), fetchConnections()]);
      setRequests(incoming.requests || []);
      setConnections(accepted.connections || []);
    } catch {
      setError("Could not load your connections.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const respond = async (id, action) => {
    setBusyId(id);
    setError("");
    try {
      await respondToRequest(id, action);
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not update the request.");
    } finally {
      setBusyId(null);
    }
  };

  if (loading) return null;

  return (
    <div className="mt-8 rounded-2xl border border-ink/10 bg-paper p-7 shadow-sm">
      <div className="flex items-center gap-2">
        <h2 className="font-display text-xl font-semibold text-ink">Roommate connections</h2>
        {requests.length > 0 && <Badge tone="brass">{requests.length} new</Badge>}
      </div>

      {error && <div className="mt-4"><Alert kind="error">{error}</Alert></div>}

      {requests.length === 0 && connections.length === 0 && (
        <p className="mt-3 text-sm text-ink-soft">
          No requests yet. <Link to="/matches" className="text-ink underline">Find roommate matches</Link>
        </p>
      )}

      {requests.length > 0 && (
        <ul className="mt-4 space-y-3">
          {requests.map((r) => (
            <li key={r.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-ink/10 p-3">
              <div>
                <p className="font-semibold text-ink">{r.from.name}</p>
                <p className="text-sm text-ink-soft">{r.from.personality}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="primary" disabled={busyId === r.id} onClick={() => respond(r.id, "accept")}>
                  <Check size={14} /> Accept
                </Button>
                <Button size="sm" variant="outline" disabled={busyId === r.id} onClick={() => respond(r.id, "decline")}>
                  <X size={14} /> Decline
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {connections.length > 0 && (
        <>
          <h3 className="mt-6 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-soft">Connected</h3>
          <ul className="mt-3 space-y-3">
            {connections.map((c) => (
              <li key={c.id} className="rounded-xl border border-ink/10 p-3">
                <p className="font-semibold text-ink">
                  {c.user.name} <span className="text-sm font-normal text-ink-soft">&middot; {c.user.personality}</span>
                </p>
                <div className="mt-1 flex flex-wrap gap-x-5 gap-y-1 text-sm text-ink-soft">
                  {c.user.phone && (
                    <a href={`tel:+91${c.user.phone}`} className="flex items-center gap-1.5 hover:text-ink">
                      <Phone size={13} /> +91 {c.user.phone}
                    </a>
                  )}
                  {c.user.email && (
                    <a href={`mailto:${c.user.email}`} className="flex items-center gap-1.5 hover:text-ink">
                      <Mail size={13} /> {c.user.email}
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default ConnectionRequests;