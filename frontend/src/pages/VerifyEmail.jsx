import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Alert } from "../components/ui/Feedback";
import PinMark from "../components/ui/PinMark";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { verifyEmail } = useAuth();
  const [status, setStatus] = useState("verifying"); // "verifying" | "error"
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    verifyEmail(token)
      .then(() => {
        if (!cancelled) navigate("/personality-form", { replace: true });
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.response?.data?.message || "Verification failed. The link may have expired.");
          setStatus("error");
        }
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-5 py-16 text-center sm:px-0">
      <PinMark className="mx-auto h-10 w-10" strokeColor="#16232B" fillColor="#C2873E" />
      {status === "verifying" ? (
        <>
          <h1 className="mt-4 font-display text-2xl font-semibold text-ink">Confirming your email...</h1>
          <p className="mt-2 text-sm text-ink-soft">This will only take a moment.</p>
        </>
      ) : (
        <>
          <h1 className="mt-4 font-display text-2xl font-semibold text-ink">Link didn&apos;t work</h1>
          <div className="mt-4"><Alert kind="error">{error}</Alert></div>
          <p className="mt-4 text-sm text-ink-soft">
            <Link to="/signup" className="text-blueprint hover:underline">Sign up again</Link> or contact support if this keeps happening.
          </p>
        </>
      )}
    </div>
  );
};

export default VerifyEmail;