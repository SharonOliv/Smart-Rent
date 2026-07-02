import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { MapPin, BedDouble, Bath } from "lucide-react";
import { fileUrl } from "../../utils/api";
import PinMark from "../ui/PinMark";

const PropertyCard = ({ property, onBook }) => {
  const cover = property.images?.[0];

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-ink/10 bg-paper transition-shadow hover:shadow-xl hover:shadow-ink/10">
      <div className="relative aspect-[4/3] overflow-hidden bg-ink/5">
        {cover ? (
          <img
            src={fileUrl(cover)}
            alt={property.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <PinMark className="h-12 w-12 text-ink/15" />
          </div>
        )}
        <div className="absolute left-3 top-3 rounded-md bg-ink px-2.5 py-1 font-mono text-xs text-paper shadow">
          ${property.price}<span className="text-paper/60">/mo</span>
        </div>
        {!property.available && (
          <div className="absolute right-3 top-3 rounded-md bg-clay px-2.5 py-1 text-xs font-semibold text-paper">
            Booked
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="font-display text-lg font-semibold leading-tight text-ink">{property.title}</h3>
          <p className="mt-1 flex items-center gap-1 text-sm text-ink-soft">
            <MapPin size={14} className="shrink-0 text-brass" />
            {property.location}
          </p>
        </div>

        <p className="line-clamp-2 text-sm text-ink-soft">{property.description}</p>

        <div className="my-1 border-t border-dashed border-ink/15" />

        <div className="flex items-center gap-4 font-mono text-xs text-ink-soft">
          <span className="flex items-center gap-1"><BedDouble size={14} /> {property.bedrooms} bed</span>
          <span className="flex items-center gap-1"><Bath size={14} /> {property.bathrooms} bath</span>
        </div>

        <div className="mt-auto flex items-center gap-2 pt-2">
          <Link
            to={`/vr-viewer?image=${encodeURIComponent(cover ? fileUrl(cover) : "")}&title=${encodeURIComponent(property.title)}`}
            className="flex-1 rounded-full border border-ink/20 px-3 py-2 text-center text-sm font-medium text-ink hover:border-ink"
          >
            View in VR
          </Link>
          <button
            onClick={() => onBook(property)}
            disabled={!property.available}
            className="flex-1 rounded-full bg-ink px-3 py-2 text-sm font-semibold text-paper hover:bg-blueprint disabled:cursor-not-allowed disabled:bg-ink/30"
          >
            {property.available ? "Book now" : "Unavailable"}
          </button>
        </div>
      </div>
    </div>
  );
};

PropertyCard.propTypes = {
  property: PropTypes.object.isRequired,
  onBook: PropTypes.func.isRequired,
};

export default PropertyCard;
