import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PawPrint } from "lucide-react";
import { fetchMatches } from "../utils/api";
import { Alert, Badge } from "../components/ui/Feedback";
import Button from "../components/ui/Button";
import PinMark from "../components/ui/PinMark";

const MatchesPage = () => {
  const [matches, setMatches] = useState([]);
  const [yourPersonality, setYourPersonality] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <PinMark className="h-10 w-10 animate-pulse" strokeColor="#C2873E" />
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
      <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-brass">Roommate matching</span>
      <h1 className="mt-1 font-display text-4xl font-semibold text-ink">Your matches</h1>
      {yourPersonality && (
        <p className="mt-2 text-ink-soft">
          Matching against your type: <Badge tone="brass">{yourPersonality}</Badge>
        </p>
      )}

      {matches.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-dashed border-ink/20 p-10 text-center text-ink-soft">
          <PinMark className="mx-auto h-9 w-9 text-ink/20" />
          <p className="mt-3">No other users have taken the personality quiz yet &mdash; check back soon.</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {matches.map((m) => (
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
              <p className="text-sm text-ink-soft">{m.personality} &middot; {m.role}</p>
              {m.petCertified && (
                <p className="mt-1 flex items-center gap-1 text-xs text-moss">
                  <PawPrint size={13} /> Pet certified
                </p>
              )}
              <Button variant="outline" size="sm" className="mt-4 w-full" onClick={() => alert(`Request sent to ${m.name}`)}>
                Connect
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MatchesPage;
