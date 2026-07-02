import { useEffect, useState } from "react";
import { CalendarRange } from "lucide-react";
import { fetchMyBookings, cancelBooking } from "../utils/api";
import { Alert, Badge } from "../components/ui/Feedback";
import Button from "../components/ui/Button";
import PinMark from "../components/ui/PinMark";

const formatDate = (d) => new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      setBookings(await fetchMyBookings());
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Could not load bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCancel = async (id) => {
    try {
      await cancelBooking(id);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not cancel booking.");
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-5 py-12 sm:px-0">
      <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-brass">Your trips</span>
      <h1 className="mt-1 font-display text-4xl font-semibold text-ink">My bookings</h1>

      {error && <div className="mt-6"><Alert kind="error">{error}</Alert></div>}

      {loading ? (
        <div className="mt-16 flex justify-center"><PinMark className="h-10 w-10 animate-pulse" strokeColor="#C2873E" /></div>
      ) : bookings.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-dashed border-ink/20 p-10 text-center text-ink-soft">
          <CalendarRange className="mx-auto h-8 w-8 text-ink/25" />
          <p className="mt-3">No bookings yet. Head to the Rent page to find a place.</p>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {bookings.map((b) => (
            <div key={b._id} className="flex flex-col gap-3 rounded-2xl border border-ink/10 bg-paper p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-display text-lg font-semibold text-ink">{b.property?.title || "Listing removed"}</h3>
                <p className="text-sm text-ink-soft">{b.property?.location}</p>
                <p className="mt-1 font-mono text-xs text-ink-soft">
                  {formatDate(b.startDate)} &rarr; {formatDate(b.endDate)} &middot; ${b.totalPrice} total
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge tone={b.status === "cancelled" ? "neutral" : "moss"}>{b.status}</Badge>
                {b.status === "confirmed" && (
                  <Button variant="danger" size="sm" onClick={() => handleCancel(b._id)}>Cancel</Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
