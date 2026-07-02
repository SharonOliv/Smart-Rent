import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { SlidersHorizontal, Users } from "lucide-react";
import { fetchProperties } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import PropertyCard from "../components/property/PropertyCard";
import BookingModal from "../components/property/BookingModal";
import { Alert } from "../components/ui/Feedback";
import Button from "../components/ui/Button";
import { inputClasses } from "../components/ui/Field";
import PinMark from "../components/ui/PinMark";

const Rent = () => {
  const [searchParams] = useSearchParams();
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingFor, setBookingFor] = useState(null);
  const [bookedMessage, setBookedMessage] = useState("");
  const [filters, setFilters] = useState({
    location: searchParams.get("location") || "",
    minPrice: "",
    maxPrice: "",
    bedrooms: "",
  });
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const loadHouses = async (params = {}) => {
    setLoading(true);
    try {
      const query = { available: true };
      if (params.location || filters.location) query.location = params.location ?? filters.location;
      if ((params.minPrice ?? filters.minPrice)) query.minPrice = params.minPrice ?? filters.minPrice;
      if ((params.maxPrice ?? filters.maxPrice)) query.maxPrice = params.maxPrice ?? filters.maxPrice;
      if ((params.bedrooms ?? filters.bedrooms)) query.bedrooms = params.bedrooms ?? filters.bedrooms;

      const data = await fetchProperties(query);
      setHouses(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching houses:", err.message);
      setError("Failed to load houses. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHouses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleApplyFilters = (e) => {
    e.preventDefault();
    loadHouses();
  };

  const handleBookClick = (house) => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/rent" } });
      return;
    }
    setBookingFor(house);
  };

  const handleBooked = () => {
    setBookingFor(null);
    setBookedMessage("Booking confirmed! Check 'My Bookings' for details.");
    loadHouses();
    setTimeout(() => setBookedMessage(""), 4000);
  };

  const handleRoommateClick = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/matches" } });
      return;
    }
    navigate("/matches");
  };

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-brass">Browse</span>
          <h1 className="mt-1 font-display text-4xl font-semibold text-ink">Available rentals</h1>
        </div>
        <Button variant="outline" onClick={handleRoommateClick}>
          <Users size={16} /> Find roommate matches
        </Button>
      </div>

      <form
        onSubmit={handleApplyFilters}
        className="mt-8 grid grid-cols-2 gap-3 rounded-2xl border border-ink/10 bg-paper-deep p-4 sm:grid-cols-4 lg:grid-cols-5"
      >
        <input
          name="location"
          placeholder="Location"
          className={`${inputClasses} col-span-2 sm:col-span-2 lg:col-span-2`}
          value={filters.location}
          onChange={handleFilterChange}
        />
        <input
          name="minPrice"
          type="number"
          placeholder="Min $/mo"
          className={inputClasses}
          value={filters.minPrice}
          onChange={handleFilterChange}
        />
        <input
          name="maxPrice"
          type="number"
          placeholder="Max $/mo"
          className={inputClasses}
          value={filters.maxPrice}
          onChange={handleFilterChange}
        />
        <Button type="submit" variant="primary" className="col-span-2 sm:col-span-1">
          <SlidersHorizontal size={15} /> Apply
        </Button>
      </form>

      {bookedMessage && <div className="mt-6"><Alert kind="success">{bookedMessage}</Alert></div>}
      {error && <div className="mt-6"><Alert kind="error">{error}</Alert></div>}

      {loading ? (
        <div className="mt-16 flex justify-center">
          <PinMark className="h-10 w-10 animate-pulse" strokeColor="#C2873E" />
        </div>
      ) : houses.length === 0 ? (
        <div className="mt-16 text-center text-ink-soft">
          <PinMark className="mx-auto h-10 w-10 text-ink/15" />
          <p className="mt-3">No listings match your search yet.</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {houses.map((house) => (
            <PropertyCard key={house._id} property={house} onBook={handleBookClick} />
          ))}
        </div>
      )}

      {bookingFor && (
        <BookingModal property={bookingFor} onClose={() => setBookingFor(null)} onBooked={handleBooked} />
      )}
    </div>
  );
};

export default Rent;
