import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { savePersonality } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { Alert } from "../components/ui/Feedback";
import Button from "../components/ui/Button";
import PinMark from "../components/ui/PinMark";

const questions = [
  {
    question: "At a social gathering, you tend to:",
    trait: "energy",
    options: [
      { value: "I", label: "Stay close to a few people you know well" },
      { value: "E", label: "Work the room and meet new people" },
    ],
  },
  {
    question: "When taking in information, you trust:",
    trait: "information",
    options: [
      { value: "S", label: "Concrete facts and details" },
      { value: "N", label: "Patterns, ideas, and possibilities" },
    ],
  },
  {
    question: "When making a decision, you lean on:",
    trait: "decision",
    options: [
      { value: "T", label: "Logic and consistency" },
      { value: "F", label: "Values and how it affects people" },
    ],
  },
  {
    question: "Around the house, you prefer to:",
    trait: "lifestyle",
    options: [
      { value: "J", label: "Plan ahead and keep things tidy" },
      { value: "P", label: "Stay flexible and go with the flow" },
    ],
  },
];

const PersonalityForm = () => {
  const [answers, setAnswers] = useState({});
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { setUser, isAuthenticated } = useAuth();

  const current = questions[step];
  const progress = Math.round(((step + (answers[current.trait] ? 1 : 0)) / questions.length) * 100);

  const handlePick = (value) => {
    setAnswers((prev) => ({ ...prev, [current.trait]: value }));
  };

  const classify = (a) => {
    const { energy, information, decision, lifestyle } = a;
    return energy && information && decision && lifestyle
      ? `${energy}${information}${decision}${lifestyle}`
      : null;
  };

  const goNext = async () => {
    if (step < questions.length - 1) {
      setStep((s) => s + 1);
      return;
    }

    const personalityType = classify(answers);
    if (!personalityType) return;

    if (!isAuthenticated) {
      navigate("/personality-result", { state: { personalityType } });
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const { user } = await savePersonality(personalityType);
      setUser(user);
      navigate("/personality-result", { state: { personalityType } });
    } catch (err) {
      setError(err.response?.data?.message || "Could not save your personality type.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-xl flex-col justify-center px-5 py-16 sm:px-0">
      <div className="mb-6 text-center">
        <PinMark className="mx-auto h-9 w-9" strokeColor="#16232B" fillColor="#C2873E" />
        <h1 className="mt-3 font-display text-3xl font-semibold text-ink">Discover your personality</h1>
        <p className="mt-1 text-sm text-ink-soft">Four quick questions power your roommate matches.</p>
      </div>

      <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-ink/10">
        <div className="h-full bg-brass transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      {error && <div className="mb-4"><Alert kind="error">{error}</Alert></div>}

      <div className="rounded-2xl border border-ink/10 bg-paper p-7 shadow-sm">
        <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-brass">
          Question {step + 1} of {questions.length}
        </span>
        <h2 className="mt-2 font-display text-xl font-semibold text-ink">{current.question}</h2>

        <div className="mt-5 space-y-3">
          {current.options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handlePick(opt.value)}
              className={`w-full rounded-xl border px-4 py-3.5 text-left text-sm transition-colors ${
                answers[current.trait] === opt.value
                  ? "border-brass bg-brass/10 text-ink"
                  : "border-ink/15 text-ink-soft hover:border-ink/30"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="text-sm text-ink-soft hover:text-ink disabled:opacity-30"
          >
            Back
          </button>
          <Button onClick={goNext} disabled={!answers[current.trait] || submitting} variant="primary">
            {step < questions.length - 1 ? "Next" : submitting ? "Saving..." : "See my type"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PersonalityForm;
