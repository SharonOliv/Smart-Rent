import { useEffect, useState } from "react";
import { Phone, Mail, Inbox } from "lucide-react";
import { fetchReceivedBookings, cancelBooking } from "../utils/api";
import { inr, dateIN } from "../utils/format";
import { Alert, Badge } from "../components/ui/Feedback";
import Button from "../components/ui/Button";

const tone = (s) => (s === "confirmed" ? "moss" : s === "pending" ? "brass" : "neutral");

const BookingsReceived = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setBookings(await fetchReceivedBookings());
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

  const handleCancel = async (b) => {
    const who = b.tenant?.name || b.tenant?.username || "this tenant";
    if (!window.confirm(`Cancel ${who}'s booking for ${b.property?.title}?`)) return;
    try {
      await cancelBooking(b._id);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not cancel booking.");
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-5 py-12 sm:px-0">
      <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-soft">Hosting</span>
      <h1 className="mt-1 font-display text-4xl font-semibold text-ink">Bookings received</h1>

      {error && <div className="mt-6"><Alert kind="error">{error}</Alert></div>}

      {loading ? null : bookings.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-dashed border-ink/20 p-10 text-center text-ink-soft">
          <Inbox className="mx-auto h-8 w-8 text-ink/25" />
          <p className="mt-3">No bookings on your listings yet.</p>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {bookings.map((b) => (
            <div key={b._id} className="rounded-2xl border border-ink/10 bg-paper p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-lg font-semibold text-ink">{b.property?.title || "Listing removed"}</h3>
                  <p className="text-sm text-ink-soft">{b.property?.location}</p>
                </div>
                <Badge tone={tone(b.status)}>{b.status}</Badge>
              </div>

              <p className="mt-3 font-mono text-xs text-ink-soft">
                {dateIN(b.startDate)} &rarr; {dateIN(b.endDate)} &middot; {inr(b.totalPrice)} total
              </p>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-dashed border-ink/15 pt-3">
                <div className="text-sm">
                  <p className="font-semibold text-ink">{b.tenant?.name || b.tenant?.username || "Unknown tenant"}</p>
                  <div className="mt-1 flex flex-wrap gap-x-5 gap-y-1 text-ink-soft">
                    {b.tenant?.phone && (
                      <a href={`tel:+91${b.tenant.phone}`} className="flex items-center gap-1.5 hover:text-ink">
                        <Phone size={13} /> +91 {b.tenant.phone}
                      </a>
                    )}
                    {b.tenant?.email && (
                      <a href={`mailto:${b.tenant.email}`} className="flex items-center gap-1.5 hover:text-ink">
                        <Mail size={13} /> {b.tenant.email}
                      </a>
                    )}
                  </div>
                </div>
                {b.status !== "cancelled" && (
                  <Button variant="danger" size="sm" onClick={() => handleCancel(b)}>Cancel booking</Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingsReceived;