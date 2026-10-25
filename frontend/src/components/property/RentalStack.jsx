import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { MapPin, BedDouble, Bath, Home as HomeIcon } from "lucide-react";
import { fileUrl } from "../../utils/api";
import { inr } from "../../utils/format";

const VISIBLE = 4;     // cards you can see in the pile
const HOLD_MS = 1500;  // how long each card sits on top
const FLICK_MS = 450;  // flick-off animation time

const RentalStack = ({ properties }) => {
  const [top, setTop] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [paused, setPaused] = useState(false);

  // The card that flicks away must land hidden at the back, so the pile needs VISIBLE + 1 cards.
  // With few listings, they repeat to fill it.
  const cards = useMemo(() => {
    const list = properties.slice(0, 8);
    if (list.length === 0) return [];
    const reps = Math.ceil((VISIBLE + 1) / list.length);
    return Array.from({ length: reps }, () => list).flat();
  }, [properties]);

  const n = cards.length;
  const reduceMotion =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // idle -> (HOLD_MS) -> leaving -> (FLICK_MS) -> next card on top -> idle
  useEffect(() => {
    if (n === 0) return;
    if (!leaving && (paused || reduceMotion)) return;
    const id = setTimeout(
      () => {
        if (!leaving) setLeaving(true);
        else {
          setTop((t) => (t + 1) % n);
          setLeaving(false);
        }
      },
      leaving ? FLICK_MS : HOLD_MS
    );
    return () => clearTimeout(id);
  }, [leaving, top, paused, n, reduceMotion]);

  if (n === 0) return null;

  return (
    <div
      className="mx-auto w-[360px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative h-[424px]">
        {cards.map((p, i) => {
          const pos = (i - top + n) % n;                         // 0 = top of the pile
          const vp = leaving ? (pos === 0 ? -1 : pos - 1) : pos; // while flicking, the rest already step up
          const gone = vp === -1;
          const hidden = vp >= VISIBLE;
          const d = Math.min(Math.max(vp, 0), VISIBLE);
          const tilt = vp <= 0 ? 0 : vp % 2 ? 1.6 : -1.6;

          return (
            <Link
              key={`${p._id}-${i}`}
              to="/rent"
              aria-hidden={pos !== 0}
              tabIndex={pos === 0 ? 0 : -1}
              className="absolute inset-x-0 top-0 block h-[360px] overflow-hidden rounded-2xl border border-ink/10 bg-paper shadow-lg shadow-ink/10"
              style={{
                transformOrigin: "50% 100%",
                transform: gone
                  ? "translate(115%, -24px) rotate(14deg)"
                  : `translateY(${d * 18}px) scale(${1 - d * 0.05}) rotate(${tilt}deg)`,
                opacity: gone || hidden ? 0 : 1,
                zIndex: gone ? n + 1 : n - vp,
                pointerEvents: pos === 0 ? "auto" : "none",
                transition: `transform ${FLICK_MS}ms cubic-bezier(.22,.8,.3,1), opacity ${FLICK_MS}ms ease`,
              }}
            >
              <div className="relative h-[210px] bg-paper-deep">
                {p.images?.[0] ? (
                  <img src={fileUrl(p.images[0])} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-ink/20">
                    <HomeIcon size={48} />
                  </div>
                )}
                <span className="absolute left-3 top-3 rounded-md bg-ink px-2.5 py-1 font-mono text-xs text-paper shadow">
                  {inr(p.price)}<span className="text-paper/60">/mo</span>
                </span>
              </div>
              <div className="p-4">
                <h3 className="truncate font-display text-lg font-semibold text-ink">{p.title}</h3>
                <p className="mt-1 flex items-center gap-1 truncate text-sm text-ink-soft">
                  <MapPin size={14} className="shrink-0 text-blueprint" /> {p.location}
                </p>
                <div className="mt-3 flex gap-4 font-mono text-xs text-ink-soft">
                  <span className="flex items-center gap-1"><BedDouble size={14} /> {p.bedrooms} bed</span>
                  <span className="flex items-center gap-1"><Bath size={14} /> {p.bathrooms} bath</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <p className="mt-2 flex items-center justify-center gap-2 font-mono text-[11px] text-ink-soft">
        <span className="h-2 w-2 animate-pulse rounded-full bg-moss" />
        {properties.length} available now
      </p>
    </div>
  );
};

RentalStack.propTypes = {
  properties: PropTypes.array.isRequired,
};

export default RentalStack;