import { useState } from "react";
import PropTypes from "prop-types";
import { X } from "lucide-react";
import { createBooking } from "../../utils/api";
import { Alert } from "../ui/Feedback";
import Button from "../ui/Button";
import Field, { inputClasses } from "../ui/Field";

const todayStr = () => new Date().toISOString().split("T")[0];

const BookingModal = ({ property, onClose, onBooked }) => {
  const [startDate, setStartDate] = useState(todayStr());
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!endDate || endDate <= startDate) {
      setError("Move-out date must be after move-in date.");
      return;
    }

    setSubmitting(true);
    try {
      const booking = await createBooking({ propertyId: property._id, startDate, endDate });
      onBooked(booking);
    } catch (err) {
      setError(err.response?.data?.message || "Could not complete booking.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-ink/10 bg-paper p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-brass">Booking request</span>
            <h3 className="font-display text-xl font-semibold text-ink">{property.title}</h3>
            <p className="text-sm text-ink-soft">${property.price}/month &middot; {property.location}</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="rounded-full p-1 text-ink-soft hover:bg-ink/5">
            <X size={20} />
          </button>
        </div>

        {error && <div className="mt-4"><Alert kind="error">{error}</Alert></div>}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <Field label="Move-in date">
            <input
              type="date"
              className={inputClasses}
              value={startDate}
              min={todayStr()}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </Field>
          <Field label="Move-out date">
            <input
              type="date"
              className={inputClasses}
              value={endDate}
              min={startDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </Field>

          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="brass" className="flex-1" disabled={submitting}>
              {submitting ? "Booking..." : "Confirm booking"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

BookingModal.propTypes = {
  property: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onBooked: PropTypes.func.isRequired,
};

export default BookingModal;
