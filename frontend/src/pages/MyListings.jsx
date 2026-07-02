import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PlusCircle, MapPin } from "lucide-react";
import { fetchMyProperties, fileUrl } from "../utils/api";
import { Badge } from "../components/ui/Feedback";
import Button from "../components/ui/Button";
import PinMark from "../components/ui/PinMark";

const MyListings = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyProperties()
      .then(setProperties)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-5 py-12 sm:px-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-brass">Owner dashboard</span>
          <h1 className="mt-1 font-display text-4xl font-semibold text-ink">My listings</h1>
        </div>
        <Link to="/post">
          <Button variant="brass"><PlusCircle size={16} /> New listing</Button>
        </Link>
      </div>

      {loading ? (
        <div className="mt-16 flex justify-center"><PinMark className="h-10 w-10 animate-pulse" strokeColor="#C2873E" /></div>
      ) : properties.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-dashed border-ink/20 p-10 text-center text-ink-soft">
          <PinMark className="mx-auto h-9 w-9 text-ink/20" />
          <p className="mt-3">You haven't listed a property yet.</p>
          <Link to="/post" className="mt-3 inline-block text-sm font-semibold text-blueprint hover:underline">
            Post your first listing &rarr;
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {properties.map((p) => (
            <div key={p._id} className="flex items-center gap-4 rounded-2xl border border-ink/10 bg-paper p-4">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-ink/5">
                {p.images?.[0] ? (
                  <img src={fileUrl(p.images[0])} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center"><PinMark className="h-6 w-6 text-ink/20" /></div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-display text-lg font-semibold text-ink">{p.title}</h3>
                <p className="flex items-center gap-1 text-sm text-ink-soft"><MapPin size={13} className="text-brass" />{p.location}</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-sm text-ink">${p.price}/mo</p>
                <Badge tone={p.available ? "moss" : "neutral"}>{p.available ? "Available" : "Booked"}</Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyListings;
