import { useLocation, useNavigate, Link } from "react-router-dom";
import PinMark from "../components/ui/PinMark";
import Button from "../components/ui/Button";

const PersonalityResult = () => {
  const { state } = useLocation();
  const { personalityType } = state || {};
  const navigate = useNavigate();

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-5 py-16 text-center sm:px-0">
      <PinMark className="h-12 w-12" strokeColor="#16232B" fillColor="#C2873E" />
      {personalityType ? (
        <>
          <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.12em] text-brass">Your personality type</p>
          <h1 className="mt-2 font-display text-6xl font-semibold text-ink">{personalityType}</h1>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-soft">
            We'll use this to surface roommates who are likely to get along with you &mdash; and flag the
            ones who might clash.
          </p>
          <div className="mt-7">
            <Button variant="brass" size="lg" onClick={() => navigate("/matches")}>
              See roommate matches
            </Button>
          </div>
        </>
      ) : (
        <>
          <h1 className="mt-5 font-display text-2xl font-semibold text-ink">No result found</h1>
          <p className="mt-2 text-ink-soft">Please retake the quiz.</p>
          <Link to="/personality-form" className="mt-5 text-sm font-semibold text-blueprint hover:underline">
            Take the quiz &rarr;
          </Link>
        </>
      )}
    </div>
  );
};

export default PersonalityResult;
