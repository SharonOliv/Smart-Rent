import { useState } from "react";
import { Link } from "react-router-dom";
import { requestPasswordReset } from "../utils/api";
import { Alert } from "../components/ui/Feedback";
import Button from "../components/ui/Button";
import Field, { inputClasses } from "../components/ui/Field";
import PinMark from "../components/ui/PinMark";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = await requestPasswordReset(email.trim());
      setMessage(data.message);
      setIsError(false);
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong.");
      setIsError(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-5 py-16 sm:px-0">
      <div className="mb-8 text-center">
        <PinMark className="mx-auto h-10 w-10" strokeColor="#16232B" fillColor="#C2873E" />
        <h1 className="mt-4 font-display text-3xl font-semibold text-ink">Reset your password</h1>
        <p className="mt-1 text-sm text-ink-soft">We'll email you a link to set a new one.</p>
      </div>

      <div className="rounded-2xl border border-ink/10 bg-paper p-7 shadow-sm">
        {message && <div className="mb-4"><Alert kind={isError ? "error" : "success"}>{message}</Alert></div>}
        <form onSubmit={handleReset} className="space-y-4">
          <Field label="Email">
            <input
              type="email"
              className={inputClasses}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Field>
          <Button type="submit" variant="primary" className="w-full" disabled={submitting}>
            {submitting ? "Sending..." : "Send reset link"}
          </Button>
          <Link to="/login" className="block text-center text-sm text-ink-soft hover:text-ink">Back to login</Link>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;