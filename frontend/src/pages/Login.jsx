import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Alert } from "../components/ui/Feedback";
import Button from "../components/ui/Button";
import Field, { inputClasses } from "../components/ui/Field";
import PinMark from "../components/ui/PinMark";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(username.trim(), password);
      navigate(location.state?.from || "/", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Invalid username or password.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-5 py-16 sm:px-0">
      <div className="mb-8 text-center">
        <PinMark className="mx-auto h-10 w-10" strokeColor="#16232B" fillColor="#C2873E" />
        <h1 className="mt-4 font-display text-3xl font-semibold text-ink">Welcome back</h1>
        <p className="mt-1 text-sm text-ink-soft">Log in to manage your bookings and listings.</p>
      </div>

      <div className="rounded-2xl border border-ink/10 bg-paper p-7 shadow-sm">
        {error && <div className="mb-4"><Alert kind="error">{error}</Alert></div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Username">
            <input
              type="text"
              className={inputClasses}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. sharon"
              required
            />
          </Field>
          <Field label="Password">
            <input
              type="password"
              className={inputClasses}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </Field>
          <Button type="submit" variant="primary" className="w-full" disabled={submitting}>
            {submitting ? "Logging in..." : "Log in"}
          </Button>
          <div className="flex items-center justify-between text-sm">
            <Link to="/forgot-password" className="text-blueprint hover:underline">Forgot password?</Link>
            <Link to="/signup" className="text-ink-soft hover:text-ink">Create account</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
