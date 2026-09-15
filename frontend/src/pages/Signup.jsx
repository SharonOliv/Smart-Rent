import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Alert } from "../components/ui/Feedback";
import Button from "../components/ui/Button";
import Field, { inputClasses } from "../components/ui/Field";
import PinMark from "../components/ui/PinMark";

const Signup = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const { signup } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await signup(form);
      setSent(true); // don't navigate — account isn't active until email is verified
    } catch (err) {
      setError(err.response?.data?.message || "Error signing up. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-5 py-16 text-center sm:px-0">
        <PinMark className="mx-auto h-10 w-10" strokeColor="#16232B" fillColor="#C2873E" />
        <h1 className="mt-4 font-display text-2xl font-semibold text-ink">Check your inbox</h1>
        <p className="mt-2 text-sm text-ink-soft">
          We sent a confirmation link to <span className="font-medium text-ink">{form.email}</span>.
          Click it to verify your email and activate your account.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-5 py-16 sm:px-0">
      <div className="mb-8 text-center">
        <PinMark className="mx-auto h-10 w-10" strokeColor="#16232B" fillColor="#C2873E" />
        <h1 className="mt-4 font-display text-3xl font-semibold text-ink">Create your account</h1>
        <p className="mt-1 text-sm text-ink-soft">Just the basics — everything else can wait for your profile.</p>
      </div>

      <div className="rounded-2xl border border-ink/10 bg-paper p-7 shadow-sm">
        {error && <div className="mb-4"><Alert kind="error">{error}</Alert></div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Full name">
            <input name="name" className={inputClasses} value={form.name} onChange={handleChange} required />
          </Field>
          <Field label="Gmail address">
            <input
              type="email"
              name="email"
              pattern="^[a-zA-Z0-9._%+\-]+@gmail\.com$"
              title="Please use a Gmail address"
              className={inputClasses}
              value={form.email}
              onChange={handleChange}
              required
            />
          </Field>
          <Field label="Password">
            <input
              type="password"
              name="password"
              className={inputClasses}
              value={form.password}
              onChange={handleChange}
              minLength={6}
              required
            />
          </Field>
          <Button type="submit" variant="primary" className="w-full" disabled={submitting}>
            {submitting ? "Sending confirmation..." : "Create account"}
          </Button>
          <p className="text-center text-sm text-ink-soft">
            Already have an account? <Link to="/login" className="text-blueprint hover:underline">Log in</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;