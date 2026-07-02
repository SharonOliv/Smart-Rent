import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, MapPin, ShieldCheck, Users, Sparkles } from "lucide-react";
import { fetchProperties } from "../utils/api";
import PropertyCard from "../components/property/PropertyCard";
import BookingModal from "../components/property/BookingModal";
import PinMark from "../components/ui/PinMark";
import Button from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [location, setLocation] = useState("");
  const [bookingFor, setBookingFor] = useState(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchProperties({ available: true })
      .then((data) => setFeatured(data.slice(0, 3)))
      .catch(() => setFeatured([]));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(location ? `/rent?location=${encodeURIComponent(location)}` : "/rent");
  };

  const handleBook = (property) => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/rent" } });
      return;
    }
    setBookingFor(property);
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-ink/10">
        <div className="absolute inset-0 bg-blueprint-grid opacity-[0.06]" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-brass/40 bg-brass/10 px-3 py-1 font-mono text-xs uppercase tracking-wide text-[#8a5a1f]">
              <PinMark className="h-3.5 w-3.5" strokeColor="#8a5a1f" />
              Listings updated daily
            </span>
            <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.08] text-ink sm:text-6xl">
              Find the place that
              <br /> actually fits your life.
            </h1>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-soft">
              Browse verified rentals, book your move-in dates instantly, and get matched with
              roommates who share your personality &mdash; all in one place.
            </p>

            <form
              onSubmit={handleSearch}
              className="mt-8 flex flex-col gap-2 rounded-2xl border border-ink/15 bg-paper p-2 shadow-sm sm:flex-row"
            >
              <div className="flex flex-1 items-center gap-2 px-3 py-2">
                <MapPin size={18} className="text-brass" />
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Search by city or neighborhood"
                  className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-soft/60"
                />
              </div>
              <Button type="submit" variant="primary" className="sm:w-auto">
                <Search size={16} /> Search
              </Button>
            </form>

            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 font-mono text-xs text-ink-soft">
              <span className="flex items-center gap-1.5"><ShieldCheck size={15} className="text-moss" /> Verified owners</span>
              <span className="flex items-center gap-1.5"><Users size={15} className="text-moss" /> Roommate matching</span>
              <span className="flex items-center gap-1.5"><Sparkles size={15} className="text-moss" /> 360&deg; VR tours</span>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="relative ml-auto h-[420px] w-[420px]">
              <div className="absolute inset-0 rounded-[2rem] border border-blueprint/25 bg-blueprint-grid bg-paper-deep" />
              <div className="absolute left-6 top-8 w-56 -rotate-3 overflow-hidden rounded-xl border-4 border-paper bg-ink/10 shadow-xl">
                <div className="flex h-36 items-center justify-center bg-ink/5">
                  <PinMark className="h-10 w-10 text-brass" />
                </div>
              </div>
              <div className="absolute bottom-10 right-4 w-48 rotate-6 overflow-hidden rounded-xl border-4 border-paper bg-moss/10 shadow-xl">
                <div className="flex h-32 items-center justify-center bg-moss/10">
                  <PinMark className="h-9 w-9 text-moss" />
                </div>
              </div>
              <div className="absolute right-16 top-2 rounded-full border border-brass/40 bg-paper px-3 py-1.5 font-mono text-[11px] text-[#8a5a1f] shadow">
                ✓ Verified listing
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured listings */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="flex items-end justify-between">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-brass">Fresh on the market</span>
            <h2 className="mt-1 font-display text-3xl font-semibold text-ink">Featured listings</h2>
          </div>
          <Link to="/rent" className="hidden text-sm font-semibold text-blueprint hover:underline sm:block">
            View all listings &rarr;
          </Link>
        </div>

        {featured.length === 0 ? (
          <p className="mt-8 text-ink-soft">No listings yet. Be the first to post one.</p>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((property) => (
              <PropertyCard key={property._id} property={property} onBook={handleBook} />
            ))}
          </div>
        )}
        <Link to="/rent" className="mt-8 block text-center text-sm font-semibold text-blueprint hover:underline sm:hidden">
          View all listings &rarr;
        </Link>
      </section>

      {/* How it works */}
      <section className="border-y border-ink/10 bg-paper-deep">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <h2 className="font-display text-3xl font-semibold text-ink">How Smart Rent works</h2>
          <div className="mt-10 grid gap-10 sm:grid-cols-3">
            {[
              { title: "Take the quiz", body: "A short personality quiz helps us understand how you live, so matches actually make sense." },
              { title: "Browse & tour", body: "Filter listings by location and budget, then step inside with a 360\u00b0 VR walkthrough." },
              { title: "Book with confidence", body: "Pick your move-in dates and book directly \u2014 no back-and-forth, no double bookings." },
            ].map((step, i) => (
              <div key={step.title} className="relative pl-10">
                <span className="absolute left-0 top-0 font-display text-3xl font-semibold text-brass/40">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-xl font-semibold text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-5 py-16 text-center sm:px-8">
        <h2 className="font-display text-3xl font-semibold text-ink">Have a property to list?</h2>
        <p className="mx-auto mt-3 max-w-lg text-ink-soft">
          Post it in minutes, reach tenants directly, and manage bookings from one dashboard.
        </p>
        <div className="mt-6">
          <Link to="/post">
            <Button variant="brass" size="lg">List your property</Button>
          </Link>
        </div>
      </section>

      {bookingFor && (
        <BookingModal property={bookingFor} onClose={() => setBookingFor(null)} onBooked={() => setBookingFor(null)} />
      )}
    </div>
  );
};

export default Home;
